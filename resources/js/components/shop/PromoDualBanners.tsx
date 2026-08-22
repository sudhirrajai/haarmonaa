import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export interface PromoCardData {
  id: string | number;
  subtitle?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  image?: string;
  bgClass?: string;
  textColor?: 'dark' | 'light';
  align?: 'left' | 'center' | 'right';
}

interface PromoDualBannersProps {
  cards?: [PromoCardData, PromoCardData];
}

const defaultCards: [PromoCardData, PromoCardData] = [
  {
    id: 1,
    subtitle: 'EPITOME OF REFINEMENT',
    title: 'Light The Wonders',
    description: "This season, the ordinary becomes extraordinary. Glozin's ambassadors open gates to wonder, where dreams come alive.",
    buttonText: 'Shop Now',
    buttonLink: '/shop',
    bgClass: 'bg-[#f4f4f4]',
    textColor: 'dark',
    align: 'center',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop',
    subtitle: 'HAARMONAA ICONIC',
    title: 'Sculpted Solid Gold Hoops',
    description: 'Timeless architectural curves crafted for effortless daily statement.',
    buttonText: 'Explore Hoops',
    buttonLink: '/shop?category=earrings',
    textColor: 'light',
    align: 'left',
  },
];

export const PromoDualBanners: React.FC<PromoDualBannersProps> = ({ cards = defaultCards }) => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {cards.map((card) => {
            const hasImage = Boolean(card.image && card.image.trim().length > 0);
            const isDarkText = !hasImage || card.textColor === 'dark' || !card.textColor;
            const alignClass =
              card.align === 'center' || !hasImage
                ? 'items-center text-center justify-center'
                : card.align === 'right'
                ? 'items-end text-right justify-end'
                : 'items-start text-left justify-end';

            return (
              <div
                key={card.id}
                className={`relative rounded-3xl sm:rounded-4xl overflow-hidden transition-all duration-500 min-h-[360px] sm:min-h-[420px] lg:min-h-[440px] flex flex-col p-8 sm:p-12 lg:p-14 group ${
                  hasImage ? (card.bgClass || 'bg-gray-900') : 'bg-[#f4f4f4]'
                } ${alignClass}`}
              >
                {/* Background Image (If Provided) */}
                {hasImage && (
                  <>
                    <img
                      src={card.image}
                      alt={card.title || 'Promo Banner'}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    {/* Overlay gradient if text exists over image */}
                    {(card.title || card.subtitle) && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-opacity" />
                    )}
                  </>
                )}

                {/* Content Overlay */}
                <div
                  className={`relative z-10 space-y-3.5 max-w-md ${
                    card.align === 'center' || !hasImage ? 'mx-auto' : ''
                  }`}
                >
                  {/* Subtitle */}
                  {card.subtitle && (
                    <span
                      className={`text-[11px] sm:text-xs font-bold uppercase tracking-widest block ${
                        !hasImage || isDarkText
                          ? 'text-gray-900'
                          : 'text-amber-300'
                      }`}
                    >
                      {card.subtitle}
                    </span>
                  )}

                  {/* Title */}
                  {card.title && (
                    <h3
                      className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] ${
                        !hasImage || isDarkText
                          ? 'text-gray-900'
                          : 'text-white'
                      }`}
                    >
                      {card.title}
                    </h3>
                  )}

                  {/* Description */}
                  {card.description && (
                    <p
                      className={`text-xs sm:text-[13.5px] leading-relaxed font-normal ${
                        !hasImage || isDarkText
                          ? 'text-gray-600'
                          : 'text-gray-200'
                      }`}
                    >
                      {card.description}
                    </p>
                  )}

                  {/* Action Button */}
                  {card.buttonText && (
                    <div className="pt-2">
                      <Link
                        href={card.buttonLink || '/shop'}
                        className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer ${
                          !hasImage || isDarkText
                            ? 'bg-[#111111] hover:bg-black text-white'
                            : 'bg-white hover:bg-gray-100 text-gray-900'
                        }`}
                      >
                        <span>{card.buttonText}</span>
                        {hasImage && <ArrowRight className="w-3.5 h-3.5" />}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
