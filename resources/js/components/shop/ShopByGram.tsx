import React from 'react';
import { Package, ShieldCheck, MessageSquareText } from 'lucide-react';

export const ShopByGram: React.FC = () => {
  const gramImages = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
      alt: 'Haarmonaa Silver Floral Bracelet & Rings',
      handle: '@haarmonaa_official',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop',
      alt: 'Haarmonaa Diamond Solitaire Ring',
      handle: '@haarmonaa_muse',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop',
      alt: 'Haarmonaa Sparkling Choker & Crystal Band',
      handle: '@haarmonaa_daily',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
      alt: 'Haarmonaa Statement Baroque Pearl Earrings',
      handle: '@haarmonaa_luxury',
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop',
      alt: 'Haarmonaa Stacking Rings in 18k Solid Gold',
      handle: '@haarmonaa_style',
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1611591475102-7634599ce074?q=80&w=800&auto=format&fit=crop',
      alt: 'Haarmonaa Layered Gold Pendant Necklace',
      handle: '@haarmonaa_jewels',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-t border-gray-100 overflow-hidden">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto px-4 mb-10 sm:mb-12 space-y-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Shop by Gram
        </h2>
        <p className="text-xs sm:text-[13.5px] text-gray-500 font-medium">
          Inspire and let yourself be inspired, from one unique fashion to another.
        </p>
      </div>

      {/* FULL-WIDTH 6-Column Edge-to-Edge Instagram Gallery */}
      <div className="w-full px-2 sm:px-4 lg:px-6 mb-16 sm:mb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4">
          {gramImages.map((item) => (
            <a
              key={item.id}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-100 block shadow-xs transition-all duration-500 hover:shadow-xl"
            >
              <img
                src={item.image}
                alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              {/* Dark Hover Glassmorphic Overlay with Instagram Handle */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-white">
                <svg
                  className="w-7 h-7 text-white transform scale-75 group-hover:scale-100 transition-transform duration-300 mb-1.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span className="text-[11px] font-bold tracking-wider opacity-90">{item.handle}</span>
                <span className="text-[9px] uppercase tracking-widest text-amber-300 font-extrabold mt-1">Shop Look</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 3 Value Proposition Cards (Centered Container) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 text-center pt-2">
          {/* Card 1: Free Shipping */}
          <div className="space-y-2.5">
            <div className="w-10 h-10 mx-auto flex items-center justify-center text-gray-900">
              <Package className="w-8 h-8 stroke-[1.4]" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm tracking-tight">
              Free Shipping
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed max-w-[260px] mx-auto font-normal">
              Enjoy free worldwide shipping and returns, with customs and duties taxes included.
            </p>
          </div>

          {/* Card 2: Free Returns */}
          <div className="space-y-2.5">
            <div className="w-10 h-10 mx-auto flex items-center justify-center text-gray-900">
              <ShieldCheck className="w-8 h-8 stroke-[1.4]" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm tracking-tight">
              Free Returns
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed max-w-[260px] mx-auto font-normal">
              Free returns within 15 days, please make sure the items are in undamaged condition.
            </p>
          </div>

          {/* Card 3: Support Online */}
          <div className="space-y-2.5">
            <div className="w-10 h-10 mx-auto flex items-center justify-center text-gray-900">
              <MessageSquareText className="w-8 h-8 stroke-[1.4]" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm tracking-tight">
              Support Online
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed max-w-[260px] mx-auto font-normal">
              We support customers 24/7, send questions we will solve for you immediately.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
