'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'

const categories = [
    { id: 'all', name: 'ALL' },
    { id: 'electronics', name: 'ELECTRONICS' },
    { id: 'fashion', name: 'FASHION' },
    { id: 'home', name: 'HOME' }
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
        <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`relative px-10 py-3.5 rounded-full text-[10px] font-extrabold tracking-[0.2em] transition-all duration-300 ${activeCategory === cat.id
                        ? 'text-white shadow-xl shadow-slate-200'
                        : 'text-slate-500 hover:text-slate-900 bg-white/40 backdrop-blur-md border border-white/20'
                        }`}
                >
                    {activeCategory === cat.id && (
                        <motion.div
                            layoutId="activeCategory"
                            className="absolute inset-0 bg-slate-900 rounded-full -z-10"
                            transition={{ type: 'spring', bounce: 0.15, duration: 0.6 }}
                        />
                    )}
                    {cat.name}
                </button>
            ))}
        </div>
    )
}
