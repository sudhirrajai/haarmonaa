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
  Headphones,
  Phone,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Lock,
  Star,
  Smile,
  ThumbsUp,
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
  layout?: 'grid' | 'carousel';
  columns_desktop?: number | string;
  columns_tablet?: number | string;
  columns_mobile?: number | string;
  card_style?: 'bordered' | 'filled' | 'minimal';
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
  const layout = settings.layout || 'grid';

  const colsDesktop = Number(settings.columns_desktop) || (features.length === 3 ? 3 : 4);
  const colsTablet = Number(settings.columns_tablet) || 2;
  const colsMobile = Number(settings.columns_mobile) || 1;

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

    const iconProps = { className: 'w-5 h-5 text-amber-800 transition-transform group-hover:scale-110' };

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
      case 'Headphones':
        return <Headphones {...iconProps} />;
      case 'Phone':
        return <Phone {...iconProps} />;
      case 'Sparkles':
        return <Sparkles {...iconProps} />;
      case 'RefreshCw':
        return <RefreshCw {...iconProps} />;
      case 'CheckCircle2':
        return <CheckCircle2 {...iconProps} />;
      case 'Lock':
        return <Lock {...iconProps} />;
      case 'Star':
        return <Star {...iconProps} />;
      case 'Smile':
        return <Smile {...iconProps} />;
      case 'ThumbsUp':
        return <ThumbsUp {...iconProps} />;
      default:
        return <ShieldCheck {...iconProps} />;
    }
  };

  const getDesktopGridClass = () => {
    switch (colsDesktop) {
      case 1:
        return '@[1024px]:grid-cols-1';
      case 2:
        return '@[1024px]:grid-cols-2';
      case 3:
        return '@[1024px]:grid-cols-3';
      case 4:
        return '@[1024px]:grid-cols-4';
      case 5:
        return '@[1024px]:grid-cols-5';
      case 6:
        return '@[1024px]:grid-cols-6';
      default:
        return '@[1024px]:grid-cols-4';
    }
  };

  const getTabletGridClass = () => {
    switch (colsTablet) {
      case 1:
        return '@sm:grid-cols-1 @[768px]:grid-cols-1';
      case 2:
        return '@sm:grid-cols-2 @[768px]:grid-cols-2';
      case 3:
        return '@sm:grid-cols-3 @[768px]:grid-cols-3';
      default:
        return '@sm:grid-cols-2 @[768px]:grid-cols-2';
    }
  };

  const getMobileGridClass = () => {
    return colsMobile === 2 ? 'grid-cols-2' : 'grid-cols-1';
  };

  return (
    <section className="@container py-10 @sm:py-14 bg-[#faf8f5] border-y border-amber-100/60 w-full">
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

        {layout === 'carousel' ? (
          /* Carousel / Horizontal Track Mode */
          <div className="w-full overflow-x-auto no-scrollbar scrollbar-none [&::-webkit-scrollbar]:hidden py-2">
            <div className="flex flex-nowrap items-stretch gap-4 @sm:gap-6 min-w-max px-1">
              {features.map((feat) => (
                <div
                  key={feat.id}
                  className="w-[280px] @sm:w-[320px] shrink-0 flex items-start gap-3.5 p-4 @sm:p-5 rounded-2xl bg-white border border-amber-100/60 shadow-xs hover:shadow-md hover:border-amber-200 transition-all group"
                >
                  <div className="w-10 h-10 @sm:w-11 @sm:h-11 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-200/50">
                    {renderIcon(feat.icon, feat.custom_icon)}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-xs @sm:text-sm font-bold text-gray-900 leading-tight">
                      {feat.title}
                    </h3>
                    <p className="text-[11px] @sm:text-xs text-gray-500 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Responsive Multi-Device Grid Mode */
          <div className={`grid gap-4 @sm:gap-6 ${getMobileGridClass()} ${getTabletGridClass()} ${getDesktopGridClass()}`}>
            {features.map((feat) => (
              <div
                key={feat.id}
                className="flex items-start gap-3.5 p-4 @sm:p-5 rounded-2xl bg-white border border-amber-100/60 shadow-xs hover:shadow-md hover:border-amber-200 transition-all group"
              >
                <div className="w-10 h-10 @sm:w-11 @sm:h-11 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-200/50">
                  {renderIcon(feat.icon, feat.custom_icon)}
                </div>
                <div className="space-y-1 min-w-0">
                  <h3 className="text-xs @sm:text-sm font-bold text-gray-900 leading-tight">
                    {feat.title}
                  </h3>
                  <p className="text-[11px] @sm:text-xs text-gray-500 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
