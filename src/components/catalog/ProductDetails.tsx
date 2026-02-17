'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingCart, Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Database } from '@/types/database.types'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/hooks/useCartStore'
import { useToastStore } from '@/hooks/useToastStore'
import { useFavorites } from '@/hooks/useFavorites'
import { cn } from '@/lib/utils'

type Product = Database['public']['Tables']['products']['Row']

interface ProductDetailsProps {
    product: Product
}

export const ProductDetails = ({ product }: ProductDetailsProps) => {
    const router = useRouter()
    const { addItem } = useCartStore()
    const { addToast } = useToastStore()
    const { isFavorite, toggleFavorite } = useFavorites()

    return (
        <div className="container mx-auto px-6 py-12 md:py-24">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium text-sm">BACK TO CATALOG</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Product Image */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-[3rem] bg-white shadow-2xl border border-slate-100"
                >
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                    />
                    {product.tag && (
                        <div className="absolute top-8 left-8">
                            <span className="px-4 py-2 rounded-full bg-slate-900/90 backdrop-blur-md text-xs font-bold uppercase tracking-widest text-white shadow-lg">
                                {product.tag}
                            </span>
                        </div>
                    )}
                </motion.div>

                {/* Product Info */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-col"
                >
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
                        {product.category}
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tighter mb-6 leading-none">
                        {product.name}
                    </h1>
                    <div className="flex items-baseline gap-4 mb-8">
                        <span className="text-3xl font-serif italic text-slate-900">
                            USD {product.price.toFixed(2)}
                        </span>
                        <span className="text-slate-400 line-through text-sm">
                            USD {(product.price * 1.2).toFixed(2)}
                        </span>
                    </div>

                    <p className="text-slate-600 text-lg leading-relaxed mb-12 max-w-md">
                        Experience the pinnacle of {product.category} with the {product.name}.
                        Engineered for high performance and designed for the modern aesthetic.
                    </p>

                    <div className="flex flex-row gap-4">
                        <Button
                            onClick={() => {
                                addItem(product)
                                addToast(`${product.name} added to cart`)
                            }}
                            className="flex-1 bg-slate-900 text-white hover:bg-slate-800 h-16 px-10 rounded-2xl flex items-center justify-center gap-3 text-lg font-bold shadow-xl shadow-slate-900/10 group"
                        >
                            <ShoppingCart size={20} />
                            ADD TO CART
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => toggleFavorite(product.id)}
                            className={cn(
                                "border-slate-200 h-16 w-16 min-w-[4rem] rounded-2xl flex items-center justify-center transition-all",
                                isFavorite(product.id)
                                    ? "bg-slate-900 text-white border-slate-900"
                                    : "text-slate-900 hover:bg-slate-50"
                            )}
                        >
                            <Heart size={24} fill={isFavorite(product.id) ? "currentColor" : "none"} />
                        </Button>
                    </div>

                    <div className="mt-12 pt-12 border-t border-slate-200 grid grid-cols-2 gap-8">
                        <div>
                            <span className="block text-[10px] font-bold text-slate-400 tracking-[0.2em] mb-2 uppercase">Shipping</span>
                            <span className="text-sm font-medium text-slate-900">Express Worldwide</span>
                        </div>
                        <div>
                            <span className="block text-[10px] font-bold text-slate-400 tracking-[0.2em] mb-2 uppercase">Returns</span>
                            <span className="text-sm font-medium text-slate-900">30-day Policy</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
