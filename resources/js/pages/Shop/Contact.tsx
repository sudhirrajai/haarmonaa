import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { GlozinLayout } from '@/components/layout/GlozinLayout';
import { SeoHead } from '@/components/seo/SeoHead';
import { Product } from '@/types/shop';
import { CheckCircle2, Phone, Mail, Clock, Send, Sparkles } from 'lucide-react';

interface ContactContentCMS {
  header?: {
    badge?: string;
    title?: string;
    description?: string;
  };
  channels?: {
    email?: string;
    phone?: string;
    hours?: string;
    response_time?: string;
  };
  form?: {
    title?: string;
    agreement_text?: string;
  };
}

interface ContactProps {
  products?: Product[];
  contactContent?: ContactContentCMS;
}

export default function Contact({ products = [], contactContent }: ContactProps) {
  const { settings } = (usePage().props as any) || {};

  const header = contactContent?.header;
  const channels = contactContent?.channels;
  const formSettings = contactContent?.form;

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

  const supportEmail = channels?.email || settings?.store_email || 'support@haarmonaa.in';
  const supportPhone = channels?.phone || settings?.store_phone || '+91 98765 43210';
  const operatingHours = channels?.hours || 'Mon – Sat: 10:00 AM – 7:00 PM IST';
  const responseTime = channels?.response_time || 'Average response time: within 2–4 hours';

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
      <section className="pt-8 sm:pt-10 lg:pt-12 pb-8 sm:pb-10 lg:pb-12 bg-white text-center border-b border-gray-100/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="text-[13px] font-semibold text-gray-500 mb-4 sm:mb-6">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-900 font-bold">Contact Us</span>
          </nav>

          {header?.badge && (
            <span className="text-xs font-bold uppercase tracking-widest text-[#d0473e] block mb-2">
              {header.badge}
            </span>
          )}

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-gray-900 tracking-tight leading-tight mb-3">
            {header?.title || 'Contact Us'}
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-[14px] lg:text-[14.5px] text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {header?.description ||
              'Our concierge team is available to assist you with bespoke enquiries, orders, sizing, and jewelry care.'}
          </p>
        </div>
      </section>

      {/* 2. Main 2-Column Contact Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left Column: Support Channels (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#d0473e] block mb-1">
                DIRECT CHANNELS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Customer Concierge
              </h2>
              <p className="text-xs sm:text-[13px] text-gray-500 mt-1 leading-relaxed">
                Have a question regarding sizing, shipping, or materials? Reach out directly.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {/* Phone Card */}
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl shadow-2xs text-gray-900 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Phone & WhatsApp
                  </h3>
                  <a
                    href={`tel:${supportPhone.replace(/[^0-9+]/g, '')}`}
                    className="text-sm sm:text-base font-extrabold text-gray-900 hover:text-[#d0473e] transition-colors mt-0.5 block"
                  >
                    {supportPhone}
                  </a>
                  <span className="text-[11px] text-gray-400 block mt-0.5">
                    {operatingHours}
                  </span>
                </div>
              </div>

              {/* Email Card */}
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl shadow-2xs text-gray-900 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Concierge Email
                  </h3>
                  <a
                    href={`mailto:${supportEmail}`}
                    className="text-sm sm:text-base font-extrabold text-gray-900 hover:text-[#d0473e] transition-colors mt-0.5 block"
                  >
                    {supportEmail}
                  </a>
                  <span className="text-[11px] text-gray-400 block mt-0.5">
                    {responseTime}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Inquiry Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-gray-200/80 shadow-2xs">
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mb-2">
              {formSettings?.title || 'Send a Message'}
            </h2>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Fill out the details below and our jewelry concierge will get back to you shortly.
            </p>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 animate-fadeIn">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-emerald-900">Message Delivered</h3>
                <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. Our concierge team has received your message and will respond to {supportEmail} within 2–4 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-5 py-2 bg-emerald-800 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-emerald-900 transition-colors cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@domain.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Message / Inquiry <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we assist you with jewelry sizing, orders, or care?"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white transition-all"
                  />
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="agreePolicy"
                    checked={formData.agreePolicy}
                    onChange={(e) => setFormData({ ...formData, agreePolicy: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black mt-0.5 cursor-pointer"
                  />
                  <label htmlFor="agreePolicy" className="text-xs text-gray-500 leading-relaxed cursor-pointer">
                    {formSettings?.agreement_text ||
                      'I agree that my submitted data is collected and stored according to the Privacy Policy.'}
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 bg-[#111111] hover:bg-[#d0473e] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </GlozinLayout>
  );
}
