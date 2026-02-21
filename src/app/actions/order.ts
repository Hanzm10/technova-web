'use server'

import { createClerkSupabaseClient } from '@/utils/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'

interface OrderItem {
    id: string
    quantity: number
    price: number
}

interface CreateOrderParams {
    items: OrderItem[]
    totalPrice: number
}

export async function createOrder(params: CreateOrderParams) {
    const { userId } = await auth()

    if (!userId) {
        throw new Error('Unauthorized')
    }

    // Use Service Role Key to bypass RLS for order creation
    // This ensures that even if there's a permission issue, we capture the order
    // after a successful payment.
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 0. Validate Prices Server-Side
    const productIds = params.items.map(item => item.id)
    const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, price')
        .in('id', productIds)

    if (productsError || !products) {
        throw new Error(`Failed to validate products: ${productsError?.message}`)
    }

    // Create a map for quick price lookup
    const priceMap = new Map(products.map(p => [p.id, p.price]))

    // Recalculate total price and validate items exist
    let calculatedTotal = 0
    const validatedItems = []

    for (const item of params.items) {
        const dbPrice = priceMap.get(item.id)

        if (dbPrice === undefined) {
            throw new Error(`Product not found: ${item.id}`)
        }

        // Optional: Ensure the price hasn't changed significantly or matches expected logic
        // For now, we trust the DB price as the source of truth
        calculatedTotal += dbPrice * item.quantity

        validatedItems.push({
            order_id: '', // Will be set after order creation
            product_id: item.id,
            quantity: item.quantity,
            price: dbPrice // Use DB price, not client price
        })
    }

    // Verify consistency (optional, but good for noticing frontend/backend drift)
    // allowing for small float errors
    if (Math.abs(calculatedTotal - params.totalPrice) > 0.01) {
        console.warn(`Price mismatch detected. Client: ${params.totalPrice}, Server: ${calculatedTotal}`)
        // We could throw here, but for now let's just use the server calculated total
    }

    // 1. Create Order
    const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
            profile_id: userId,
            total_price: calculatedTotal,
            status: 'completed' // Assuming immediate success from RevenueCat
        })
        .select()
        .single()

    if (orderError || !orderData) {
        throw new Error(`Failed to create order: ${orderError?.message}`)
    }

    const orderId = orderData.id

    // 2. Create Order Items
    const finalOrderItems = validatedItems.map(item => ({
        ...item,
        order_id: orderId
    }))

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(finalOrderItems)

    if (itemsError) {
        console.error(`FATAL: Failed to create order items for order ${orderId}. Items were validated but insertion failed.`, itemsError)
        // Note: In a production system, we'd use a DB transaction/RPC to prevent this orphan state.
        // For now, logging the orderId ensures we can manually recover if needed.
        throw new Error(`Critical persistence error: ${itemsError.message}. Order ID: ${orderId}`)
    }

    return { success: true, orderId }
}
