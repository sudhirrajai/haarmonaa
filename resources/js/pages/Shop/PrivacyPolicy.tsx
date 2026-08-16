import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { GlozinLayout } from '@/components/layout/GlozinLayout';
import { Product } from '@/types/shop';

interface PrivacyPolicyProps {
  products?: Product[];
}

export default function PrivacyPolicy({ products = [] }: PrivacyPolicyProps) {
  return (
    <GlozinLayout allProducts={products}>
      <Head title="Privacy Policy — Haarmonaa Luxury Jewelry" />

      {/* Header & Breadcrumbs */}
      <section className="pt-10 pb-12 bg-white text-center border-b border-gray-100/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="text-[13px] font-semibold text-gray-500 mb-6">
            <Link href="/" className="hover:text-black">
              Home
            </Link>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-900 font-bold">Privacy Policy</span>
          </nav>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-gray-900 tracking-tight leading-tight">
            Privacy Policy
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
        <div className="space-y-10 text-[14px] sm:text-[14.5px] text-gray-600 leading-relaxed">
          {/* Section 1 */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              1. Information We Collect
            </h2>
            <p>
              We collect information you provide directly to us when creating an account, browsing our boutique,
              placing an order, subscribing to our newsletters, or contacting our concierge team. This includes your name,
              email address, shipping address, and payment transaction details.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>To fulfill, process, and ship your jewelry orders with accurate delivery tracking.</li>
              <li>To provide seamless customer support and communicate order updates.</li>
              <li>To send personalized product announcements and exclusive discounts (with opt-out at any time).</li>
              <li>To prevent fraudulent transactions and maintain platform security.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              3. Data Protection & Security
            </h2>
            <p>
              We implement comprehensive technical and organizational safeguards, including SSL/TLS encryption for all
              sensitive communications and strict access protocols to protect your personal information against unauthorized access.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              4. Cookies & Analytics
            </h2>
            <p>
              Our website uses cookies and similar tracking technologies to remember your shopping cart items, preserve
              your login preferences, and analyze site traffic to enhance your shopping experience.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              5. Third-Party Sharing
            </h2>
            <p>
              We never sell or rent your personal data to third parties. We only share information with vetted partners
              strictly necessary for operating our website, processing payments, and fulfilling logistics.
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              6. Your Rights
            </h2>
            <p>
              You have the right to access, update, or request the deletion of your personal data at any time. To exercise
              these rights, please reach out to our privacy officer at{' '}
              <a href="mailto:support@haarmonaa.in" className="text-gray-900 font-semibold underline hover:text-[#d0473e]">
                support@haarmonaa.in
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </GlozinLayout>
  );
}
