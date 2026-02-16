'use server'

import { createClerkSupabaseClient } from '@/utils/supabase/server'
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

    const supabase = await createClerkSupabaseClient()

    // 1. Create Order
    const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: userId,
            total_price: params.totalPrice,
            status: 'completed' // Assuming immediate success from RevenueCat
        })
        .select()
        .single()

    if (orderError || !orderData) {
        throw new Error(`Failed to create order: ${orderError?.message}`)
    }

    const orderId = orderData.id

    // 2. Create Order Items
    const orderItems = params.items.map(item => ({
        order_id: orderId,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
    }))

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

    if (itemsError) {
        console.error('Failed to create order items', itemsError)
        // Ideally we would rollback the order here, but for now just throw
        throw new Error(`Failed to create order items: ${itemsError.message}`)
    }

    return { success: true, orderId }
}
