import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import {
  FileText,
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  Layers,
  FileCode,
  CheckCircle2,
} from 'lucide-react';

interface TermsSection {
  number: string;
  title: string;
  content: string;
}

interface TermsContentCMS {
  mode?: 'clauses' | 'full';
  header: {
    badge: string;
    title: string;
    last_updated: string;
  };
  full_content?: string;
  sections: TermsSection[];
}

interface TermsProps {
  termsContent: TermsContentCMS;
}

export default function Terms({ termsContent: initialContent }: TermsProps) {
  const [content, setContent] = useState<TermsContentCMS>({
    mode: initialContent.mode || 'clauses',
    header: initialContent.header || {
      badge: 'LEGAL & POLICIES',
      title: 'Terms Of Use',
      last_updated: 'Last Updated: August 2026',
    },
    full_content: initialContent.full_content || '',
    sections: initialContent.sections || [],
  });

  const [activeTab, setActiveTab] = useState<'clauses' | 'full'>(
    content.mode || 'clauses'
  );
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    router.post(
      '/admin/pages/terms',
      { termsContent: { ...content, mode: activeTab } },
      {
        onFinish: () => setSaving(false),
      }
    );
  };

  const addSection = () => {
    const nextNum = String(content.sections.length + 1);
    setContent({
      ...content,
      sections: [
        ...content.sections,
        {
          number: nextNum,
          title: 'New Policy Section',
          content: '<p>Details and clauses for this section...</p>',
        },
      ],
    });
  };

  const removeSection = (index: number) => {
    if (content.sections.length <= 1) {
      alert('Must keep at least one policy section.');
      return;
    }
    const updated = content.sections.filter((_, idx) => idx !== index);
    setContent({ ...content, sections: updated });
  };

  return (
    <AdminLayout title="Terms Of Use Customizer">
      <Head title="Terms Of Use Customizer — Admin Haarmonaa" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-1">
            <Link href="/admin/pages" className="hover:text-black transition-colors">
              Pages
            </Link>
            <span>/</span>
            <span className="text-gray-900">Terms Of Use</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Terms Of Use Customizer
          </h1>
          <p className="text-xs sm:text-[13px] text-gray-500 mt-0.5">
            Configure legal agreements, product authenticity warranty, payment policies, and intellectual property.
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
            href="/terms-of-use"
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
        {/* Header Customization */}
        <div className="bg-white p-6 sm:p-8 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-gray-900">Page Header Banner</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Top Badge Tag</label>
              <input
                type="text"
                value={content.header.badge || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    header: { ...content.header, badge: e.target.value },
                  })
                }
                placeholder="LEGAL & POLICIES"
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
                placeholder="Terms Of Use"
                className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 font-extrabold focus:outline-hidden focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Last Updated Stamp</label>
              <input
                type="text"
                value={content.header.last_updated || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    header: { ...content.header, last_updated: e.target.value },
                  })
                }
                placeholder="Last Updated: August 2026"
                className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-700 focus:outline-hidden focus:border-black"
              />
            </div>
          </div>
        </div>

        {/* Content Mode Selection Tabs */}
        <div className="bg-white p-6 sm:p-8 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-extrabold text-gray-900">
                Choose Content Display Mode
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Select whether you want structured modular clauses or a single full-document rich text editor.
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('clauses');
                  setContent({ ...content, mode: 'clauses' });
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'clauses'
                    ? 'bg-white text-black shadow-xs'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Clause-Wise Builder</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('full');
                  setContent({ ...content, mode: 'full' });
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'full'
                    ? 'bg-white text-black shadow-xs'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                <FileCode className="w-4 h-4" />
                <span>Full Document Editor</span>
              </button>
            </div>
          </div>

          {/* Active Mode Notice */}
          <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl flex items-center gap-2 text-xs text-amber-900 font-medium">
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Active Storefront Display:{' '}
              <strong className="font-bold">
                {activeTab === 'clauses'
                  ? 'Clause-Wise Sections'
                  : 'Full Document View'}
              </strong>
            </span>
          </div>

          {/* Tab 1: Clause-Wise Builder */}
          {activeTab === 'clauses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700">
                  Total Clauses: {content.sections.length}
                </span>

                <button
                  type="button"
                  onClick={addSection}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-[8px] text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Clause</span>
                </button>
              </div>

              <div className="space-y-4">
                {content.sections.map((section, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-gray-50 rounded-[10px] border border-gray-200/80 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500">
                        Clause #{idx + 1}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeSection(idx)}
                        className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-[6px] transition-colors cursor-pointer"
                        title="Delete Clause"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          Number / Tag
                        </label>
                        <input
                          type="text"
                          value={section.number}
                          onChange={(e) => {
                            const updated = [...content.sections];
                            updated[idx].number = e.target.value;
                            setContent({ ...content, sections: updated });
                          }}
                          placeholder="1"
                          className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 font-bold focus:outline-hidden focus:border-black"
                        />
                      </div>

                      <div className="sm:col-span-10">
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          Clause Title
                        </label>
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => {
                            const updated = [...content.sections];
                            updated[idx].title = e.target.value;
                            setContent({ ...content, sections: updated });
                          }}
                          placeholder="Acceptance of Terms"
                          className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 font-bold focus:outline-hidden focus:border-black"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Clause Rich Content
                      </label>
                      <RichTextEditor
                        value={section.content}
                        onChange={(val) => {
                          const updated = [...content.sections];
                          updated[idx].content = val;
                          setContent({ ...content, sections: updated });
                        }}
                        placeholder="Write or format clause content..."
                        minHeight="140px"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Full Document Single Rich Text Editor */}
          {activeTab === 'full' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Full Terms Of Use Document (Rich Text / HTML)
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  You can paste your complete policy document here with headings, lists, bold text, and links.
                </p>
                <RichTextEditor
                  value={content.full_content || ''}
                  onChange={(val) => setContent({ ...content, full_content: val })}
                  placeholder="Paste or write your full terms and conditions document..."
                  minHeight="420px"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#111111] hover:bg-[#d0473e] text-white rounded-[10px] text-xs font-bold uppercase tracking-wider transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Terms Of Use'}</span>
            </button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
