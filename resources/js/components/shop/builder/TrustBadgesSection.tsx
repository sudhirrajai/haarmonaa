import React from 'react';
import {
  Package,
  ShieldCheck,
  MessageSquareText,
  Truck,
  Award,
  Gem,
  RotateCcw,
  Heart,
  Clock,
  Gift,
  Zap,
} from 'lucide-react';

export interface TrustBadgeItem {
  id: string | number;
  icon: string;
  custom_icon?: string;
  title: string;
  description: string;
}

export interface TrustBadgesSettings {
  title?: string;
  subtitle?: string;
  features?: TrustBadgeItem[];
}

interface TrustBadgesSectionProps {
  settings?: TrustBadgesSettings;
}

export const TrustBadgesSection: React.FC<TrustBadgesSectionProps> = ({ settings = {} }) => {
  const defaultFeatures: TrustBadgeItem[] = [
    {
      id: 'feat_1',
      icon: 'Package',
      title: 'Free Shipping Worldwide',
      description: 'Complimentary insured express delivery on all orders across India & global destinations.',
    },
    {
      id: 'feat_2',
      icon: 'ShieldCheck',
      title: '18K Vermeil Warranty',
      description: 'Certified 100% waterproof, anti-tarnish, hypoallergenic thick solid gold layering guarantee.',
    },
    {
      id: 'feat_3',
      icon: 'MessageSquareText',
      title: '24/7 Concierge Support',
      description: 'Dedicated personal styling advice and direct assistance via WhatsApp & email.',
    },
    {
      id: 'feat_4',
      icon: 'Gift',
      title: 'Bespoke Gift Box',
      description: 'Every order arrives in our signature velvet packaging with certificate of authenticity.',
    },
  ];

  const features = settings.features && settings.features.length > 0 ? settings.features : defaultFeatures;

  const renderIcon = (iconName: string, customIconUrl?: string) => {
    if (customIconUrl) {
      return (
        <img
          src={customIconUrl}
          alt=""
          className="w-7 h-7 object-contain group-hover:scale-110 transition-transform"
        />
      );
    }

    const iconProps = { className: 'w-6 h-6 text-amber-700 transition-transform group-hover:scale-110' };

    switch (iconName) {
      case 'Package':
        return <Package {...iconProps} />;
      case 'ShieldCheck':
        return <ShieldCheck {...iconProps} />;
      case 'MessageSquareText':
        return <MessageSquareText {...iconProps} />;
      case 'Truck':
        return <Truck {...iconProps} />;
      case 'Award':
        return <Award {...iconProps} />;
      case 'Gem':
        return <Gem {...iconProps} />;
      case 'RotateCcw':
        return <RotateCcw {...iconProps} />;
      case 'Heart':
        return <Heart {...iconProps} />;
      case 'Clock':
        return <Clock {...iconProps} />;
      case 'Gift':
        return <Gift {...iconProps} />;
      case 'Zap':
        return <Zap {...iconProps} />;
      default:
        return <ShieldCheck {...iconProps} />;
    }
  };

  return (
    <section className="@container py-10 @sm:py-14 bg-[#faf8f5] border-y border-amber-100/60">
      <div className="max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8">
        {settings.title && (
          <div className="text-center max-w-xl mx-auto mb-8 @sm:mb-10">
            <h2 className="text-2xl @sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {settings.title}
            </h2>
            {settings.subtitle && (
              <p className="text-xs @sm:text-sm text-gray-500 mt-1.5">{settings.subtitle}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 @sm:grid-cols-2 @[1024px]:grid-cols-4 gap-4 @sm:gap-6">
          {features.map((feat) => (
            <div
              key={feat.id}
              className="flex items-start gap-3.5 p-4 @sm:p-5 rounded-2xl bg-white border border-amber-100/40 shadow-xs hover:shadow-md hover:border-amber-200 transition-all group"
            >
              <div className="w-10 h-10 @sm:w-11 @sm:h-11 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-200/50">
                {renderIcon(feat.icon, feat.custom_icon)}
              </div>
              <div className="space-y-1 min-w-0">
                <h3 className="text-xs @sm:text-sm font-bold text-gray-900 leading-tight truncate">
                  {feat.title}
                </h3>
                <p className="text-[11px] @sm:text-xs text-gray-500 leading-relaxed line-clamp-3">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
