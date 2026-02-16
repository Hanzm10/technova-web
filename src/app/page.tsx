'use client'

import { HeroSection } from "@/components/landing/HeroSection";
import { Marquee } from "@/components/landing/Marquee";
import { CategoryGrid } from "@/components/landing/CategoryGrid";
import { ShowcaseSection } from "@/components/landing/ShowcaseSection";
import { FeaturedProducts } from "@/components/landing/FeaturedProducts";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#E8ECEF]">
      <HeroSection />

      <div className="py-8">
        <Marquee text="FUTURE / STYLE / TECH / LIFE /" direction="left" />
      </div>

      <CategoryGrid />

      <ShowcaseSection />

      <FeaturedProducts />

      {/* Newsletter Section - Ported from Legacy App.tsx */}
      <section className="py-24 bg-white rounded-[3rem] mx-4 my-12 shadow-sm">
        <div className="container mx-auto px-6 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 block">Our Newsletter</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8">STAY AHEAD OF THE CURVE</h2>
          <p className="text-slate-600 max-w-xl mx-auto mb-8">
            Subscribe to receive updates, access to exclusive deals, and more. No spam, just tech and style.
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4 sm:gap-0">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-gray-100 px-6 py-4 rounded-full sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <button className="bg-slate-900 text-white px-8 py-4 rounded-full sm:rounded-l-none font-bold hover:bg-slate-800 transition-colors">
              JOIN
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
