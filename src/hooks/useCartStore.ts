import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Database } from '@/types/database.types'
import { createClient } from '@/utils/supabase/client'

type Product = Database['public']['Tables']['products']['Row']
type CartItemDB = Database['public']['Tables']['cart_items']['Row']

export interface CartItem extends Product {
    quantity: number
}

interface CartStore {
    items: CartItem[]
    totalPrice: number
    addItem: (product: Product, userId?: string, token?: string | null) => Promise<void>
    removeItem: (productId: string, userId?: string, token?: string | null) => Promise<void>
    updateQuantity: (productId: string, quantity: number, userId?: string, token?: string | null) => Promise<void>
    clearCart: () => void
    syncCart: (userId: string, token?: string | null) => Promise<void>
}

// Helper to get auth context from window if not provided directly
const getAuthFromWindow = async (userId?: string, token?: string | null) => {
    let currentUserId = userId
    let currentToken = token

    if (typeof window !== 'undefined' && (window as any).Clerk?.session) {
        try {
            if (!currentUserId) currentUserId = (window as any).Clerk.user?.id
            if (!currentToken) currentToken = await (window as any).Clerk.session.getToken({ template: 'supabase' })
        } catch (e) {
            console.error('Error fetching clerk token in cart store:', e)
        }
    }

    return { userId: currentUserId, token: currentToken }
}

// Helper to get or create a cart for a user
const getOrCreateCart = async (supabase: any, userId: string) => {
    // Try to get existing cart
    let { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', userId)
        .single()

    // Create if not exists
    if (!cart) {
        const { data: newCart, error } = await supabase
            .from('carts')
            .insert({ user_id: userId })
            .select('id')
            .single()

        if (error) {
            console.error('Error creating cart:', error)
            return null
        }
        cart = newCart
    }
    return cart.id
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            totalPrice: 0,

            addItem: async (product, userId, token) => {
                const items = get().items
                const existingItem = items.find((item) => item.id === product.id)
                let newItems

                if (existingItem) {
                    newItems = items.map((item) =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                } else {
                    newItems = [...items, { ...product, quantity: 1 }]
                }

                const total = newItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
                set({ items: newItems, totalPrice: total })

                // DB Sync
                const auth = await getAuthFromWindow(userId, token)
                if (auth.userId) {
                    const supabase = createClient(auth.token)
                    const cartId = await getOrCreateCart(supabase, auth.userId)
                    if (cartId) {
                        const newQuantity = existingItem ? existingItem.quantity + 1 : 1

                        await supabase
                            .from('cart_items')
                            .upsert(
                                { cart_id: cartId, product_id: product.id, quantity: newQuantity },
                                { onConflict: 'cart_id,product_id' }
                            )
                    }
                }
            },

            removeItem: async (productId, userId, token) => {
                const items = get().items.filter((item) => item.id !== productId)
                const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
                set({ items, totalPrice: total })

                // DB Sync
                const auth = await getAuthFromWindow(userId, token)
                if (auth.userId) {
                    const supabase = createClient(auth.token)
                    const cartId = await getOrCreateCart(supabase, auth.userId)
                    if (cartId) {
                        await supabase
                            .from('cart_items')
                            .delete()
                            .match({ cart_id: cartId, product_id: productId })
                    }
                }
            },

            updateQuantity: async (productId, quantity, userId, token) => {
                const safeQuantity = Math.max(1, quantity)
                const items = get().items.map((item) =>
                    item.id === productId ? { ...item, quantity: safeQuantity } : item
                )
                const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
                set({ items, totalPrice: total })

                // DB Sync
                const auth = await getAuthFromWindow(userId, token)
                if (auth.userId) {
                    const supabase = createClient(auth.token)
                    const cartId = await getOrCreateCart(supabase, auth.userId)
                    if (cartId) {
                        await supabase
                            .from('cart_items')
                            .update({ quantity: safeQuantity })
                            .match({ cart_id: cartId, product_id: productId })
                    }
                }
            },

            clearCart: () => set({ items: [], totalPrice: 0 }),

            syncCart: async (userId, token) => {
                const supabase = createClient(token)
                const cartId = await getOrCreateCart(supabase, userId)

                if (!cartId) return

                const localItems = get().items

                // 1. Fetch remote items
                const { data: dbItems, error } = await supabase
                    .from('cart_items')
                    .select(`
                        quantity,
                        product_id,
                        products (
                            id,
                            name,
                            price,
                            image,
                            category,
                            tag,
                            created_at
                        )
                    `)
                    .eq('cart_id', cartId)

                if (error) {
                    console.error('Error fetching cart items:', error)
                    return
                }

                const remoteItemsMap = new Map((dbItems || []).map(item => [item.product_id, item]))

                // 2. Merge local into remote
                for (const localItem of localItems) {
                    const remoteItem = remoteItemsMap.get(localItem.id)
                    // Fix: Do not sum quantities. Take the larger of the two to resolve out-of-sync states
                    // without compounding them on every page refresh.
                    const mergedQuantity = remoteItem
                        ? Math.max(remoteItem.quantity, localItem.quantity)
                        : localItem.quantity

                    await supabase
                        .from('cart_items')
                        .upsert(
                            { cart_id: cartId, product_id: localItem.id, quantity: mergedQuantity },
                            { onConflict: 'cart_id,product_id' }
                        )
                }

                // 3. Re-fetch final state from DB to update local store
                const { data: finalDbItems } = await supabase
                    .from('cart_items')
                    .select(`
                        quantity,
                        products (
                            *
                        )
                    `)
                    .eq('cart_id', cartId)

                if (finalDbItems) {
                    const mergedStoreItems = finalDbItems
                        .filter(item => item.products)
                        .map(item => {
                            const p = item.products as unknown as Product
                            return {
                                ...p,
                                quantity: item.quantity
                            } as CartItem
                        })

                    const total = mergedStoreItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
                    set({ items: mergedStoreItems, totalPrice: total })
                }
            }
        }),
        {
            name: 'technova-cart-storage',
        }
    )
)
