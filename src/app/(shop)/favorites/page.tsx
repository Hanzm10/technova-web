'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { useUser } from '@clerk/nextjs'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import { Database } from '@/types/database.types'

type Product = Database['public']['Tables']['products']['Row']

export default function FavoritesPage() {
    const { user, isLoaded, isSignedIn } = useUser()
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchFavoritedProducts = async () => {
            if (!isLoaded) return
            if (!isSignedIn || !user) {
                setProducts([])
                setIsLoading(false)
                return
            }

            try {
                // Get favorite product IDs
                const { data: favorites, error: favError } = await supabase
                    .from('favorites')
                    .select('product_id')
                    .eq('user_id', user.id)

                if (favError) throw favError

                if (!favorites || favorites.length === 0) {
                    setProducts([])
                    setIsLoading(false)
                    return
                }

                const productIds = favorites.map(f => f.product_id)

                // Get product details
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .in('id', productIds)

                if (error) throw error
                setProducts(data || [])
            } catch (error) {
                console.error('Error fetching favorites:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchFavoritedProducts()
    }, [user, isLoaded, isSignedIn, supabase])

    if (!isLoaded || isLoading) {
        return (
            <div className="min-h-screen bg-[#E8ECEF] pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="h-12 w-48 bg-slate-200 animate-pulse rounded-2xl mb-12" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-white rounded-[2.5rem] animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (!isSignedIn) {
        return (
            <div className="min-h-screen bg-[#E8ECEF] pt-32 pb-24 flex items-center justify-center">
                <div className="text-center max-w-md px-6">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                        <Heart size={32} className="text-slate-300" />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">Your Favorites</h1>
                    <p className="text-slate-500 mb-8">Sign in to save your favorite products and access them from any device.</p>
                    <Link href="/sign-in">
                        <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center gap-2 mx-auto">
                            SIGN IN NOW <ArrowRight size={18} />
                        </button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#E8ECEF] pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6">
                <header className="mb-12">
                    <h1 className="text-5xl font-bold text-slate-900 tracking-tighter mb-2">MY FAVORITES</h1>
                    <p className="text-slate-500 font-medium">
                        {products.length === 0
                            ? "You haven't favorited any products yet."
                            : `${products.length} ITEMS SAVED`}
                    </p>
                </header>

                {products.length === 0 ? (
                    <div className="py-24 text-center bg-white/50 backdrop-blur-md rounded-[3rem] border border-white/20">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <ShoppingBag size={24} className="text-slate-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Start your collection</h2>
                        <p className="text-slate-500 mb-8">Browse the shop and tap the heart icon to save products.</p>
                        <Link href="/catalog">
                            <button className="text-slate-900 font-bold border-b-2 border-slate-900 pb-1 hover:text-slate-500 hover:border-slate-500 transition-all">
                                EXPLORE SHOP
                            </button>
                        </Link>
                    </div>
                ) : (
                    <ProductGrid products={products} />
                )}
            </div>
        </div>
    )
}
