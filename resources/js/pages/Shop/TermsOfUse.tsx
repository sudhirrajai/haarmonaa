import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { GlozinLayout } from '@/components/layout/GlozinLayout';
import { SeoHead } from '@/components/seo/SeoHead';
import { Product } from '@/types/shop';

interface TermsOfUseProps {
  products?: Product[];
}

export default function TermsOfUse({ products = [] }: TermsOfUseProps) {
  const breadcrumbs = [
    { label: 'Home', url: '/' },
    { label: 'Terms Of Use', url: '/terms-of-use' },
  ];

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
            <Link href="/" className="hover:text-black">
              Home
            </Link>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-900 font-bold">Terms Of Use</span>
          </nav>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-gray-900 tracking-tight leading-tight">
            Terms Of Use
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="space-y-10 text-[14px] sm:text-[14.5px] text-gray-600 leading-relaxed">
          {/* Section 1 */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or purchasing from our Website, you acknowledge that you have read, understood, and
              agreed to these Terms of Use.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              2. Products & Availability
            </h2>
            <p>
              All products displayed on our Website are subject to availability. We reserve the right to modify or
              discontinue any product without prior notice.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              3. Pricing & Payments
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>All prices are listed in your selected currency and include applicable taxes unless stated otherwise.</li>
              <li>We accept various payment methods, processed securely via trusted third-party gateways.</li>
              <li>We reserve the right to change prices at any time without notice.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              4. Orders & Shipping
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Once an order is placed, you will receive a confirmation email with order details.</li>
              <li>Shipping times and costs vary depending on your location and selected delivery method.</li>
              <li>We are not responsible for delays caused by third-party shipping services or customs clearance.</li>
              <li>Tracking information will be provided when available.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              5. Returns & Exchanges
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>We offer a 30-day return policy on eligible unworn jewelry items in original velvet packaging.</li>
              <li>Custom engraved or altered pieces are final sale unless arriving with verified manufacturing defects.</li>
              <li>Return shipping costs for non-defective returns remain the customer's responsibility.</li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              6. Intellectual Property
            </h2>
            <p>
              All content, images, photography, branding, trademarks, and logos displayed on Haarmonaa are the exclusive
              intellectual property of Haarmonaa and are protected under international copyright and trademark laws.
            </p>
          </div>

          {/* Section 7 */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              7. Limitation of Liability
            </h2>
            <p>
              Haarmonaa shall not be liable for any direct, indirect, incidental, or consequential damages resulting from
              the use or inability to use our website or products.
            </p>
          </div>
        </div>
      </section>
    </GlozinLayout>
  );
}
