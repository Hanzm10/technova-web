'use client'

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, CloudRain } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { Database } from '@/types/database.types';
import Link from 'next/link';
import { useCartStore } from '@/hooks/useCartStore';
import { useToastStore } from '@/hooks/useToastStore';
import Image from 'next/image';
import { Marquee } from '@/components/landing/Marquee';

type Product = Database['public']['Tables']['products']['Row'];

export default function RainyCollectionPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { addItem } = useCartStore();
    const { addToast } = useToastStore();
    const supabase = createClient();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch specifically requested products
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .or('name.ilike.%Urban Tech Jacket%,name.ilike.%Tech Cargo Pants%,name.ilike.%Smart Diffuser%');

                if (error) throw error;

                // Sort to ensure the order requested if possible
                const orderedProducts = [
                    data?.find(p => p.name.toLowerCase().includes('urban tech jacket')),
                    data?.find(p => p.name.toLowerCase().includes('tech cargo pants')),
                    data?.find(p => p.name.toLowerCase().includes('smart diffuser'))
                ].filter(Boolean) as Product[];

                setProducts(orderedProducts.length > 0 ? orderedProducts : (data || []));
            } catch (error) {
                console.error('Error fetching rainy collection products:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [supabase]);

    return (
        <div className="w-full relative" style={{ overflow: 'clip' }}>
            <div className="flex flex-col min-h-screen bg-[#E8ECEF] w-full relative">
                {/* Hero Section */}
                <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-black overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=1600"
                            alt="Rainy Season Collection"
                            fill
                            className="object-cover opacity-60 transition-transform duration-1000 scale-105"
                            priority
                        />
                        {/* Top Overlay for Navbar Visibility */}
                        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white/80 via-white/40 to-transparent z-20 pointer-events-none" />

                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-[#E8ECEF] z-10" />
                    </div>

                    <div className="container mx-auto px-6 relative z-30">
                        <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors group">
                            <ArrowLeft className="mr-2 transform group-hover:-translate-x-1 transition-transform" size={20} />
                            <span className="text-sm font-mono tracking-widest uppercase">BACK TO HOME</span>
                        </Link>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex items-center space-x-4 mb-4">
                                <CloudRain className="text-white/80" size={32} />
                                <span className="text-white/80 font-mono text-sm tracking-[0.3em] uppercase">MONSOON READY 2026</span>
                            </div>
                            <h1 className="text-5xl sm:text-7xl md:text-9xl font-bold text-white tracking-tighter leading-[0.85] mb-6">
                                STAY DRY, <br /> STAY <span className="text-white/40 italic font-serif">connected</span>
                            </h1>
                            <p className="text-white/70 max-w-xl text-lg md:text-xl font-medium leading-relaxed">
                                Engineered for the Southeast Asian monsoon. Discover our curated collection of waterproof tech and high-performance rainy-day essentials.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Background Marquee Wrapper */}
                <div className="absolute top-[85%] left-0 w-full h-[40vh] z-0 pointer-events-none select-none" style={{ overflow: 'clip' }}>
                    <div className="w-full relative">
                        <Marquee text="MONSOON READY 2026 / TECHNOVA PERFORMANCE / WATERPROOF DESIGN /" />
                    </div>
                </div>

                {/* Product Grid */}
                <section className="py-24 px-6 relative z-10 -mt-24">
                    <div className="container mx-auto">
                        <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-[3rem] p-12 shadow-2xl overflow-hidden">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 px-4">
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tighter">RAINY ESSENTIALS</h2>
                                    <p className="text-slate-600 mt-2">Durable protection meets modern aesthetics.</p>
                                </div>
                                <div className="mt-8 md:mt-0 text-right">
                                    <span className="text-slate-400 font-mono text-sm tracking-widest uppercase">880 MM / PRECIPI</span>
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="aspect-[3/4] bg-slate-200/50 rounded-2xl animate-pulse" />
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {products.map((product, index) => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.05, duration: 0.5 }}
                                            className="group relative"
                                        >
                                            <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-slate-100 shadow-sm border border-white/40 cursor-pointer">
                                                <Link href={`/catalog/${product.id}`} className="absolute inset-0 z-0">
                                                    <Image
                                                        src={product.image}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                                    />
                                                </Link>

                                                <div className="absolute top-4 left-4 z-10 pointer-events-none">
                                                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
                                                        PROTECT+
                                                    </span>
                                                </div>

                                                <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 z-10 transition-all duration-500">
                                                    <div className="bg-white/80 backdrop-blur-md p-3 md:p-4 rounded-[1.5rem] flex justify-between items-center shadow-lg border border-white/40 transform transition-all duration-500 opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0">
                                                        <Link href={`/catalog/${product.id}`} className="flex flex-col flex-1 mr-2 min-w-0">
                                                            <span className="text-xs md:text-sm font-bold text-slate-900 truncate hover:underline transition-all">{product.name}</span>
                                                            <span className="text-[10px] md:text-xs text-slate-600 font-medium">USD {product.price.toFixed(2)}</span>
                                                        </Link>
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                addItem(product);
                                                                addToast(`${product.name} added to bag`);
                                                            }}
                                                            className="p-3 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-lg active:scale-95 flex-shrink-0"
                                                        >
                                                            <ShoppingBag size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Bottom Accent - Removed based on user request */}
                <div className="py-12" />
            </div>
        </div>
    );
}
