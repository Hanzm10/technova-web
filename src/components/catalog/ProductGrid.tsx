'use client'

import React from 'react'
import { motion } from 'framer-motion'
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
                    <div key={i} className="aspect-[3/4] bg-white/50 rounded-2xl animate-pulse" />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
                <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    className="group relative"
                >
                    <Link href={`/catalog/${product.id}`}>
                        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100 cursor-pointer">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            <div className="absolute top-4 right-4 z-10">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault()
                                        // Generic wishlist logic
                                    }}
                                    className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-slate-900 hover:bg-slate-900 hover:text-white transition-colors shadow-sm"
                                >
                                    <Heart size={18} />
                                </button>
                            </div>

                            {product.tag && (
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-sm text-xs font-bold uppercase tracking-wide text-white shadow-sm">
                                        {product.tag}
                                    </span>
                                </div>
                            )}

                            {/* Bottom Overlay Action */}
                            <div className="absolute bottom-4 left-4 right-4 translate-y-[calc(100%+1.5rem)] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                                <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl flex justify-between items-center shadow-lg border border-slate-100">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-semibold text-slate-900">{product.name}</span>
                                        <span className="text-xs text-slate-500">USD {product.price.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault()
                                                addItem(product)
                                            }}
                                            className="p-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                                        >
                                            <ShoppingBag size={14} />
                                        </button>
                                        <div className="p-1 rounded-full hover:bg-slate-100">
                                            <ChevronRight size={16} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
    )
}
