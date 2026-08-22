import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminToggle } from '@/components/admin/AdminToggle';
import {
  FileQuestion,
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategoryCMS {
  title: string;
  items: FaqItem[];
}

interface FaqContentCMS {
  header: {
    badge: string;
    title: string;
    description: string;
  };
  help_card: {
    enabled: boolean;
    title: string;
    description: string;
    button_text: string;
    button_link: string;
  };
  categories: FaqCategoryCMS[];
}

interface FaqProps {
  faqContent: FaqContentCMS;
}

export default function Faq({ faqContent: initialContent }: FaqProps) {
  const [content, setContent] = useState<FaqContentCMS>(initialContent);
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    router.post(
      '/admin/pages/faq',
      { faqContent: content },
      {
        onFinish: () => setSaving(false),
      }
    );
  };

  const addCategory = () => {
    setContent({
      ...content,
      categories: [
        ...content.categories,
        {
          title: 'New FAQ Topic',
          items: [
            {
              question: 'Sample Question?',
              answer: 'Sample Answer detailing the policy or advice...',
            },
          ],
        },
      ],
    });
  };

  const removeCategory = (catIdx: number) => {
    if (content.categories.length <= 1) {
      alert('Must keep at least 1 FAQ category.');
      return;
    }
    const updated = content.categories.filter((_, idx) => idx !== catIdx);
    setContent({ ...content, categories: updated });
  };

  const addQuestion = (catIdx: number) => {
    const updated = [...content.categories];
    updated[catIdx].items.push({
      question: 'New Question?',
      answer: 'Detailed answer...',
    });
    setContent({ ...content, categories: updated });
  };

  const removeQuestion = (catIdx: number, qIdx: number) => {
    if (content.categories[catIdx].items.length <= 1) {
      alert('Each category must have at least 1 question.');
      return;
    }
    const updated = [...content.categories];
    updated[catIdx].items = updated[catIdx].items.filter((_, idx) => idx !== qIdx);
    setContent({ ...content, categories: updated });
  };

  return (
    <AdminLayout title="FAQ & Care Guide Customizer">
      <Head title="FAQ Customizer — Admin Haarmonaa" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-1">
            <Link href="/admin/pages" className="hover:text-black transition-colors">
              Pages
            </Link>
            <span>/</span>
            <span className="text-gray-900">FAQ & Jewelry Care</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            FAQ & Jewelry Care Customizer
          </h1>
          <p className="text-xs sm:text-[13px] text-gray-500 mt-0.5">
            Organize questions by topic categories (anti-tarnish waterproofing, shipping transit, ring sizing) and concierge help cards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/pages"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-[10px] text-xs font-bold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Pages</span>
          </Link>

          <a
            href="/faq"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 hover:border-black text-gray-900 rounded-[10px] text-xs font-bold transition-all shadow-2xs"
          >
            <span>Preview Live</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
          </a>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Header & Concierge Help Card Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Header Banner */}
          <div className="bg-white p-6 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              <h2 className="text-sm font-bold text-gray-900">Page Header Details</h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Badge Tag</label>
              <input
                type="text"
                value={content.header.badge || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    header: { ...content.header, badge: e.target.value },
                  })
                }
                placeholder="HELP & SUPPORT"
                className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 font-bold focus:outline-hidden focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Main Heading</label>
              <input
                type="text"
                value={content.header.title || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    header: { ...content.header, title: e.target.value },
                  })
                }
                placeholder="Frequently Asked Questions"
                className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 font-extrabold focus:outline-hidden focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Header Subtitle</label>
              <textarea
                rows={2}
                value={content.header.description || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    header: { ...content.header, description: e.target.value },
                  })
                }
                placeholder="Find answers to common questions..."
                className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-700 focus:outline-hidden focus:border-black"
              />
            </div>
          </div>

          {/* Concierge Help Card Sidebar */}
          <div className="bg-white p-6 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-500" />
                <h2 className="text-sm font-bold text-gray-900">Sidebar Concierge Card</h2>
              </div>

              <AdminToggle
                label={content.help_card.enabled ? 'Enabled' : 'Hidden'}
                checked={content.help_card.enabled}
                onChange={(val) =>
                  setContent({
                    ...content,
                    help_card: { ...content.help_card, enabled: val },
                  })
                }
                activeColor="bg-emerald-600"
                size="sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Card Title</label>
              <input
                type="text"
                value={content.help_card.title || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    help_card: { ...content.help_card, title: e.target.value },
                  })
                }
                placeholder="Need Personal Styling Advice?"
                className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 font-bold focus:outline-hidden focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Card Description</label>
              <textarea
                rows={2}
                value={content.help_card.description || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    help_card: { ...content.help_card, description: e.target.value },
                  })
                }
                placeholder="Our master jewelry concierge is available..."
                className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-700 focus:outline-hidden focus:border-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Button Label</label>
                <input
                  type="text"
                  value={content.help_card.button_text || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      help_card: { ...content.help_card, button_text: e.target.value },
                    })
                  }
                  placeholder="Contact Concierge"
                  className="w-full bg-white border border-gray-200 rounded-[8px] py-1.5 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Button URL</label>
                <input
                  type="text"
                  value={content.help_card.button_link || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      help_card: { ...content.help_card, button_link: e.target.value },
                    })
                  }
                  placeholder="/contact-us"
                  className="w-full bg-white border border-gray-200 rounded-[8px] py-1.5 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic FAQ Categories and Questions */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-gray-900">
              FAQ Question Categories ({content.categories.length})
            </h2>

            <button
              type="button"
              onClick={addCategory}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-[8px] text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add FAQ Category</span>
            </button>
          </div>

          {content.categories.map((cat, catIdx) => (
            <div
              key={catIdx}
              className="bg-white p-6 sm:p-7 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-3">
                <div className="flex-1 max-w-md">
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-500 mb-1">
                    Category #{catIdx + 1} Name
                  </label>
                  <input
                    type="text"
                    value={cat.title}
                    onChange={(e) => {
                      const updated = [...content.categories];
                      updated[catIdx].title = e.target.value;
                      setContent({ ...content, categories: updated });
                    }}
                    placeholder="Shopping & Products"
                    className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-sm font-extrabold text-gray-900 focus:outline-hidden focus:border-black"
                  />
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => addQuestion(catIdx)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-[6px] text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Question</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => removeCategory(catIdx)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-[6px] transition-colors cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-3 pt-1">
                {cat.items.map((qItem, qIdx) => (
                  <div
                    key={qIdx}
                    className="p-4 bg-gray-50 rounded-[8px] border border-gray-200/70 space-y-2 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-gray-700">
                        Q{qIdx + 1}: Question
                      </label>
                      <button
                        type="button"
                        onClick={() => removeQuestion(catIdx, qIdx)}
                        className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-[4px] transition-colors cursor-pointer"
                        title="Delete Question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={qItem.question}
                      onChange={(e) => {
                        const updated = [...content.categories];
                        updated[catIdx].items[qIdx].question = e.target.value;
                        setContent({ ...content, categories: updated });
                      }}
                      placeholder="e.g. Is Haarmonaa jewelry genuine 18K solid gold vermeil?"
                      className="w-full bg-white border border-gray-200 rounded-[6px] py-1.5 px-3 text-xs font-bold text-gray-900 focus:outline-hidden focus:border-black"
                    />

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Answer
                      </label>
                      <textarea
                        rows={2}
                        value={qItem.answer}
                        onChange={(e) => {
                          const updated = [...content.categories];
                          updated[catIdx].items[qIdx].answer = e.target.value;
                          setContent({ ...content, categories: updated });
                        }}
                        placeholder="Detailed answer text..."
                        className="w-full bg-white border border-gray-200 rounded-[6px] py-1.5 px-3 text-xs text-gray-700 leading-relaxed focus:outline-hidden focus:border-black"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#111111] hover:bg-[#d0473e] text-white rounded-[10px] text-xs font-bold uppercase tracking-wider transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save FAQ Page'}</span>
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
