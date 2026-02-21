'use server'

import { createClerkSupabaseClient as createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateOrderStatus(orderId: string, status: string) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId)

        if (error) throw error

        revalidatePath('/dashboard/orders')
        revalidatePath('/dashboard')
        return { success: true }
    } catch (err: any) {
        console.error('Error updating order status:', err)
        return { error: err.message || 'Failed to update order status' }
    }
}
