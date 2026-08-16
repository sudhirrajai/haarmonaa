import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { GlozinLayout } from '@/components/layout/GlozinLayout';
import { Product } from '@/types/shop';
import { Star, Sparkles, ShieldCheck, HeartHandshake, ArrowRight, Award, Gem, Truck } from 'lucide-react';

interface AboutProps {
  products?: Product[];
}

export default function About({ products = [] }: AboutProps) {
  return (
    <GlozinLayout allProducts={products}>
      <Head title="About Us — Haarmonaa Luxury Jewelry" />

      {/* 1. Breadcrumb & Hero Statement */}
      <section className="pt-10 pb-12 bg-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="text-[13px] font-semibold text-gray-500 mb-8">
            <Link href="/" className="hover:text-black">
              Home
            </Link>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-900 font-bold">About Us</span>
          </nav>

          {/* Subtitle */}
          <span className="text-[14px] font-semibold text-gray-900 tracking-normal block mb-3.5">
            Welcome to Glozin
          </span>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-5">
            Best Store
            <br />
            Available to Everyone!
          </h1>

          {/* Subheading */}
          <p className="text-[14.5px] sm:text-[15px] text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Over 15 years of experience, we have meticulously curated collections that transcend fleeting trends,
            embodying a timeless elegance that resonates with our discerning clientele.
          </p>
        </div>
      </section>

      {/* 2. Hero Dual Media Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xs aspect-16/9 sm:aspect-21/9 lg:aspect-[2.35/1] max-h-[460px]">
          {/* Left Visual: 3 Models on Rocky Ridge */}
          <div className="relative h-full overflow-hidden bg-gray-100">
            <img
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop"
              alt="Glozin High Fashion Collection Models"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Visual: Brand Identity Showcase */}
          <div className="relative h-full bg-[#3a444a] flex flex-col items-center justify-center text-center p-6 sm:p-10 text-white overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop"
              alt="Atmospheric Landscape"
              className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay filter blur-[1px]"
            />
            <div className="relative z-10 space-y-3 sm:space-y-4 max-w-sm mx-auto">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-300 block">
                CLOTHING LONDON
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white lowercase">
                glozin
              </h2>
              <span className="text-[9px] sm:text-[10.5px] font-semibold uppercase tracking-[0.28em] text-gray-300 block">
                HIGH FASHION PRODUCTS
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Key Statistics Counters */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 text-center">
          {/* Stat 1 */}
          <div className="space-y-1.5">
            <div className="text-3xl sm:text-[36px] font-bold text-gray-900 tracking-tight">
              53 k
            </div>
            <h3 className="text-[15px] font-bold text-gray-900">Products for Sale</h3>
            <p className="text-[13px] text-gray-500 font-normal leading-relaxed max-w-[260px] mx-auto">
              That's why we strive to offer a diverse range of products that cater to all styles.
            </p>
          </div>

          {/* Stat 2 */}
          <div className="space-y-1.5">
            <div className="text-3xl sm:text-[36px] font-bold text-gray-900 tracking-tight">
              8.5 k
            </div>
            <h3 className="text-[15px] font-bold text-gray-900">Happy Customer</h3>
            <p className="text-[13px] text-gray-500 font-normal leading-relaxed max-w-[260px] mx-auto">
              We pride ourselves on creating great products and experiences with our valued customers.
            </p>
          </div>

          {/* Stat 3 */}
          <div className="space-y-1.5">
            <div className="text-3xl sm:text-[36px] font-bold text-gray-900 tracking-tight">
              13 k
            </div>
            <h3 className="text-[15px] font-bold text-gray-900">Partner Brand</h3>
            <p className="text-[13px] text-gray-500 font-normal leading-relaxed max-w-[260px] mx-auto">
              Partner with brands that share our values, striving to protect our environment.
            </p>
          </div>
        </div>
      </section>


      {/* 4. Why Choose Us / Our Peculiar Things (3 Feature Cards) */}
      <section className="py-16 sm:py-20 bg-gray-50/70 border-t border-gray-100 mb-16 sm:mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#d0473e] block">
              WHY CHOOSE US
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
              Our Peculiar Things
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Our boutique selections are chosen for their impeccable quality, timeless aesthetic, and anti-tarnish protection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-2xs group flex flex-col justify-between">
              <div className="aspect-4/3 sm:aspect-square overflow-hidden bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"
                  alt="Calmed Creations"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6 sm:p-7 space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Calmed Creations</h3>
                <p className="text-xs sm:text-[13px] text-gray-500 leading-relaxed">
                  Mindful craftsmanship prioritizing sustainable 18k gold vermeil casting, hypoallergenic silver, and nickel-free comfort.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-2xs group flex flex-col justify-between">
              <div className="aspect-4/3 sm:aspect-square overflow-hidden bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop"
                  alt="Designed for Love"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6 sm:p-7 space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Designed for Love</h3>
                <p className="text-xs sm:text-[13px] text-gray-500 leading-relaxed">
                  From heirloom-inspired heart motifs to modern organic wave silhouettes, each design is built to evoke pure elegance.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-2xs group flex flex-col justify-between">
              <div className="aspect-4/3 sm:aspect-square overflow-hidden bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop"
                  alt="Premium for Everyone"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6 sm:p-7 space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Premium for Everyone</h3>
                <p className="text-xs sm:text-[13px] text-gray-500 leading-relaxed">
                  Direct-to-consumer luxury jewelry ensuring fine quality and lasting wear are accessible without traditional retail markups.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Glozin Brand Testimonial Quote Banner */}
      <section className="bg-[#1e2c28] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-5 sm:space-y-6 relative z-10">
          {/* 5 Gold/Yellow Stars */}
          <div className="flex items-center justify-center gap-1.5 text-[#f6e05e]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#f6e05e] text-[#f6e05e]" />
            ))}
          </div>

          {/* Quote Text (Italic & Sand/Cream Tint) */}
          <blockquote className="text-sm sm:text-base md:text-[17px] font-normal italic leading-relaxed text-[#eedac7] max-w-2xl mx-auto tracking-wide">
            " Glozin will become an example of the responsible business model by doing business with kindness, profit and bringing practical and long—term values to customers, employees, partners, the community for the environment and for shareholders. "
          </blockquote>

          {/* Author */}
          <div className="pt-2 space-y-0.5">
            <span className="text-[13.5px] sm:text-[14px] font-bold text-[#eedac7] tracking-normal block">
              Carie—Gosée Hera
            </span>
            <span className="text-[12px] sm:text-[12.5px] font-normal text-[#a6b8b0] block">
              CEO and Founder Glozin Store
            </span>
          </div>
        </div>
      </section>

      {/* 6. Alternating Split Feature Rows */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20 mb-16 sm:mb-20">
        {/* Row 1: Image Left, Text Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          <div className="lg:col-span-6 rounded-3xl overflow-hidden aspect-4/3 sm:aspect-16/11 bg-gray-100 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop"
              alt="The Best Product"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:col-span-6 space-y-4 lg:pl-6 text-center lg:text-left">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#d0473e] block">
              OUR PROMISE
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              The Best Product
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-lg">
              Meticulously crafted with hypoallergenic, water-safe materials that endure daily wear without fading, tarnishing, or losing their radiant shine. Every jewel undergoes stringent multi-point inspection.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-block bg-[#111111] hover:bg-[#d0473e] text-white px-8 py-3 rounded-full text-xs sm:text-[13px] font-bold tracking-normal transition-all shadow-sm"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Row 2: Text Left, Image Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          <div className="lg:col-span-6 space-y-4 order-2 lg:order-1 text-center lg:text-left">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#d0473e] block">
              OUR PRODUCTS
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Timeless Products
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-lg">
              Designed to bridge classic luxury with effortless versatility, creating jewelry staples that effortlessly transition from morning meetings to evening celebrations.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-block bg-[#111111] hover:bg-[#d0473e] text-white px-8 py-3 rounded-full text-xs sm:text-[13px] font-bold tracking-normal transition-all shadow-sm"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6 rounded-3xl overflow-hidden aspect-4/3 sm:aspect-16/11 bg-gray-100 shadow-sm order-1 lg:order-2">
            <img
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop"
              alt="Timeless Products"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 7. Expanding Horizons / Story & Team (3 Story Cards) */}
      <section className="py-16 sm:py-20 bg-gray-50/70 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#d0473e] block">
              SEE OUR ROOTS
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
              Expanding Horizons
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Rooted in a passion for artisanal beauty and accessible luxury, our journey continues across the globe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Story 1 */}
            <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-2xs group flex flex-col justify-between">
              <div className="aspect-4/3 overflow-hidden bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"
                  alt="The Core of Us"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6 sm:p-7 space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">The Core of Us</h3>
                <p className="text-xs sm:text-[13px] text-gray-500 leading-relaxed">
                  A united collective of designers, jewelers, and curators dedicated to crafting wearable art.
                </p>
              </div>
            </div>

            {/* Story 2 */}
            <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-2xs group flex flex-col justify-between">
              <div className="aspect-4/3 overflow-hidden bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop"
                  alt="Our Promise"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6 sm:p-7 space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Our Promise</h3>
                <p className="text-xs sm:text-[13px] text-gray-500 leading-relaxed">
                  Swift, insured delivery with luxury sustainable velvet care packaging on every order.
                </p>
              </div>
            </div>

            {/* Story 3 */}
            <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-2xs group flex flex-col justify-between">
              <div className="aspect-4/3 overflow-hidden bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop"
                  alt="Our Genesis"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6 sm:p-7 space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Our Genesis</h3>
                <p className="text-xs sm:text-[13px] text-gray-500 leading-relaxed">
                  Conceived from a shared belief that fine craftsmanship should be celebrated daily, not kept in boxes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </GlozinLayout>
  );
}
