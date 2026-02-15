import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ChevronRight } from 'lucide-react';
import { Product } from '../types';

const products: Product[] = [
    { id: 1, name: 'Nova Smart Watch', category: 'Electronics', price: 299.00, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800', tag: 'New' },
    { id: 2, name: 'Urban Tech Jacket', category: 'Clothing', price: 145.00, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800', tag: 'Best Seller' },
    { id: 3, name: 'Minimalist Lamp', category: 'Home', price: 89.00, image: 'https://images.unsplash.com/photo-1507473888900-52e1ad145924?auto=format&fit=crop&q=80&w=800' },
    { id: 4, name: 'Sonic Earbuds Pro', category: 'Electronics', price: 199.00, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800', tag: 'Trending' },
    { id: 5, name: 'Aeroweave Runners', category: 'Clothing', price: 120.00, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800' },
    { id: 6, name: 'Smart Diffuser', category: 'Home', price: 65.00, image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=800' },
    { id: 7, name: 'Tech Cargo Pants', category: 'Clothing', price: 95.00, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800' },
    { id: 8, name: 'Vision VR Headset', category: 'Electronics', price: 899.00, image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=800', tag: 'Pre-order' },
];

export const FeaturedProducts: React.FC = () => {
  return (
    <section className="py-24 bg-[#E8ECEF]">
        <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
                <div>
                    <span className="text-sm font-semibold text-slate-500 tracking-wider uppercase mb-2 block">New Arrivals</span>
                    <h2 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tighter">
                        FRESH FITS <br/> FOR YOUR <span className="text-slate-500 italic font-normal font-['Playfair_Display']">lifestyle</span>
                    </h2>
                </div>
                <div className="mt-6 md:mt-0">
                    <button className="text-slate-900 font-semibold border-b-2 border-slate-900 pb-1 hover:text-slate-600 hover:border-slate-600 transition-colors">
                        VIEW ALL BRANDS
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false, amount: 0.1 }}
                        transition={{ delay: index * 0.05, duration: 0.5 }}
                        className="group relative"
                    >
                        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-white shadow-sm">
                             <img 
                                src={product.image} 
                                alt={product.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                             />
                             
                             <div className="absolute top-4 right-4 z-10">
                                 <button className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-slate-900 hover:bg-slate-900 hover:text-white transition-colors shadow-sm">
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
                                     <button className="p-1 rounded-full hover:bg-slate-100">
                                         <ChevronRight size={16} />
                                     </button>
                                 </div>
                             </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
  );
};