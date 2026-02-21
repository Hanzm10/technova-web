'use client'

import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ProductImageProps {
    src: string
    alt: string
    tag?: string | null
    className?: string
}

export const ProductImage = ({ src, alt, tag, className }: ProductImageProps) => {
    return (
        <div className={cn(
            "relative group overflow-hidden rounded-[3rem] bg-white shadow-2xl border border-slate-100 cursor-pointer",
            className
        )}>
            <div className="relative w-full h-full overflow-hidden transition-all duration-500">
                <Image
                    src={src}
                    alt={alt}
                    fill
                    priority
                    className="object-cover transition-all duration-300 ease-in-out group-hover:scale-115 group-hover:brightness-110"
                />
            </div>

            {tag && (
                <div className="absolute top-8 left-8 z-10">
                    <span className="px-4 py-2 rounded-full bg-slate-900/90 backdrop-blur-md text-xs font-bold uppercase tracking-widest text-white shadow-lg">
                        {tag}
                    </span>
                </div>
            )}
        </div>
    )
}
