import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        return []
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data: products } = await supabase
        .from('products')
        .select('id, created_at')

    const productEntries: MetadataRoute.Sitemap = products?.map((product) => ({
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://technova-web.vercel.app'}/catalog/${product.id}`,
        lastModified: new Date(product.created_at),
        changeFrequency: 'weekly',
        priority: 0.8,
    })) ?? []

    return [
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://technova-web.vercel.app'}`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://technova-web.vercel.app'}/catalog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://technova-web.vercel.app'}/pricing`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        ...productEntries,
    ]
}
