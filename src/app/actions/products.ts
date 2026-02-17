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
    const image = formData.get('image') as string

    if (!name || !price || !category || !image) {
        throw new Error('Missing required fields')
    }

    const { error } = await supabase.from('products').insert({
        name,
        price,
        category,
        image
    })

    if (error) {
        console.error('Error adding product:', error)
        throw new Error('Failed to add product')
    }

    revalidatePath('/dashboard/products')
    redirect('/dashboard/products')
}
