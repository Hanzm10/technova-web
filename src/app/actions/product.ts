'use server'

import { createClerkSupabaseClient as createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteProduct(productId: string) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', productId)

        if (error) throw error

        revalidatePath('/dashboard/products')
        revalidatePath('/catalog')
        return { success: true }
    } catch (err: any) {
        console.error('Error deleting product:', err)
        return { error: err.message || 'Failed to delete product' }
    }
}
