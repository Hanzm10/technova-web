import React from 'react';
import { motion } from 'framer-motion';

export const ShowcaseBig: React.FC = () => {
    return (
        <section className="py-12 bg-[#E8ECEF] px-4">
             <div className="container mx-auto max-w-7xl">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {/* Left Card - Winter */}
                     <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ duration: 0.8 }}
                        className="relative aspect-square md:aspect-[4/5] rounded-[2.5rem] overflow-hidden group bg-slate-900"
                     >
                         <img 
                            src="https://images.unsplash.com/photo-1551893478-d726eaf0442c?auto=format&fit=crop&q=80&w=800" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-60" 
                            alt="Winter Tech" 
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                         <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between z-10">
                             <div className="flex justify-between items-start text-white/90 font-mono text-sm font-bold tracking-widest">
                                 <span>01 / WINTER</span>
                                 <span>_2025</span>
                             </div>
                             <div>
                                 <h3 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-[0.9] mb-4">
                                     TOP <br/> GEAR FOR <br/> PEAK <br/> <span className="text-white/50">PERFORMANCE</span>
                                 </h3>
                             </div>
                         </div>
                     </motion.div>

                     {/* Right Card - Summer */}
                     <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ duration: 0.8 }}
                        className="relative aspect-square md:aspect-[4/5] rounded-[2.5rem] overflow-hidden group bg-slate-900"
                     >
                         <img 
                            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-60" 
                            alt="Summer Style" 
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                         <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between z-10">
                             <div className="flex justify-between items-start text-white/90 font-mono text-sm font-bold tracking-widest">
                                 <span>02 / SUMMER</span>
                                 <span>_2025</span>
                             </div>
                             <div>
                                 <h3 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-[0.9] mb-4 text-right">
                                     LATEST <br/> STYLES AND <br/> INNOVATIONS <br/> <span className="text-white/50">IN TECH</span>
                                 </h3>
                             </div>
                         </div>
                     </motion.div>
                 </div>
             </div>
        </section>
    );
};