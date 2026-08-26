import React from 'react';
import { Config, Data } from '@measured/puck';
import { SplitHeroSlider } from '@/components/shop/SplitHeroSlider';
import { CuratedCapsuleSection } from '@/components/shop/builder/CuratedCapsuleSection';
import { BestSellingSection } from '@/components/shop/builder/BestSellingSection';
import { CategorySlider } from '@/components/shop/CategorySlider';
import { FeaturedProductSlider } from '@/components/shop/FeaturedProductSlider';
import { PromoDualBanners } from '@/components/shop/PromoDualBanners';
import { BrandManifestoSection } from '@/components/shop/builder/BrandManifestoSection';
import { TrustBadgesSection } from '@/components/shop/builder/TrustBadgesSection';
import { FaqAccordionSection } from '@/components/shop/builder/FaqAccordionSection';
import { CustomHtmlSection } from '@/components/shop/builder/CustomHtmlSection';
import { ShopByGram } from '@/components/shop/ShopByGram';
import { Product, Category } from '@/types/shop';

export type Props = {
  HeroSlider: {
    slides: Array<{
      id: number | string;
      title: string;
      subtitle: string;
      badge?: string;
      buttonText?: string;
      buttonLink?: string;
      leftImage: string;
      rightImage: string;
      enabled?: boolean;
    }>;
  };
  CuratedCapsule: {
    title: string;
    subtitle: string;
    badge: string;
    description: string;
    category_slug: string;
    banner_image: string;
    button_text: string;
    button_link: string;
    theme: 'gold' | 'rose' | 'noir' | 'minimal';
  };
  BestSellingGrid: {
    title: string;
    subtitle: string;
    badge: string;
    view_all_link: string;
    view_all_text: string;
  };
  CategorySlider: {
    title: string;
    subtitle: string;
  };
  FeaturedProducts: {
    title: string;
    subtitle: string;
  };
  DualPromoBanners: {
    banner1_title: string;
    banner1_subtitle: string;
    banner1_desc: string;
    banner1_btn_text: string;
    banner1_btn_link: string;
    banner2_image: string;
    banner2_title: string;
    banner2_subtitle: string;
    banner2_desc: string;
    banner2_btn_text: string;
    banner2_btn_link: string;
  };
  BrandStoryManifesto: {
    badge: string;
    title: string;
    subtitle: string;
    quote: string;
    body_text: string;
    image: string;
    signature_name: string;
    signature_title: string;
    button_text: string;
    button_link: string;
  };
  TrustBadges: {
    title: string;
    subtitle: string;
  };
  FaqAccordion: {
    badge: string;
    title: string;
    subtitle: string;
    items: Array<{
      id: string | number;
      question: string;
      answer: string;
    }>;
  };
  ShopByGram: {
    handle: string;
  };
  CustomHtml: {
    html_content: string;
    container_width: 'boxed' | 'full';
    bg_color: string;
    padding_y: 'none' | 'small' | 'medium' | 'large';
  };
};

export const createPuckConfig = (
  products: Product[] = [],
  categories: Category[] = [],
  collections: { id: number; name: string; slug: string }[] = []
): Config<Props> => {
  const collectionOptions = [
    { label: 'Featured Products (Automatic)', value: 'all' },
    ...collections.map((c) => ({ label: `Collection: ${c.name}`, value: c.slug })),
    ...categories.map((c) => ({ label: `Category: ${c.name}`, value: c.slug })),
  ];

  return {
    categories: {
      hero: {
        title: 'Hero & Highlights',
        components: ['HeroSlider', 'CuratedCapsule'],
      },
      products: {
        title: 'Product Showcases',
        components: ['BestSellingGrid', 'FeaturedProducts', 'CategorySlider'],
      },
      marketing: {
        title: 'Banners & Brand Story',
        components: ['DualPromoBanners', 'BrandStoryManifesto', 'ShopByGram'],
      },
      trust: {
        title: 'Trust & Concierge',
        components: ['TrustBadges', 'FaqAccordion', 'CustomHtml'],
      },
    },
    components: {
      HeroSlider: {
        label: 'Split Hero Slider',
        fields: {
          slides: {
            type: 'array',
            label: 'Slides List',
            arrayFields: {
              title: { type: 'text', label: 'Slide Title' },
              subtitle: { type: 'text', label: 'Subtitle / Tagline' },
              badge: { type: 'text', label: 'Editorial Badge' },
              buttonText: { type: 'text', label: 'Button Text' },
              buttonLink: { type: 'text', label: 'Button Link' },
              leftImage: { type: 'text', label: 'Left Image URL' },
              rightImage: { type: 'text', label: 'Right Image URL' },
            },
            getItemSummary: (item) => item.title || 'Untitled Slide',
          },
        },
        defaultProps: {
          slides: [
            {
              id: 1,
              subtitle: 'CAPTIVATING COLLECTION',
              title: 'Sculpted By Light',
              buttonText: 'Shop Collection',
              buttonLink: '/shop',
              badge: 'NEW 2026',
              leftImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop',
              rightImage: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1200&auto=format&fit=crop',
              enabled: true,
            },
            {
              id: 2,
              subtitle: '18K SOLID GOLD & VERMEIL',
              title: 'Modern Baroque Pearl Series',
              buttonText: 'Explore Pearls',
              buttonLink: '/shop?category=earrings',
              badge: 'HOT RELEASE',
              leftImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',
              rightImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop',
              enabled: true,
            },
          ],
        },
        render: ({ slides }) => <SplitHeroSlider slides={slides} />,
      },

      CuratedCapsule: {
        label: 'Curated / Seasonal Capsule',
        fields: {
          title: { type: 'text', label: 'Capsule Title' },
          subtitle: { type: 'text', label: 'Subtitle / Tagline' },
          badge: { type: 'text', label: 'Editorial Badge' },
          category_slug: {
            type: 'select',
            label: 'Collection / Category Source',
            options: collectionOptions,
          },
          theme: {
            type: 'select',
            label: 'Color Theme',
            options: [
              { label: 'Warm Gold Vermeil', value: 'gold' },
              { label: 'Rose Gold Shimmer', value: 'rose' },
              { label: 'Midnight Noir Luxury', value: 'noir' },
              { label: 'Clean Minimalist White', value: 'minimal' },
            ],
          },
          banner_image: { type: 'text', label: 'Highlight Banner Image URL' },
          description: { type: 'textarea', label: 'Story & Description' },
          button_text: { type: 'text', label: 'CTA Button Text' },
          button_link: { type: 'text', label: 'CTA Button Link' },
        },
        defaultProps: {
          title: 'Summer Solstice Edition',
          subtitle: 'SUNLIT REFLECTIONS & WATERPROOF HEIRLOOMS',
          badge: 'SUMMER 2026 CAPSULE',
          category_slug: 'all',
          theme: 'gold',
          banner_image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop',
          description: 'A radiant curation of waterproof, anti-tarnish 18k solid gold vermeil designed to shine effortlessly through beach sun, ocean mist, and sunset soirees.',
          button_text: 'Explore Summer Edit',
          button_link: '/shop',
        },
        render: (props) => {
          let capsuleProducts = products;
          if (props.category_slug && props.category_slug !== 'all') {
            const target = props.category_slug.toLowerCase();
            const matched = products.filter(
              (p) =>
                p.category.toLowerCase().includes(target) ||
                p.categories?.some((c) => c.toLowerCase().includes(target))
            );
            if (matched.length > 0) capsuleProducts = matched;
          }

          return (
            <CuratedCapsuleSection
              settings={props}
              products={capsuleProducts}
            />
          );
        },
      },

      BestSellingGrid: {
        label: 'Best Selling Grid',
        fields: {
          title: { type: 'text', label: 'Section Title' },
          subtitle: { type: 'text', label: 'Subtitle' },
          badge: { type: 'text', label: 'Badge' },
          view_all_text: { type: 'text', label: 'View All Button Text' },
          view_all_link: { type: 'text', label: 'View All Button Link' },
        },
        defaultProps: {
          title: 'Best Selling Products',
          subtitle: 'TIMELESS EVERYDAY LUXURY IN 18K GOLD VERMEIL',
          badge: 'MOST LOVED PIECES',
          view_all_text: 'Explore Entire Collection',
          view_all_link: '/shop',
        },
        render: (props) => (
          <BestSellingSection
            settings={props}
            products={products}
          />
        ),
      },

      CategorySlider: {
        label: 'Shop by Category Track',
        fields: {
          title: { type: 'text', label: 'Title' },
          subtitle: { type: 'text', label: 'Subtitle' },
        },
        defaultProps: {
          title: 'Shop By Category',
          subtitle: 'EXPLORE TIMELESS CRAFTSMANSHIP',
        },
        render: () => <CategorySlider categories={categories} />,
      },

      FeaturedProducts: {
        label: 'Featured Products Carousel',
        fields: {
          title: { type: 'text', label: 'Title' },
          subtitle: { type: 'text', label: 'Subtitle' },
        },
        defaultProps: {
          title: 'Captivating Collection',
          subtitle: 'HANDCRAFTED 18K THICK SOLID GOLD VERMEIL',
        },
        render: (props) => (
          <FeaturedProductSlider
            products={products.filter((p) => p.isHot).length > 0 ? products.filter((p) => p.isHot) : products}
            title={props.title}
            subtitle={props.subtitle}
          />
        ),
      },

      DualPromoBanners: {
        label: 'Dual Promo Marketing Banners',
        fields: {
          banner1_title: { type: 'text', label: 'Banner 1 Title' },
          banner1_subtitle: { type: 'text', label: 'Banner 1 Subtitle' },
          banner1_desc: { type: 'textarea', label: 'Banner 1 Description' },
          banner1_btn_text: { type: 'text', label: 'Banner 1 Button Text' },
          banner1_btn_link: { type: 'text', label: 'Banner 1 Button Link' },
          banner2_image: { type: 'text', label: 'Banner 2 Image URL' },
          banner2_title: { type: 'text', label: 'Banner 2 Title' },
          banner2_subtitle: { type: 'text', label: 'Banner 2 Subtitle' },
          banner2_desc: { type: 'textarea', label: 'Banner 2 Description' },
          banner2_btn_text: { type: 'text', label: 'Banner 2 Button Text' },
          banner2_btn_link: { type: 'text', label: 'Banner 2 Button Link' },
        },
        defaultProps: {
          banner1_title: 'Light The Wonders',
          banner1_subtitle: 'EPITOME OF REFINEMENT',
          banner1_desc: "This season, the ordinary becomes extraordinary. Glozin's ambassadors open gates to wonder, where dreams come alive.",
          banner1_btn_text: 'Shop Now',
          banner1_btn_link: '/shop',
          banner2_image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop',
          banner2_title: 'Sculpted Solid Gold Hoops',
          banner2_subtitle: 'HAARMONAA ICONIC',
          banner2_desc: 'Timeless architectural curves crafted for effortless daily statement.',
          banner2_btn_text: 'Explore Hoops',
          banner2_btn_link: '/shop?category=earrings',
        },
        render: (props) => (
          <PromoDualBanners
            cards={[
              {
                id: 1,
                subtitle: props.banner1_subtitle,
                title: props.banner1_title,
                description: props.banner1_desc,
                buttonText: props.banner1_btn_text,
                buttonLink: props.banner1_btn_link,
                bgClass: 'bg-[#f4f4f4]',
                textColor: 'dark',
                align: 'center',
                enabled: true,
              },
              {
                id: 2,
                image: props.banner2_image,
                subtitle: props.banner2_subtitle,
                title: props.banner2_title,
                description: props.banner2_desc,
                buttonText: props.banner2_btn_text,
                buttonLink: props.banner2_btn_link,
                textColor: 'light',
                align: 'left',
                enabled: true,
              },
            ]}
          />
        ),
      },

      BrandStoryManifesto: {
        label: 'Brand Story & Manifesto',
        fields: {
          badge: { type: 'text', label: 'Badge' },
          title: { type: 'text', label: 'Headline' },
          subtitle: { type: 'text', label: 'Subtitle' },
          quote: { type: 'textarea', label: 'Featured Quote' },
          body_text: { type: 'textarea', label: 'Story Body Text' },
          image: { type: 'text', label: 'Editorial Image URL' },
          signature_name: { type: 'text', label: 'Signature Name' },
          signature_title: { type: 'text', label: 'Signature Title' },
          button_text: { type: 'text', label: 'Button Text' },
          button_link: { type: 'text', label: 'Button Link' },
        },
        defaultProps: {
          badge: 'THE HAARMONAA MANIFESTO',
          title: 'Sculpted for Everyday Splendor',
          subtitle: '18K SOLID GOLD VERMEIL & CONSCIOUS LUXURY',
          quote: '“Jewelry shouldn’t be reserved for special occasions. It should accompany every breath, sunlight glance, and spontaneous celebration of your life.”',
          body_text: 'At Haarmonaa, each jewel is meticulously electroplated with a lavish 2.5–3.0 micron layer of genuine 18K solid gold over premium 925 sterling silver — creating certified waterproof, anti-tarnish, and hypoallergenic masterpieces designed to endure forever.',
          image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop',
          signature_name: 'The Atelier Team',
          signature_title: 'Haarmonaa Fine Jewelry',
          button_text: 'Read Brand Story',
          button_link: '/about-us',
        },
        render: (props) => <BrandManifestoSection settings={props} />,
      },

      TrustBadges: {
        label: 'Luxury Trust Badges',
        fields: {
          title: { type: 'text', label: 'Title' },
          subtitle: { type: 'text', label: 'Subtitle' },
        },
        defaultProps: {
          title: 'The Haarmonaa Promise',
          subtitle: 'CERTIFIED LUXURY EXPERIENCE & UNCOMPROMISING CRAFTSMANSHIP',
        },
        render: (props) => <TrustBadgesSection settings={props} />,
      },

      FaqAccordion: {
        label: 'FAQ & Care Accordion',
        fields: {
          badge: { type: 'text', label: 'Badge' },
          title: { type: 'text', label: 'Title' },
          subtitle: { type: 'text', label: 'Subtitle' },
          items: {
            type: 'array',
            label: 'Questions & Answers',
            arrayFields: {
              question: { type: 'text', label: 'Question' },
              answer: { type: 'textarea', label: 'Answer' },
            },
            getItemSummary: (item) => item.question || 'Untitled Question',
          },
        },
        defaultProps: {
          badge: 'CONCIERGE & ADVICE',
          title: 'Frequently Asked Questions',
          subtitle: 'Everything you need to know about our craftsmanship, materials, and care.',
          items: [
            {
              id: 'faq_1',
              question: 'What is 18K Solid Gold Vermeil?',
              answer: 'Gold Vermeil is a premium technique requiring a thick minimum layer of 2.5 microns of real 18K solid gold over genuine 925 sterling silver.',
            },
            {
              id: 'faq_2',
              question: 'Is Haarmonaa jewelry 100% waterproof and sweatproof?',
              answer: 'Yes! All Haarmonaa jewelry is engineered with certified anti-tarnish sealing, making it completely waterproof and sweatproof.',
            },
            {
              id: 'faq_3',
              question: 'What is your shipping and return policy?',
              answer: 'We offer complimentary express shipping across India and a hassle-free 15-day return policy.',
            },
          ],
        },
        render: (props) => <FaqAccordionSection settings={props} />,
      },

      ShopByGram: {
        label: 'Shop by Gram (Instagram)',
        fields: {
          handle: { type: 'text', label: 'Instagram Handle' },
        },
        defaultProps: {
          handle: '@haarmonaa',
        },
        render: () => (
          <ShopByGram
            shopByGramEnabled={true}
            trustBadgesEnabled={false}
          />
        ),
      },

      CustomHtml: {
        label: 'Custom HTML / Embed Block',
        fields: {
          html_content: { type: 'textarea', label: 'HTML & CSS Code' },
          container_width: {
            type: 'select',
            label: 'Container Width',
            options: [
              { label: 'Boxed (Max 7xl Centered)', value: 'boxed' },
              { label: 'Full Width', value: 'full' },
            ],
          },
          bg_color: { type: 'text', label: 'Background Color' },
          padding_y: {
            type: 'select',
            label: 'Vertical Padding',
            options: [
              { label: 'None', value: 'none' },
              { label: 'Small', value: 'small' },
              { label: 'Medium', value: 'medium' },
              { label: 'Large', value: 'large' },
            ],
          },
        },
        defaultProps: {
          html_content: '<div class="text-center py-10 bg-amber-50/50 rounded-3xl border border-amber-200/50 p-6">\n  <span class="text-xs font-bold uppercase tracking-widest text-amber-800">VIP EXCLUSIVE PROMO</span>\n  <h3 class="text-2xl font-bold text-gray-900 mt-1">Get 15% Off Your First 18K Vermeil Order</h3>\n  <p class="text-xs text-gray-600 mt-1">Use coupon code <strong class="text-amber-900 bg-amber-100 px-2 py-0.5 rounded">VERMEIL15</strong> at checkout.</p>\n</div>',
          container_width: 'boxed',
          bg_color: '#ffffff',
          padding_y: 'medium',
        },
        render: (props) => <CustomHtmlSection settings={props} />,
      },
    },
  };
};

export const defaultPuckInitialData: Data<Props> = {
  content: [
    {
      type: 'HeroSlider',
      props: {
        id: 'HeroSlider-1',
        slides: [
          {
            id: 1,
            subtitle: 'CAPTIVATING COLLECTION',
            title: 'Sculpted By Light',
            buttonText: 'Shop Collection',
            buttonLink: '/shop',
            badge: 'NEW 2026',
            leftImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop',
            rightImage: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1200&auto=format&fit=crop',
            enabled: true,
          },
          {
            id: 2,
            subtitle: '18K SOLID GOLD & VERMEIL',
            title: 'Modern Baroque Pearl Series',
            buttonText: 'Explore Pearls',
            buttonLink: '/shop?category=earrings',
            badge: 'HOT RELEASE',
            leftImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',
            rightImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop',
            enabled: true,
          },
        ],
      },
    },
    {
      type: 'CuratedCapsule',
      props: {
        id: 'CuratedCapsule-1',
        title: 'Summer Solstice Edition',
        subtitle: 'SUNLIT REFLECTIONS & WATERPROOF HEIRLOOMS',
        badge: 'SUMMER 2026 CAPSULE',
        category_slug: 'all',
        theme: 'gold',
        banner_image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop',
        description: 'A radiant curation of waterproof, anti-tarnish 18k solid gold vermeil designed to shine effortlessly through beach sun, ocean mist, and sunset soirees.',
        button_text: 'Explore Summer Edit',
        button_link: '/shop',
      },
    },
    {
      type: 'CategorySlider',
      props: {
        id: 'CategorySlider-1',
        title: 'Shop By Category',
        subtitle: 'EXPLORE TIMELESS CRAFTSMANSHIP',
      },
    },
    {
      type: 'BestSellingGrid',
      props: {
        id: 'BestSellingGrid-1',
        title: 'Best Selling Products',
        subtitle: 'TIMELESS EVERYDAY LUXURY IN 18K GOLD VERMEIL',
        badge: 'MOST LOVED PIECES',
        view_all_text: 'Explore Entire Collection',
        view_all_link: '/shop',
      },
    },
    {
      type: 'DualPromoBanners',
      props: {
        id: 'DualPromoBanners-1',
        banner1_title: 'Light The Wonders',
        banner1_subtitle: 'EPITOME OF REFINEMENT',
        banner1_desc: "This season, the ordinary becomes extraordinary. Glozin's ambassadors open gates to wonder, where dreams come alive.",
        banner1_btn_text: 'Shop Now',
        banner1_btn_link: '/shop',
        banner2_image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop',
        banner2_title: 'Sculpted Solid Gold Hoops',
        banner2_subtitle: 'HAARMONAA ICONIC',
        banner2_desc: 'Timeless architectural curves crafted for effortless daily statement.',
        banner2_btn_text: 'Explore Hoops',
        banner2_btn_link: '/shop?category=earrings',
      },
    },
    {
      type: 'FeaturedProducts',
      props: {
        id: 'FeaturedProducts-1',
        title: 'Captivating Collection',
        subtitle: 'HANDCRAFTED 18K THICK SOLID GOLD VERMEIL',
      },
    },
    {
      type: 'ShopByGram',
      props: {
        id: 'ShopByGram-1',
        handle: '@haarmonaa',
      },
    },
    {
      type: 'TrustBadges',
      props: {
        id: 'TrustBadges-1',
        title: 'The Haarmonaa Promise',
        subtitle: 'CERTIFIED LUXURY EXPERIENCE & UNCOMPROMISING CRAFTSMANSHIP',
      },
    },
  ],
  root: { props: { title: 'Haarmonaa Homepage' } },
};
