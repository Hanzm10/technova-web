'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Database } from '@/types/database.types'
import { ProductDetails } from '@/components/catalog/ProductDetails'
import { Marquee } from '@/components/landing/Marquee'

type Product = Database['public']['Tables']['products']['Row']

const ProductDetailsContent = () => {
    const { id } = useParams()
    const [product, setProduct] = useState<Product | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return

            setIsLoading(true)
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (error) throw error
                setProduct(data)
            } catch (err) {
                const errorBody = err as Error;
                console.error('Error fetching product:', errorBody)
                setError(errorBody.message || 'Product not found')
            } finally {
                setIsLoading(false)
            }
        }

        fetchProduct()
    }, [id, supabase])

    if (isLoading) {
        return (
            <div className="container mx-auto px-6 py-24 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
                    <p className="text-slate-500 font-medium font-serif italic">Loading product details...</p>
                </div>
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className="container mx-auto px-6 py-24 flex flex-col items-center justify-center min-h-[60vh]">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Product not found</h2>
                <p className="text-slate-500 mb-8">The product you are looking for doesn't exist or was removed.</p>
                <button
                    onClick={() => window.history.back()}
                    className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold"
                >
                    GO BACK
                </button>
            </div>
        )
    }

    return <ProductDetails product={product} />
}

export default function ProductDetailPage() {
    return (
        <div className="min-h-screen bg-[#E8ECEF] pt-24">
            <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 z-0 opacity-10 pointer-events-none overflow-hidden">
                <Marquee text="TECHNOVA / PRODUCT / EXCLUSIVITY /" />
            </div>

            <Suspense fallback={<div className="container mx-auto px-6 py-24">Loading...</div>}>
                <ProductDetailsContent />
            </Suspense>
        </div>
    )
}
