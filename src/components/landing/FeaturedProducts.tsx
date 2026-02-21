'use client'

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ChevronRight, ShoppingBag } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { Database } from '@/types/database.types';
import Link from 'next/link';
import { useCartStore } from '@/hooks/useCartStore';
import { useToastStore } from '@/hooks/useToastStore';
import { useFavorites } from '@/hooks/useFavorites';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type Product = Database['public']['Tables']['products']['Row'];

export const FeaturedProducts: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { addItem } = useCartStore();
    const { addToast } = useToastStore();
    const { isFavorite, toggleFavorite } = useFavorites();
    const supabase = createClient();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .limit(8);

                if (error) throw error;
                setProducts(data || []);
            } catch (error) {
                console.error('Error fetching featured products:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [supabase]);

    return (
        <section className="py-24 bg-background overflow-hidden w-full">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
                    <div>
                        <span className="text-sm font-semibold text-muted-foreground tracking-wider uppercase mb-2 block">New Arrivals</span>
                        <h2 className="text-5xl md:text-6xl font-bold text-foreground tracking-tighter">
                            FRESH FITS <br /> FOR YOUR <span className="text-muted-foreground italic font-normal font-serif">lifestyle</span>
                        </h2>
                    </div>
                    <div className="mt-6 md:mt-0">
                        <Link href="/catalog">
                            <button className="bg-slate-900 text-white text-sm font-bold py-4 px-8 rounded-full hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95 uppercase tracking-wider">
                                VIEW ALL BRANDS
                            </button>
                        </Link>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-muted/20 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, amount: 0.1 }}
                                transition={{ delay: index * 0.05, duration: 0.5 }}
                                className="group relative"
                            >
                                <Link href={`/catalog/${product.id}`}>
                                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-card shadow-sm border border-border cursor-pointer">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />

                                        <div className="absolute top-4 right-4 z-10">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    toggleFavorite(product.id);
                                                }}
                                                className={cn(
                                                    "p-2 rounded-full backdrop-blur-md transition-colors shadow-md border border-white/20",
                                                    isFavorite(product.id)
                                                        ? "bg-slate-900 text-white"
                                                        : "bg-white/95 text-slate-900 hover:bg-slate-900 hover:text-white"
                                                )}
                                            >
                                                <Heart size={18} fill={isFavorite(product.id) ? "currentColor" : "none"} />
                                            </button>
                                        </div>

                                        {product.tag && (
                                            <div className="absolute top-4 left-4 z-10">
                                                <span className="px-3 py-1.5 rounded-full bg-slate-900/95 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
                                                    {product.tag}
                                                </span>
                                            </div>
                                        )}

                                        {/* Bottom Overlay Action */}
                                        <div className="absolute bottom-4 left-4 right-4 translate-y-0 opacity-100 md:translate-y-[calc(100%+1.5rem)] md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                                            <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl flex justify-between items-center shadow-lg border border-slate-100">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-semibold text-foreground truncate max-w-[120px]">{product.name}</span>
                                                    <span className="text-xs text-slate-500">USD {product.price.toFixed(2)}</span>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        addItem(product);
                                                        addToast(`${product.name} added to bag`);
                                                    }}
                                                    className="p-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                                                >
                                                    <ShoppingBag size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};
