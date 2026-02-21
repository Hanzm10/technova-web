'use server'

import { createClerkSupabaseClient, getUserRole } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function addProduct(formData: FormData) {
    const role = await getUserRole()
    if (role !== 'admin') {
        throw new Error('Unauthorized: Admin access required')
    }

    const supabase = await createClerkSupabaseClient()

    const name = formData.get('name') as string
    const price = parseFloat(formData.get('price') as string)
    const category = formData.get('category') as string
    const imageFile = formData.get('image') as File | null

    if (!name || isNaN(price) || !category || !imageFile || imageFile.size === 0) {
        throw new Error('Missing required fields')
    }

    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile)

    if (uploadError) {
        console.error('Error uploading product image:', uploadError)
        throw new Error('Failed to upload product image')
    }

    const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)

    const image = publicUrlData.publicUrl

    const { error } = await supabase.from('products').insert({
        name,
        price,
        category,
        image
    })

    if (error) {
        console.error('Error adding product:', JSON.stringify(error, null, 2))
        throw new Error(`Failed to add product: ${error.message} - ${error.details || ''} - ${error.hint || ''}`)
    }

    revalidatePath('/dashboard/products')
    redirect('/dashboard/products')
}
