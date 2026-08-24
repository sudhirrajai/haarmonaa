import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';

export interface FaqItem {
  id: string | number;
  question: string;
  answer: string;
}

export interface FaqAccordionSettings {
  badge?: string;
  title?: string;
  subtitle?: string;
  items?: FaqItem[];
}

interface FaqAccordionSectionProps {
  settings?: FaqAccordionSettings;
}

export const FaqAccordionSection: React.FC<FaqAccordionSectionProps> = ({ settings = {} }) => {
  const defaultFaqs: FaqItem[] = [
    {
      id: 'faq_1',
      question: 'What is 18K Solid Gold Vermeil?',
      answer: 'Gold Vermeil (pronounced ver-may) is a premium gold plating technique requiring a thick minimum layer of 2.5 microns of real 18K solid gold electroplated over genuine 925 sterling silver, ensuring lifetime durability without fading.',
    },
    {
      id: 'faq_2',
      question: 'Is Haarmonaa jewelry 100% waterproof and sweatproof?',
      answer: 'Yes! All Haarmonaa jewelry is engineered with certified anti-tarnish protective sealing, making it completely waterproof, sweatproof, and resistant to perfumes or lotions.',
    },
    {
      id: 'faq_3',
      question: 'What is your shipping and return policy?',
      answer: 'We offer complimentary express shipping across India. Standard orders are dispatched within 24-48 hours. We also offer a hassle-free 15-day exchange and return policy.',
    },
    {
      id: 'faq_4',
      question: 'Does the jewelry come with authenticity certificates?',
      answer: 'Every piece is delivered in our signature velvet packaging with a personalized certificate of authenticity and 18K vermeil warranty card.',
    },
  ];

  const {
    badge = 'CONCIERGE & ADVICE',
    title = 'Frequently Asked Questions',
    subtitle = 'Everything you need to know about our craftsmanship, materials, and care.',
  } = settings;

  const items = settings.items && settings.items.length > 0 ? settings.items : defaultFaqs;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 sm:py-20 bg-[#faf8f5] border-y border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          {badge && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 mb-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase bg-amber-50 text-amber-800 border border-amber-200/50">
              <Sparkles className="w-3 h-3" />
              {badge}
            </span>
          )}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-500 mt-2 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        <div className="space-y-3 sm:space-y-4">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-200/70 overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer hover:bg-gray-50/60 transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-gray-900 pr-4">
                    {item.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'bg-amber-100 rotate-180 text-amber-900' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
