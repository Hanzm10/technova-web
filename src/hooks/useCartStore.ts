import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Database } from '@/types/database.types'

type Product = Database['public']['Tables']['products']['Row']

export interface CartItem extends Product {
    quantity: number
}

interface CartStore {
    items: CartItem[]
    totalPrice: number
    addItem: (product: Product) => void
    removeItem: (productId: string) => void
    updateQuantity: (productId: string, quantity: number) => void
    clearCart: () => void
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            totalPrice: 0,

            addItem: (product) => {
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
            },

            removeItem: (productId) => {
                const items = get().items.filter((item) => item.id !== productId)
                const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
                set({ items, totalPrice: total })
            },

            updateQuantity: (productId, quantity) => {
                const items = get().items.map((item) =>
                    item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
                )
                const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
                set({ items, totalPrice: total })
            },

            clearCart: () => set({ items: [], totalPrice: 0 }),
        }),
        {
            name: 'technova-cart-storage',
        }
    )
)
