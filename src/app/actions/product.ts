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

export async function updateProduct(formData: FormData) {
    const supabase = await createClient()

    const id = formData.get('id') as string
    const price = parseFloat(formData.get('price') as string)
    const category = formData.get('category') as string
    const imageFile = formData.get('image') as File | null

    if (!id || isNaN(price) || !category) {
        return { error: 'Missing required fields' }
    }

    try {
        let imageUrl = undefined

        if (imageFile && imageFile.size > 0) {
            const fileExt = imageFile.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(fileName, imageFile)

            if (uploadError) throw uploadError

            const { data: publicUrlData } = supabase.storage
                .from('product-images')
                .getPublicUrl(fileName)

            imageUrl = publicUrlData.publicUrl
        }

        const updates: any = { price, category }
        if (imageUrl) updates.image = imageUrl

        const { error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id)

        if (error) throw error

        revalidatePath('/dashboard/products')
        revalidatePath('/catalog')
        return { success: true }
    } catch (err: any) {
        console.error('Error updating product:', err)
        return { error: err.message || 'Failed to update product' }
    }
}
