'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ChevronRight, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { Database } from '@/types/database.types'
import { useCartStore } from '@/hooks/useCartStore'

type Product = Database['public']['Tables']['products']['Row']

interface ProductGridProps {
    products: Product[]
    isLoading?: boolean
}

export const ProductGrid = ({ products, isLoading }: ProductGridProps) => {
    const { addItem } = useCartStore()

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="aspect-[3/4] bg-white/50 rounded-[2rem] animate-pulse" />
                ))}
            </div>
        )
    }

    if (products.length === 0) {
        return (
            <div className="py-24 text-center">
                <h3 className="text-2xl font-bold text-slate-900">No products found</h3>
                <p className="text-slate-500 mt-2">Try selecting a different category.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            <AnimatePresence mode="popLayout">
                {products.map((product, index) => (
                    <motion.div
                        layout
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="group relative"
                    >
                        <Link href={`/catalog/${product.id}`}>
                            <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] bg-white shadow-sm border border-slate-100 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                <div className="absolute top-6 right-6 z-10">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault()
                                            // Generic wishlist logic
                                        }}
                                        className="p-3 rounded-full bg-white/80 backdrop-blur-md text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-sm flex items-center justify-center"
                                    >
                                        <Heart size={18} />
                                    </button>
                                </div>

                                {product.tag && (
                                    <div className="absolute top-6 left-6 z-10">
                                        <span className="px-4 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                                            {product.tag}
                                        </span>
                                    </div>
                                )}

                                {/* Bottom Overlay Action */}
                                <div className="absolute bottom-6 left-6 right-6 translate-y-[calc(100%+2rem)] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                                    <div className="bg-white/95 backdrop-blur-xl p-4 rounded-[1.5rem] flex justify-between items-center shadow-xl border border-white/20">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-900 uppercase tracking-tight">{product.name}</span>
                                            <span className="text-[10px] font-medium text-slate-500">USD {Number(product.price).toFixed(2)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                data-testid={`add-to-cart-${product.id}`}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    addItem(product)
                                                }}
                                                className="p-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
                                                aria-label="Add to cart"
                                            >
                                                <ShoppingBag size={14} />
                                            </button>
                                            <div className="p-1.5 rounded-full hover:bg-slate-100 transition-colors">
                                                <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-900" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}
