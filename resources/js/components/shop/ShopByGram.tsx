import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import {
  Package,
  ShieldCheck,
  MessageSquareText,
  Truck,
  Gem,
  Sparkles,
  RotateCcw,
  Heart,
  Clock,
  Award,
  Shield,
  Headphones,
  Gift,
  ExternalLink,
} from 'lucide-react';

interface InstagramPostItem {
  id: string | number;
  image: string;
  alt?: string;
  handle?: string;
  url?: string;
}

interface StoreFeatureItem {
  id: string | number;
  icon: string;
  custom_icon?: string;
  title: string;
  description: string;
}

const DEFAULT_GRAM_IMAGES: InstagramPostItem[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
    alt: 'Haarmonaa Silver Floral Bracelet & Rings',
    handle: '@haarmonaa_official',
    url: 'https://instagram.com',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop',
    alt: 'Haarmonaa Diamond Solitaire Ring',
    handle: '@haarmonaa_muse',
    url: 'https://instagram.com',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop',
    alt: 'Haarmonaa Sparkling Choker & Crystal Band',
    handle: '@haarmonaa_daily',
    url: 'https://instagram.com',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
    alt: 'Haarmonaa Statement Baroque Pearl Earrings',
    handle: '@haarmonaa_luxury',
    url: 'https://instagram.com',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop',
    alt: 'Haarmonaa Stacking Rings in 18k Solid Gold',
    handle: '@haarmonaa_style',
    url: 'https://instagram.com',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop',
    alt: 'Haarmonaa Layered Gold Pendant Necklace',
    handle: '@haarmonaa_jewels',
    url: 'https://instagram.com',
  },
];

const DEFAULT_FEATURES: StoreFeatureItem[] = [
  {
    id: 'feat_1',
    icon: 'Package',
    title: 'Free Shipping',
    description: 'Enjoy free worldwide shipping and returns, with customs and duties taxes included.',
  },
  {
    id: 'feat_2',
    icon: 'ShieldCheck',
    title: 'Free Returns',
    description: 'Free returns within 15 days, please make sure the items are in undamaged condition.',
  },
  {
    id: 'feat_3',
    icon: 'MessageSquareText',
    title: 'Support Online',
    description: 'We support customers 24/7, send questions we will solve for you immediately.',
  },
];

const renderFeatureIcon = (iconName: string) => {
  const iconProps = { className: 'w-8 h-8 stroke-[1.4]' };
  switch (iconName?.toLowerCase()) {
    case 'truck':
      return <Truck {...iconProps} />;
    case 'shieldcheck':
    case 'shield_check':
    case 'shield':
      return <ShieldCheck {...iconProps} />;
    case 'award':
      return <Award {...iconProps} />;
    case 'messagesquaretext':
    case 'messagesquare':
    case 'message_square':
    case 'chat':
    case 'support':
      return <MessageSquareText {...iconProps} />;
    case 'gem':
    case 'diamond':
      return <Gem {...iconProps} />;
    case 'sparkles':
    case 'gold':
      return <Sparkles {...iconProps} />;
    case 'rotateccw':
    case 'return':
    case 'refund':
      return <RotateCcw {...iconProps} />;
    case 'heart':
      return <Heart {...iconProps} />;
    case 'clock':
      return <Clock {...iconProps} />;
    case 'headphones':
      return <Headphones {...iconProps} />;
    case 'gift':
      return <Gift {...iconProps} />;
    case 'lock':
      return <Lock {...iconProps} />;
    case 'star':
      return <Star {...iconProps} />;
    case 'percent':
      return <Percent {...iconProps} />;
    case 'tag':
      return <Tag {...iconProps} />;
    case 'sunmedium':
    case 'sun':
      return <SunMedium {...iconProps} />;
    case 'checkcircle2':
    case 'check':
      return <CheckCircle2 {...iconProps} />;
    case 'package':
    default:
      return <Package {...iconProps} />;
  }
};

interface ShopByGramProps {
  shopByGramEnabled?: boolean;
  trustBadgesEnabled?: boolean;
}

export const ShopByGram: React.FC<ShopByGramProps> = ({
  shopByGramEnabled,
  trustBadgesEnabled,
}) => {
  let settings: any = {};
  try {
    const page = usePage?.();
    settings = (page?.props as any)?.settings || {};
  } catch {
    settings = {};
  }

  const isGramActive =
    shopByGramEnabled !== undefined
      ? shopByGramEnabled
      : settings?.homepage_shop_by_gram_enabled !== '0' && settings?.homepage_shop_by_gram_enabled !== false;

  const isTrustActive =
    trustBadgesEnabled !== undefined
      ? trustBadgesEnabled
      : settings?.homepage_trust_badges_enabled !== '0' && settings?.homepage_trust_badges_enabled !== false;

  // If both sections are disabled, do not render this entire component
  if (!isGramActive && !isTrustActive) {
    return null;
  }

  const instagramUrl = settings?.instagram_url || 'https://instagram.com';
  const instagramHandle = settings?.instagram_handle || '@haarmonaa';

  const rawPosts: InstagramPostItem[] =
    Array.isArray(settings?.instagram_posts) && settings.instagram_posts.length > 0
      ? settings.instagram_posts
      : DEFAULT_GRAM_IMAGES;

  const rawFeatures: StoreFeatureItem[] =
    Array.isArray(settings?.store_features) && settings.store_features.length >= 3
      ? settings.store_features
      : DEFAULT_FEATURES;

  // Fallback broken image handler
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src =
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop';
  };

  // Dynamic responsive grid columns for Trust Features
  const getFeatureGridClass = (count: number) => {
    if (count === 3) return 'grid-cols-1 md:grid-cols-3';
    if (count === 4) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
    if (count === 5) return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5';
    return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6';
  };

  return (
    <section className="@container py-10 @sm:py-14 @lg:py-20 bg-white border-t border-gray-100 overflow-hidden">
      {/* 1. Shop by Gram Instagram Section (Controlled by Toggle) */}
      {isGramActive && (
        <>
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto px-4 mb-6 @sm:mb-10 @lg:mb-12 space-y-2">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 group cursor-pointer"
            >
              <h2 className="text-2xl @sm:text-3xl @lg:text-4xl font-extrabold text-gray-900 tracking-tight group-hover:text-[#d0473e] transition-colors">
                Shop by Gram
              </h2>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#d0473e] transition-colors" />
            </a>
            <p className="text-xs @sm:text-sm text-gray-500 font-medium">
              Inspire and let yourself be inspired, from one unique fashion to another. Follow{' '}
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 font-bold hover:underline"
              >
                {instagramHandle}
              </a>
            </p>
          </div>

          {/* FULL-WIDTH Instagram Gallery Grid */}
          <div className={`w-full px-2 @sm:px-4 @lg:px-6 ${isTrustActive ? 'mb-8 @sm:mb-12' : ''}`}>
            <div className="grid grid-cols-2 @sm:grid-cols-3 @[1024px]:grid-cols-6 gap-2.5 @sm:gap-4">
              {rawPosts.map((item, idx) => (
                <a
                  key={item.id || idx}
                  href={item.url || instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square rounded-[10px] overflow-hidden bg-gray-100 block shadow-2xs transition-all duration-500 hover:shadow-xl"
                >
                  <img
                    src={item.image}
                    alt={item.alt || 'Haarmonaa Jewelry Instagram'}
                    onError={handleImageError}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  {/* Dark Hover Glassmorphic Overlay with Instagram Handle */}
                  <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-white">
                    <svg
                      className="w-7 h-7 text-white transform scale-75 group-hover:scale-100 transition-transform duration-300 mb-1.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span className="text-[11px] font-bold tracking-wider opacity-90 truncate max-w-full px-2">
                      {item.handle || instagramHandle}
                    </span>
                    <span className="text-[9px] uppercase tracking-widest text-amber-300 font-extrabold mt-1">
                      Shop Look
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 2. Dynamic Trust Features / Value Proposition Cards (Controlled by Toggle) */}
      {isTrustActive && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`grid gap-8 sm:gap-10 text-center pt-2 ${getFeatureGridClass(
              rawFeatures.length
            )}`}
          >
            {rawFeatures.map((feat, idx) => (
              <div key={feat.id || idx} className="space-y-2.5 px-2">
                <div className="w-10 h-10 mx-auto flex items-center justify-center text-gray-900">
                  {feat.custom_icon ? (
                    <img
                      src={feat.custom_icon}
                      alt={feat.title}
                      className="w-8 h-8 object-contain mx-auto"
                    />
                  ) : (
                    renderFeatureIcon(feat.icon)
                  )}
                </div>
                <h3 className="font-bold text-gray-900 text-sm tracking-tight">{feat.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed max-w-[280px] mx-auto font-normal">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
