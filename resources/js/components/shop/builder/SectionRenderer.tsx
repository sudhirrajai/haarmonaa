import React from 'react';
import { Product, Category } from '@/types/shop';
import { SplitHeroSlider, SplitSlide } from '@/components/shop/SplitHeroSlider';
import { PromoDualBanners, PromoCardData } from '@/components/shop/PromoDualBanners';
import { ShopByGram } from '@/components/shop/ShopByGram';
import { FeaturedProductSlider } from '@/components/shop/FeaturedProductSlider';
import { CategorySlider } from '@/components/shop/CategorySlider';
import { CuratedCapsuleSection, CuratedCapsuleSettings } from '@/components/shop/builder/CuratedCapsuleSection';
import { BestSellingSection, BestSellingSettings } from '@/components/shop/builder/BestSellingSection';
import { TrustBadgesSection, TrustBadgesSettings } from '@/components/shop/builder/TrustBadgesSection';
import { BrandManifestoSection, BrandManifestoSettings } from '@/components/shop/builder/BrandManifestoSection';
import { FaqAccordionSection, FaqAccordionSettings } from '@/components/shop/builder/FaqAccordionSection';
import { CustomHtmlSection, CustomHtmlSettings } from '@/components/shop/builder/CustomHtmlSection';

export interface SectionBlock {
  id: string;
  type: string;
  name: string;
  enabled: boolean;
  settings?: any;
  resolved_products?: Product[];
}

interface SectionRendererProps {
  sections?: SectionBlock[];
  products: Product[];
  bestSelling?: Product[];
  featuredCollection?: Product[];
  categories: Category[];
  banners?: PromoCardData[];
  slides?: SplitSlide[];
  heroSliderEnabled?: boolean;
  promoBannersEnabled?: boolean;
  trustBadgesEnabled?: boolean;
  shopByGramEnabled?: boolean;
  seasonalCollection?: any;
  seasonalProducts?: Product[];
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({
  sections,
  products = [],
  bestSelling = [],
  featuredCollection = [],
  categories = [],
  banners,
  slides,
  heroSliderEnabled = true,
  promoBannersEnabled = true,
  trustBadgesEnabled = true,
  shopByGramEnabled = true,
  seasonalCollection,
  seasonalProducts = [],
  onAddToCart,
  onQuickView,
}) => {
  // If no dynamic sections are passed (fallback mode), render legacy default sections
  if (!sections || sections.length === 0) {
    return (
      <>
        {heroSliderEnabled && <SplitHeroSlider slides={slides} />}
        {seasonalCollection && seasonalCollection.enabled !== false && (
          <CuratedCapsuleSection
            settings={seasonalCollection}
            products={seasonalProducts.length > 0 ? seasonalProducts : featuredCollection}
            onAddToCart={onAddToCart}
            onQuickView={onQuickView}
          />
        )}
        <CategorySlider categories={categories} />
        <BestSellingSection
          products={bestSelling.length > 0 ? bestSelling : products}
          onAddToCart={onAddToCart}
          onQuickView={onQuickView}
        />
        {promoBannersEnabled && banners && banners.length > 0 && (
          <PromoDualBanners cards={banners as any} />
        )}
        {featuredCollection && featuredCollection.length > 0 && (
          <FeaturedProductSlider
            products={featuredCollection}
            title="Featured Collection"
            subtitle="Exceptional design, delivering top performance and ensuring customer satisfaction all together."
            onAddToCart={onAddToCart}
            onQuickView={onQuickView}
          />
        )}
        <ShopByGram
          shopByGramEnabled={shopByGramEnabled}
          trustBadgesEnabled={trustBadgesEnabled}
        />
      </>
    );
  }

  // Dynamic modular rendering
  return (
    <>
      {sections.map((section) => {
        if (!section.enabled) return null;

        switch (section.type) {
          case 'hero_slider':
            return (
              <SplitHeroSlider
                key={section.id}
                slides={section.settings?.slides || slides}
              />
            );

          case 'curated_capsule':
            return (
              <CuratedCapsuleSection
                key={section.id}
                settings={section.settings as CuratedCapsuleSettings}
                products={section.resolved_products || seasonalProducts || featuredCollection}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
              />
            );

          case 'category_slider':
            return (
              <CategorySlider
                key={section.id}
                categories={categories}
              />
            );

          case 'best_selling':
            return (
              <BestSellingSection
                key={section.id}
                settings={section.settings as BestSellingSettings}
                products={section.resolved_products || bestSelling || products}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
              />
            );

          case 'dual_banners':
            return (
              <PromoDualBanners
                key={section.id}
                cards={(section.settings?.banners || banners) as any}
              />
            );

          case 'featured_products':
            return (
              <FeaturedProductSlider
                key={section.id}
                products={section.resolved_products || featuredCollection || products}
                title={section.settings?.title || 'Featured Collection'}
                subtitle={section.settings?.subtitle || 'Exceptional craftsmanship in 18K solid gold vermeil.'}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
              />
            );

          case 'shop_by_gram':
            return (
              <ShopByGram
                key={section.id}
                shopByGramEnabled={true}
                trustBadgesEnabled={false}
              />
            );

          case 'trust_badges':
            return (
              <TrustBadgesSection
                key={section.id}
                settings={section.settings as TrustBadgesSettings}
              />
            );

          case 'story_manifesto':
            return (
              <BrandManifestoSection
                key={section.id}
                settings={section.settings as BrandManifestoSettings}
              />
            );

          case 'faq_accordion':
            return (
              <FaqAccordionSection
                key={section.id}
                settings={section.settings as FaqAccordionSettings}
              />
            );

          case 'custom_html':
            return (
              <CustomHtmlSection
                key={section.id}
                settings={section.settings as CustomHtmlSettings}
              />
            );

          default:
            return null;
        }
      })}
    </>
  );
};
