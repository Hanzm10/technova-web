'use client'

import { HeroSection } from "@/components/landing/HeroSection";
import { Marquee } from "@/components/landing/Marquee";
import { CategoryGrid } from "@/components/landing/CategoryGrid";
import { ShowcaseSection } from "@/components/landing/ShowcaseSection";
import { FeaturedProducts } from "@/components/landing/FeaturedProducts";
import { Newsletter } from "@/components/landing/Newsletter";

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

      {/* Newsletter Section */}
      <Newsletter />
    </div>
  );
}
