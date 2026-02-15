import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { CategoryGrid } from './components/CategoryGrid';
import { FeaturedProducts } from './components/FeaturedProducts';
import { ShowcaseBig } from './components/ShowcaseBig';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-[#E8ECEF] text-slate-900 selection:bg-slate-900 selection:text-white">
      <Navbar />
      
      <main>
        <Hero />
        
        <div className="py-8">
            <Marquee text="FUTURE / STYLE / TECH / LIFE /" direction="left" />
        </div>
        
        <CategoryGrid />
        
        <ShowcaseBig />
        
        <FeaturedProducts />

        <section className="py-24 bg-white rounded-[3rem] mx-4 my-12 shadow-sm">
             <div className="container mx-auto px-6 text-center">
                 <span className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 block">Our Newsletter</span>
                 <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8">STAY AHEAD OF THE CURVE</h2>
                 <p className="text-slate-600 max-w-xl mx-auto mb-8">
                     Subscribe to receive updates, access to exclusive deals, and more. No spam, just tech and style.
                 </p>
                 <div className="flex max-w-md mx-auto">
                     <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="flex-1 bg-gray-100 px-6 py-4 rounded-l-full focus:outline-none focus:ring-2 focus:ring-slate-900"
                     />
                     <button className="bg-slate-900 text-white px-8 py-4 rounded-r-full font-bold hover:bg-slate-800 transition-colors">
                         JOIN
                     </button>
                 </div>
             </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

export default App;