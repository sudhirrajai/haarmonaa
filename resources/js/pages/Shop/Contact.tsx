import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { GlozinLayout } from '@/components/layout/GlozinLayout';
import { SeoHead } from '@/components/seo/SeoHead';
import { Product } from '@/types/shop';
import { CheckCircle2, Phone, Mail, Clock, Send, MapPin } from 'lucide-react';

interface ContactProps {
  products?: Product[];
}

export default function Contact({ products = [] }: ContactProps) {
  const { settings } = (usePage().props as any) || {};

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    agreePolicy: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreePolicy) {
      alert('Please agree to the Privacy Policy before sending your message.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '', agreePolicy: false });
    }, 600);
  };

  const supportEmail = settings?.store_email || 'support@haarmonaa.in';
  const supportPhone = settings?.store_phone || '';
  const storeAddress = settings?.store_address || '';

  const breadcrumbs = [
    { label: 'Home', url: '/' },
    { label: 'Contact Us', url: '/contact-us' },
  ];

  return (
    <GlozinLayout allProducts={products}>
      <SeoHead
        title="Contact Concierge & Customer Care"
        description="Get in touch with Haarmonaa customer concierge for bespoke jewelry inquiries, order assistance, styling advice, and support."
        breadcrumbs={breadcrumbs}
      />

      {/* 1. Header & Breadcrumbs */}
      <section className="pt-10 pb-12 bg-white text-center border-b border-gray-100/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="text-[13px] font-semibold text-gray-500 mb-6">
            <Link href="/" className="hover:text-black">
              Home
            </Link>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-900 font-bold">Contact Us</span>
          </nav>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-gray-900 tracking-tight leading-tight mb-3">
            Contact Us
          </h1>

          {/* Subtitle */}
          <p className="text-[14px] sm:text-[14.5px] text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {supportPhone ? (
              <>
                Please use the form below. You can also contact customer concierge at{' '}
                <a href={`tel:${supportPhone.replace(/[^0-9+]/g, '')}`} className="text-gray-900 font-semibold hover:underline">
                  {supportPhone}
                </a>
                .
              </>
            ) : (
              'Our concierge team is available to assist you with bespoke enquiries, orders, and jewelry care.'
            )}
          </p>
        </div>
      </section>

      {/* 2. Main 2-Column Contact Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Support Channels (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
                Customer Concierge
              </h2>
              <p className="text-xs sm:text-[13px] text-gray-500 leading-relaxed">
                Have a question regarding sizing, shipping, or materials? Contact us using the channels below.
              </p>
            </div>

            {/* Channel 1: Customer Care */}
            <div className="space-y-1.5 text-xs sm:text-[13px] text-gray-600">
              <h3 className="font-bold text-gray-900 text-sm">Customer Care:</h3>
              {supportPhone && (
                <p>
                  Phone:{' '}
                  <a href={`tel:${supportPhone.replace(/[^0-9+]/g, '')}`} className="text-gray-900 hover:underline">
                    {supportPhone}
                  </a>
                </p>
              )}
              <p>
                Email:{' '}
                <a href={`mailto:${supportEmail}`} className="text-gray-900 hover:underline">
                  {supportEmail}
                </a>
              </p>
              <p>Opening hours: Monday – Saturday (9:00am – 6:00pm IST)</p>
            </div>

            {/* Channel 2: Store Location / Address */}
            {storeAddress && (
              <div className="space-y-1.5 text-xs sm:text-[13px] text-gray-600">
                <h3 className="font-bold text-gray-900 text-sm">Boutique & Studio:</h3>
                <p>{storeAddress}</p>
              </div>
            )}

            {/* Channel 3: Press & Partnerships */}
            <div className="space-y-1.5 text-xs sm:text-[13px] text-gray-600">
              <h3 className="font-bold text-gray-900 text-sm">Press & Partnerships:</h3>
              <p>
                Email:{' '}
                <a href={`mailto:${supportEmail}`} className="text-gray-900 hover:underline">
                  {supportEmail}
                </a>
              </p>
            </div>
          </div>

          {/* Right Column: Contact Us Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
                Contact Us
              </h2>
              <p className="text-xs sm:text-[13px] text-gray-500 leading-relaxed">
                Please submit all general enquiries in the contact form below and we look forward to hearing from you soon.
              </p>
            </div>

            {submitted && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-xs font-semibold animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>Thank you! Your message has been received. Our concierge will get back to you shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#fdfdfd] border border-gray-200/90 rounded-full py-3 px-5 text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-gray-900 focus:bg-white transition-all shadow-2xs"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    required
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#fdfdfd] border border-gray-200/90 rounded-full py-3 px-5 text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-gray-900 focus:bg-white transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Message Textarea */}
              <div>
                <textarea
                  required
                  rows={6}
                  placeholder="Enter please your message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#fdfdfd] border border-gray-200/90 rounded-2xl p-5 text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-gray-900 focus:bg-white transition-all shadow-2xs resize-y"
                />
              </div>

              {/* Privacy Policy Checkbox */}
              <div className="flex items-center gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="agreePolicy"
                  checked={formData.agreePolicy}
                  onChange={(e) => setFormData({ ...formData, agreePolicy: e.target.checked })}
                  className="w-4 h-4 rounded-xs border-gray-300 text-black focus:ring-black cursor-pointer"
                />
                <label htmlFor="agreePolicy" className="text-xs text-gray-600 cursor-pointer select-none">
                  I agree to the{' '}
                  <Link href="/about-us" className="text-gray-900 font-bold underline hover:text-[#d0473e]">
                    Privacy Policy
                  </Link>{' '}
                  of the website.
                </label>
              </div>

              {/* Send Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#9ca3af] hover:bg-[#111111] text-white px-10 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-xs disabled:opacity-50 cursor-pointer active:scale-95"
                >
                  {isSubmitting ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </GlozinLayout>
  );
}
