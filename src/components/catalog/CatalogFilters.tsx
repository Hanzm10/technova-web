'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'

const categories = [
    { id: 'all', name: 'ALL' },
    { id: 'Gadgets', name: 'GADGETS' },
    { id: 'Fashion', name: 'FASHION' },
    { id: 'Home', name: 'HOME' }
]

export const CatalogFilters = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const activeCategory = searchParams.get('category') || 'all'

    const handleCategoryChange = (id: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (id === 'all') {
            params.delete('category')
        } else {
            params.set('category', id)
        }
        router.push(`/catalog?${params.toString()}`)
    }

    return (
        <div className="flex flex-wrap gap-4 mb-12">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`relative px-8 py-3 rounded-full text-xs font-bold tracking-widest transition-all duration-300 ${activeCategory === cat.id
                        ? 'text-white'
                        : 'text-slate-500 hover:text-slate-900 bg-white/50'
                        }`}
                >
                    {activeCategory === cat.id && (
                        <motion.div
                            layoutId="activeCategory"
                            className="absolute inset-0 bg-slate-900 rounded-full -z-10"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    {cat.name}
                </button>
            ))}
        </div>
    )
}
