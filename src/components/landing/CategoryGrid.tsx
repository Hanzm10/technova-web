'use client'

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Marquee } from './Marquee';

const categories = [
    {
        id: 'fashion',
        title: 'FASHION',
        description: 'Performance-driven gear for modern life.',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800',
        colSpan: 'md:col-span-1'
    },
    {
        id: 'gadgets',
        title: 'GADGETS',
        description: 'Next-gen gadgets to power your workflow.',
        image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=800',
        colSpan: 'md:col-span-1'
    },
    {
        id: 'home',
        title: 'HOME ESSENTIALS',
        description: 'Minimalist designs for a smarter home.',
        image: 'https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?auto=format&fit=crop&q=80&w=800',
        colSpan: 'md:col-span-1'
    }
];

const TypingReveal = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, margin: "-100px" });

    const segments = [
        { text: "TechNova brings you a curated selection of the ", type: 'normal' },
        { text: "world's most", type: 'bold' },
        { text: " innovative products. From smart wearables to sustainable fashion, we bridge the gap between technology and lifestyle.", type: 'normal' },
    ];

    const container = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.012,
                delayChildren: 0.1
            }
        }
    };

    const charVariants = {
        hidden: { opacity: 0.15 },
        visible: { opacity: 1 }
    };

    return (
        <p ref={ref} className="text-xl md:text-3xl font-medium leading-relaxed min-h-[120px] text-foreground">
            <motion.span
                variants={container}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
            >
                {segments.map((segment, segIndex) => (
                    <span key={segIndex} className={segment.type === 'bold' ? "font-bold" : ""}>
                        {segment.text.split("").map((char, charIndex) => (
                            <motion.span key={charIndex} variants={charVariants}>
                                {char}
                            </motion.span>
                        ))}
                    </span>
                ))}
            </motion.span>
        </p>
    );
};

export const CategoryGrid: React.FC = () => {
    return (
        <section className="relative py-24 bg-background overflow-hidden">

            {/* Background Marquee */}
            <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 z-0 opacity-10 pointer-events-none">
                <Marquee text="COLLECTION / FUTURE / DESIGN /" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.map((cat, index) => (
                        <Link href={`/catalog?category=${cat.id}`} key={cat.id} className={cat.colSpan}>
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, amount: 0.2 }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                className={`relative group h-[600px] rounded-[2rem] overflow-hidden cursor-pointer w-full`}
                            >
                                <img
                                    src={cat.image}
                                    alt={cat.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                    <div className="flex justify-between items-end">
                                        <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                                            <h3 className="text-3xl font-bold text-white tracking-tight">{cat.title}</h3>
                                            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
                                                <div className="overflow-hidden">
                                                    <p className="text-gray-200 max-w-xs pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">{cat.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-background text-foreground flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                                            <ArrowUpRight size={24} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                <div className="mt-24 flex justify-between items-end px-2">
                    <div className="max-w-3xl">
                        <TypingReveal />
                    </div>
                    <div className="hidden md:block">
                        <span className="text-9xl font-bold text-muted/30 tracking-tighter select-none">2026</span>
                    </div>
                </div>
            </div>
        </section>
    );
};
