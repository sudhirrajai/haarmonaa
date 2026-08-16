import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { GlozinLayout } from '@/components/layout/GlozinLayout';
import { Product } from '@/types/shop';
import { Plus, Minus } from 'lucide-react';

interface FaqProps {
  products?: Product[];
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqCategory {
  title: string;
  items: FaqItem[];
}

export default function Faq({ products = [] }: FaqProps) {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({
    'shop-1': false,
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const faqCategories: FaqCategory[] = [
    {
      title: 'Shopping Information',
      items: [
        {
          id: 'shop-1',
          question: 'How do I find a product?',
          answer:
            'You can use the search bar at the top of the header, or browse through our categories such as Rings, Necklaces, Earrings, and Bracelets using the main navigation.',
        },
        {
          id: 'shop-2',
          question: 'Can I save products to my wishlist?',
          answer:
            'Yes! Simply click the heart icon on any product card or product detail page to save your favorite jewelry to your personalized wishlist.',
        },
        {
          id: 'shop-3',
          question: 'How do I know if a product is in stock?',
          answer:
            'All items on our boutique display real-time stock availability. If an item is temporarily sold out, it will be clearly marked as Out of Stock.',
        },
        {
          id: 'shop-4',
          question: 'Can I purchase products as a guest?',
          answer:
            'Yes, you can checkout seamlessly as a guest without creating an account, though creating an account lets you track order histories easily.',
        },
      ],
    },
    {
      title: 'Payment Information',
      items: [
        {
          id: 'pay-1',
          question: 'What payment methods do you accept?',
          answer:
            'We accept all major credit/debit cards (Visa, MasterCard, American Express), UPI, Net Banking, and trusted payment wallets.',
        },
        {
          id: 'pay-2',
          question: 'Is my payment information secure?',
          answer:
            'Yes, all payments are encrypted with 256-bit SSL encryption and processed via certified Level-1 PCI DSS compliant gateways.',
        },
        {
          id: 'pay-3',
          question: 'Can I use a coupon code?',
          answer:
            'You can apply your promotional coupon or discount code in the cart drawer or during the checkout step before finalizing your order.',
        },
        {
          id: 'pay-4',
          question: 'What happens if my payment fails?',
          answer:
            'If a transaction is unsuccessful, any deducted amount is automatically refunded by your issuing bank within 3–5 business days.',
        },
      ],
    },
    {
      title: 'Order & Returns',
      items: [
        {
          id: 'ord-1',
          question: 'How do I track my order?',
          answer:
            'Once your jewelry order is dispatched, you will receive an email containing your tracking number and carrier tracking link.',
        },
        {
          id: 'ord-2',
          question: 'What is your return policy?',
          answer:
            'We offer a 30-day hassle-free return policy on eligible unworn items in their original luxury velvet packaging.',
        },
      ],
    },
  ];

  return (
    <GlozinLayout allProducts={products}>
      <Head title="FAQ — Haarmonaa Luxury Jewelry" />

      {/* 1. Header & Breadcrumbs */}
      <section className="pt-10 pb-12 bg-white text-center border-b border-gray-100/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="text-[13px] font-semibold text-gray-500 mb-6">
            <Link href="/" className="hover:text-black">
              Home
            </Link>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-900 font-bold">FAQ</span>
          </nav>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-gray-900 tracking-tight leading-tight mb-3">
            FAQ
          </h1>

          {/* Subtitle */}
          <p className="text-[14px] sm:text-[14.5px] text-gray-500 max-w-xl mx-auto leading-relaxed">
            Find answers to common questions about our products, services, and policies.
          </p>
        </div>
      </section>

      {/* 2. Main FAQ Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Contact Card (4 Cols) */}
          <div className="lg:col-span-4">
            <div className="bg-[#f8f8f8] rounded-3xl p-8 sm:p-10 space-y-6 shadow-2xs sticky top-28">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                Contact Us
              </h2>

              <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed">
                If you have an issue or question that requires immediate assistance, you can click the button below to chat live with a Customer Service representative.
              </p>

              <p className="text-xs sm:text-[13px] text-gray-500 leading-relaxed">
                Please allow 3 – 5 business days from the time your package arrives back to us for a refund to be issued.
              </p>

              <div className="space-y-3 pt-2">
                <Link
                  href="/contact-us"
                  className="block w-full py-3.5 bg-white text-black font-bold text-xs rounded-full border border-gray-300 hover:border-black transition-all text-center shadow-2xs"
                >
                  Contact Us
                </Link>

                <Link
                  href="/about-us"
                  className="block w-full py-3.5 bg-[#111111] text-white font-bold text-xs rounded-full hover:bg-[#d0473e] transition-all text-center shadow-xs"
                >
                  About Us
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: FAQ Accordion Categories (8 Cols) */}
          <div className="lg:col-span-8 space-y-12">
            {faqCategories.map((cat, catIdx) => (
              <div key={catIdx} className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                  {cat.title}
                </h2>

                <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
                  {cat.items.map((item) => {
                    const isOpen = !!openItems[item.id];
                    return (
                      <div key={item.id} className="py-4 sm:py-5">
                        <button
                          onClick={() => toggleItem(item.id)}
                          className="w-full flex items-center justify-between text-left group cursor-pointer"
                        >
                          <span className="text-[14.5px] sm:text-[15px] font-medium text-gray-900 group-hover:text-black transition-colors pr-4">
                            {item.question}
                          </span>
                          <span className="text-gray-400 group-hover:text-black flex-shrink-0 transition-transform">
                            {isOpen ? (
                              <Minus className="w-4 h-4 text-gray-900 stroke-[2]" />
                            ) : (
                              <Plus className="w-4 h-4 text-gray-400 stroke-[2]" />
                            )}
                          </span>
                        </button>

                        {isOpen && (
                          <div className="pt-3 pr-8 text-xs sm:text-[13.5px] text-gray-500 leading-relaxed animate-fade-in">
                            {item.answer}
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
