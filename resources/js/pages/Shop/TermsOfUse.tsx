import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { GlozinLayout } from '@/components/layout/GlozinLayout';
import { SeoHead } from '@/components/seo/SeoHead';
import { Product } from '@/types/shop';

interface TermsSection {
  number: string;
  title: string;
  content: string;
}

interface TermsContentCMS {
  mode?: 'clauses' | 'full';
  header?: {
    badge?: string;
    title?: string;
    last_updated?: string;
  };
  full_content?: string;
  sections?: TermsSection[];
}

interface TermsOfUseProps {
  products?: Product[];
  termsContent?: TermsContentCMS;
}

export default function TermsOfUse({ products = [], termsContent }: TermsOfUseProps) {
  const breadcrumbs = [
    { label: 'Home', url: '/' },
    { label: 'Terms Of Use', url: '/terms-of-use' },
  ];

  const header = termsContent?.header;
  const isFullMode = termsContent?.mode === 'full';
  const fullContent = termsContent?.full_content;
  const sections = termsContent?.sections || [];

  return (
    <GlozinLayout allProducts={products}>
      <SeoHead
        title="Terms of Use & Purchase Agreement"
        description="Review the terms and conditions governing purchases, payments, shipping, warranties, and user conduct on Haarmonaa."
        breadcrumbs={breadcrumbs}
      />

      {/* Header & Breadcrumbs */}
      <section className="pt-8 sm:pt-10 lg:pt-12 pb-8 sm:pb-10 lg:pb-12 bg-white text-center border-b border-gray-100/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="text-[13px] font-semibold text-gray-500 mb-4 sm:mb-6">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-900 font-bold">Terms Of Use</span>
          </nav>

          {header?.badge && (
            <span className="text-xs font-bold uppercase tracking-widest text-[#d0473e] block mb-2">
              {header.badge}
            </span>
          )}

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-gray-900 tracking-tight leading-tight mb-2">
            {header?.title || 'Terms Of Use'}
          </h1>

          {header?.last_updated && (
            <span className="text-xs text-gray-400 font-medium block mt-1">
              {header.last_updated}
            </span>
          )}
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {isFullMode && fullContent ? (
          /* Full Document Mode */
          <div
            className="prose prose-neutral max-w-none text-[14px] sm:text-[14.5px] text-gray-700 leading-relaxed [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-200 [&_blockquote]:pl-4 [&_blockquote]:italic [&_a]:text-[#d0473e] [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: fullContent }}
          />
        ) : (
          /* Clause-by-Clause Mode */
          <div className="space-y-8 sm:space-y-10 text-[14px] sm:text-[14.5px] text-gray-600 leading-relaxed">
            {sections.map((section, idx) => (
              <div key={idx} className="space-y-2.5">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-baseline gap-2">
                  <span className="text-gray-400 font-extrabold">{section.number}.</span>
                  <span>{section.title}</span>
                </h2>
                <div
                  className="prose prose-neutral max-w-none text-gray-600 leading-relaxed pl-5 sm:pl-6 border-l-2 border-gray-100 [&_p]:mb-2.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-[#d0473e]"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </GlozinLayout>
  );
}
