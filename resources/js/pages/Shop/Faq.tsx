import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { GlozinLayout } from '@/components/layout/GlozinLayout';
import { SeoHead } from '@/components/seo/SeoHead';
import { Product } from '@/types/shop';
import { Plus, Minus, ArrowRight, Sparkles } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  title: string;
  items: FaqItem[];
}

interface FaqContentCMS {
  header?: {
    badge?: string;
    title?: string;
    description?: string;
  };
  help_card?: {
    enabled?: boolean;
    title?: string;
    description?: string;
    button_text?: string;
    button_link?: string;
  };
  categories?: FaqCategory[];
}

interface FaqProps {
  products?: Product[];
  faqContent?: FaqContentCMS;
}

export default function Faq({ products = [], faqContent }: FaqProps) {
  const header = faqContent?.header;
  const helpCard = faqContent?.help_card;
  const isHelpCardActive = helpCard?.enabled !== false && !!helpCard?.title;
  const categories = faqContent?.categories || [];

  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({
    'cat-0-0': true,
  });

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Schema.org FAQPage JSON-LD
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: categories.flatMap((cat) =>
      cat.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      }))
    ),
  };

  const breadcrumbs = [
    { label: 'Home', url: '/' },
    { label: 'FAQ & Care Guide', url: '/faq' },
  ];

  return (
    <GlozinLayout allProducts={products}>
      <SeoHead
        title="FAQ & Jewelry Care Guide — Frequently Asked Questions"
        description="Find answers regarding Haarmonaa 18K solid gold vermeil jewelry, anti-tarnish waterproof guarantees, ring sizing, express shipping, and 7-day concierge returns."
        breadcrumbs={breadcrumbs}
        structuredData={faqSchema}
      />

      {/* 1. Header & Breadcrumbs */}
      <section className="pt-8 sm:pt-10 lg:pt-12 pb-8 sm:pb-10 lg:pb-12 bg-white text-center border-b border-gray-100/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="text-[13px] font-semibold text-gray-500 mb-4 sm:mb-6">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-900 font-bold">FAQ</span>
          </nav>

          {header?.badge && (
            <span className="text-xs font-bold uppercase tracking-widest text-[#d0473e] block mb-2">
              {header.badge}
            </span>
          )}

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-gray-900 tracking-tight leading-tight mb-3">
            {header?.title || 'Frequently Asked Questions'}
          </h1>

          {/* Subtitle */}
          {header?.description && (
            <p className="text-xs sm:text-[14px] lg:text-[14.5px] text-gray-500 max-w-xl mx-auto leading-relaxed">
              {header.description}
            </p>
          )}
        </div>
      </section>

      {/* 2. Main FAQ Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Concierge Help Card (4 Cols) */}
          {isHelpCardActive && (
            <div className="lg:col-span-4">
              <div className="bg-[#FAF9F6] rounded-3xl p-8 sm:p-10 space-y-5 border border-gray-200/80 shadow-2xs sticky top-28">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-[11px] font-extrabold tracking-wider uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>CONCIERGE CARE</span>
                </span>

                <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                  {helpCard?.title || 'Need Personal Styling Advice?'}
                </h2>

                <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed">
                  {helpCard?.description ||
                    'Our master jewelry concierge is available to assist you with sizing, custom gift packaging, or order queries.'}
                </p>

                {helpCard?.button_text && (
                  <div className="pt-2">
                    <Link
                      href={helpCard.button_link || '/contact-us'}
                      className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#d0473e] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
                    >
                      <span>{helpCard.button_text}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Right Column: Accordion Questions by Category */}
          <div className={`${isHelpCardActive ? 'lg:col-span-8' : 'lg:col-span-12 max-w-4xl mx-auto'} space-y-12`}>
            {categories.map((cat, catIdx) => (
              <div key={catIdx} className="space-y-4">
                <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight pb-2 border-b border-gray-200">
                  {cat.title}
                </h3>

                <div className="space-y-3">
                  {cat.items.map((item, itemIdx) => {
                    const itemKey = `cat-${catIdx}-${itemIdx}`;
                    const isOpen = Boolean(openItems[itemKey]);

                    return (
                      <div
                        key={itemIdx}
                        className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden transition-all shadow-2xs"
                      >
                        <button
                          type="button"
                          onClick={() => toggleItem(itemKey)}
                          className="w-full flex items-center justify-between p-5 text-left font-bold text-gray-900 text-sm hover:text-[#d0473e] transition-colors cursor-pointer"
                        >
                          <span className="pr-4">{item.question}</span>
                          <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-gray-700">
                            {isOpen ? (
                              <Minus className="w-3.5 h-3.5" />
                            ) : (
                              <Plus className="w-3.5 h-3.5" />
                            )}
                          </span>
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5 pt-1 text-xs sm:text-[13.5px] text-gray-600 leading-relaxed border-t border-gray-50">
                            <p className="whitespace-pre-line">{item.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </GlozinLayout>
  );
}
