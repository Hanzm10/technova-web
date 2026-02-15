import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { Play } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 mix-blend-multiply filter"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50 mix-blend-multiply filter"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
        
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-12 w-full"
        >
             <h1 className="flex flex-col items-center justify-center w-full max-w-full mx-auto">
              <span className="block text-[14vw] md:text-[16vw] font-extrabold tracking-tighter text-slate-900 leading-[0.8] select-none text-center">
                INNOVATE
              </span>
              <div className="flex flex-row items-center justify-center gap-2 md:gap-6 mt-2 md:mt-4 w-full flex-wrap sm:flex-nowrap">
                  <span className="font-['Playfair_Display'] italic font-normal text-[9vw] md:text-[10vw] leading-none text-slate-500 relative top-1 md:top-2">
                     your
                  </span>
                  <span className="block text-[11vw] md:text-[13vw] font-extrabold tracking-tighter text-slate-900 leading-[0.8] select-none">
                     LIFESTYLE
                  </span>
              </div>
            </h1>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-16"
        >
            <Button variant="primary" size="lg" className="min-w-[160px]">SHOP NOW</Button>
            <Button variant="secondary" size="lg" className="min-w-[160px]">EXPLORE ALL</Button>
        </motion.div>

        <div className="relative w-full max-w-7xl mt-4 px-2 md:px-8">
            {/* Central Hero Image */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
                className="relative z-10"
            >
                <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-[3rem] shadow-2xl">
                    <img 
                        src="https://images.unsplash.com/photo-1492446845049-9c50cc313f00?auto=format&fit=crop&q=80&w=1600" 
                        alt="Hero Showcase" 
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 transform hover:scale-105"
                    />
                </div>
                
                {/* Floating Card 1 */}
                <motion.div 
                    initial={{ x: -50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: false }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="absolute -bottom-6 -left-2 md:bottom-12 md:left-12 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl max-w-xs text-left hidden md:block"
                >
                    <div className="flex -space-x-2 mb-4">
                         <img className="w-10 h-10 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="User" />
                         <img className="w-10 h-10 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100" alt="User" />
                         <img className="w-10 h-10 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="User" />
                    </div>
                    <p className="text-sm font-medium text-slate-900">
                        Join 10k+ innovators upgrading their daily essentials.
                    </p>
                </motion.div>

                {/* Floating Card 2 - Video Preview */}
                <motion.div 
                     initial={{ x: 50, opacity: 0 }}
                     whileInView={{ x: 0, opacity: 1 }}
                     viewport={{ once: false }}
                     transition={{ delay: 0.8, duration: 0.8 }}
                    className="hidden md:block absolute bottom-12 right-12 w-64 h-40 bg-black rounded-2xl overflow-hidden shadow-2xl group cursor-pointer"
                >
                    <img src="https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500" alt="Video" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/50 group-hover:scale-110 transition-transform duration-300">
                             <Play fill="white" className="text-white ml-1" size={20} />
                        </div>
                    </div>
                </motion.div>

            </motion.div>

        </div>
      </div>
    </section>
  );
};