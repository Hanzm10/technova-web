'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Database } from '@/types/database.types'
import { CatalogFilters } from '@/components/catalog/CatalogFilters'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import { Marquee } from '@/components/landing/Marquee'

type Product = Database['public']['Tables']['products']['Row']

const CatalogContent = () => {
    const searchParams = useSearchParams()
    const activeCategory = searchParams.get('category') || 'all'
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true)
            try {
                let query = supabase.from('products').select('*')

                if (activeCategory !== 'all') {
                    query = query.ilike('category', activeCategory)
                }

                const { data, error } = await query

                if (error) throw error
                setProducts(data || [])
            } catch (error) {
                console.error('Error fetching products:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProducts()
    }, [activeCategory, supabase])

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tighter mb-4">
                EXPLORE <br /> THE <span className="text-slate-500 italic font-serif font-normal">catalog</span>
            </h1>
            <p className="text-slate-500 max-w-md mb-12">
                Discover our curated selection of high-performance gear and essential life enhancements.
            </p>

            <CatalogFilters />
            <ProductGrid products={products} isLoading={isLoading} />
        </div>
    )
}

export default function CatalogPage() {
    return (
        <div className="min-h-screen bg-[#E8ECEF] pt-24">
            <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 z-0 opacity-10 pointer-events-none overflow-hidden">
                <Marquee text="TECHNOVA / CATALOG / INNOVATION /" />
            </div>

            <Suspense fallback={<div className="container mx-auto px-6 py-24">Loading catalog...</div>}>
                <CatalogContent />
            </Suspense>
        </div>
    )
}
