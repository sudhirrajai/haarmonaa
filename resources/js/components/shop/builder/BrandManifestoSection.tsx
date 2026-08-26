import React from 'react';
import { Link } from '@inertiajs/react';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export interface BrandManifestoSettings {
  badge?: string;
  title?: string;
  subtitle?: string;
  quote?: string;
  body_text?: string;
  signature_name?: string;
  signature_title?: string;
  image?: string;
  button_text?: string;
  button_link?: string;
}

interface BrandManifestoSectionProps {
  settings?: BrandManifestoSettings;
}

export const BrandManifestoSection: React.FC<BrandManifestoSectionProps> = ({ settings = {} }) => {
  const {
    badge = 'THE HAARMONAA MANIFESTO',
    title = 'Sculpted for Everyday Splendor',
    subtitle = '18K SOLID GOLD VERMEIL & CONSCIOUS LUXURY',
    quote = '“Jewelry shouldn’t be reserved for special occasions. It should accompany every breath, sunlight glance, and spontaneous celebration of your life.”',
    body_text = 'At Haarmonaa, each jewel is meticulously electroplated with a lavish 2.5–3.0 micron layer of genuine 18K solid gold over premium 925 sterling silver — creating certified waterproof, anti-tarnish, and hypoallergenic masterpieces designed to endure forever.',
    signature_name = 'The Atelier Team',
    signature_title = 'Haarmonaa Fine Jewelry',
    image = 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop',
    button_text = 'Read Brand Story',
    button_link = '/about-us',
  } = settings;

  return (
    <section className="@container py-12 @sm:py-16 @lg:py-24 bg-white border-b border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8">
        <div className="grid grid-cols-1 @[768px]:grid-cols-12 gap-8 @lg:gap-16 items-center">
          {/* Visual Showcase Side */}
          <div className="@[768px]:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/5] bg-gray-900 group">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/40 shadow-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-amber-800" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Certified 18K Vermeil</p>
                  <p className="text-[10px] text-gray-600 font-medium">100% Waterproof & Anti-Tarnish</p>
                </div>
              </div>
            </div>
          </div>

          {/* Editorial Content Side */}
          <div className="@[768px]:col-span-7 space-y-4 @sm:space-y-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] @sm:text-xs font-bold tracking-[0.2em] uppercase bg-amber-50 text-amber-800 border border-amber-200/50">
                <Sparkles className="w-3 h-3" />
                {badge}
              </span>
              <h2 className="text-2xl @sm:text-3xl @lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                {title}
              </h2>
              {subtitle && (
                <p className="text-xs sm:text-sm font-semibold tracking-wider text-amber-700 uppercase">
                  {subtitle}
                </p>
              )}
            </div>

            {quote && (
              <blockquote className="border-l-2 border-amber-600 pl-4 sm:pl-6 text-base sm:text-lg italic text-gray-800 font-serif leading-relaxed">
                {quote}
              </blockquote>
            )}

            {body_text && (
              <p className="text-sm text-gray-600 leading-relaxed font-normal">
                {body_text}
              </p>
            )}

            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-gray-100">
              <div>
                <p className="text-sm font-bold text-gray-900">{signature_name}</p>
                <p className="text-xs text-gray-500">{signature_title}</p>
              </div>

              {button_link && (
                <Link
                  href={button_link}
                  className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#d0473e] text-white px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md group"
                >
                  <span>{button_text}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
