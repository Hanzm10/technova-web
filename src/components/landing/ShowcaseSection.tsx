'use client'

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export const ShowcaseSection: React.FC = () => {
    return (
        <section className="py-12 bg-background px-4 overflow-hidden">
            <div className="container mx-auto max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Card - Rainy Season */}
                    <Link href="/collections/rainy" className="block">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false, amount: 0.3 }}
                            transition={{ duration: 0.8 }}
                            className="relative aspect-square md:aspect-[4/5] rounded-[2.5rem] overflow-hidden group bg-card"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=800"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-60"
                                alt="Rainy Season Tech"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between z-10">
                                <div className="flex justify-between items-start text-white/90 font-mono text-sm font-bold tracking-widest">
                                    <span>01 / RAINY</span>
                                    <span>_2026</span>
                                </div>
                                <div>
                                    <h3 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-[0.9] mb-4">
                                        MONSOON <br /> READY <br /> GEAR <br /> <span className="text-white/50">PROTECTION</span>
                                    </h3>
                                </div>
                            </div>
                        </motion.div>
                    </Link>

                    {/* Right Card - Summer Season */}
                    <Link href="/collections/summer" className="block">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false, amount: 0.3 }}
                            transition={{ duration: 0.8 }}
                            className="relative aspect-square md:aspect-[4/5] rounded-[2.5rem] overflow-hidden group bg-card"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=800"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-60"
                                alt="Summer Season Style"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between z-10">
                                <div className="flex justify-between items-start text-white/90 font-mono text-sm font-bold tracking-widest">
                                    <span>02 / SUMMER</span>
                                    <span>_2026</span>
                                </div>
                                <div>
                                    <h3 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-[0.9] mb-4 text-right">
                                        SUMMER <br /> ESSENTIALS <br /> COLLECTION <br /> <span className="text-white/50">LIFESTYLE</span>
                                    </h3>
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                </div>
            </div>
        </section>
    );
};
