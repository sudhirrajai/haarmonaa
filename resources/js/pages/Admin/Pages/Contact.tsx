import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import {
  MessageSquareText,
  ArrowLeft,
  Save,
  ExternalLink,
  Phone,
  Mail,
  Clock,
  Send,
} from 'lucide-react';

interface ContactContentCMS {
  header: {
    badge: string;
    title: string;
    description: string;
  };
  channels: {
    email: string;
    phone: string;
    hours: string;
    response_time: string;
  };
  form: {
    title: string;
    agreement_text: string;
  };
}

interface ContactProps {
  contactContent: ContactContentCMS;
}

export default function Contact({ contactContent: initialContent }: ContactProps) {
  const [content, setContent] = useState<ContactContentCMS>(initialContent);
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    router.post(
      '/admin/pages/contact',
      { contactContent: content },
      {
        onFinish: () => setSaving(false),
      }
    );
  };

  return (
    <AdminLayout title="Contact Us Page Customizer">
      <Head title="Contact Us Customizer — Admin Haarmonaa" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-1">
            <Link href="/admin/pages" className="hover:text-black transition-colors">
              Pages
            </Link>
            <span>/</span>
            <span className="text-gray-900">Contact Us</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Contact Us Page Customizer
          </h1>
          <p className="text-xs sm:text-[13px] text-gray-500 mt-0.5">
            Configure customer concierge direct phone, support emails, operating hours, and inquiry form.
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
            href="/contact-us"
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
        {/* Header Section */}
        <div className="bg-white p-6 sm:p-8 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <MessageSquareText className="w-5 h-5 text-purple-600" />
            <h2 className="text-sm font-bold text-gray-900">Header Banner</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                placeholder="CUSTOMER CONCIERGE"
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
                placeholder="Contact Us"
                className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 font-extrabold focus:outline-hidden focus:border-black"
              />
            </div>
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
              placeholder="Our concierge team is available to assist you..."
              className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-700 focus:outline-hidden focus:border-black"
            />
          </div>
        </div>

        {/* Support Channels & Operating Hours */}
        <div className="bg-white p-6 sm:p-8 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Phone className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-bold text-gray-900">Direct Concierge Channels</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Concierge Email</label>
              <input
                type="text"
                value={content.channels.email || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    channels: { ...content.channels, email: e.target.value },
                  })
                }
                placeholder="support@haarmonaa.in"
                className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Direct Phone / WhatsApp</label>
              <input
                type="text"
                value={content.channels.phone || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    channels: { ...content.channels, phone: e.target.value },
                  })
                }
                placeholder="+91 98765 43210"
                className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Operating Hours</label>
              <input
                type="text"
                value={content.channels.hours || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    channels: { ...content.channels, hours: e.target.value },
                  })
                }
                placeholder="Mon – Sat: 10:00 AM – 7:00 PM IST"
                className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Response Guarantee</label>
              <input
                type="text"
                value={content.channels.response_time || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    channels: { ...content.channels, response_time: e.target.value },
                  })
                }
                placeholder="Average response time: within 2–4 hours"
                className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
              />
            </div>
          </div>
        </div>

        {/* Inquiry Form Settings */}
        <div className="bg-white p-6 sm:p-8 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Send className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-gray-900">Inquiry Form Settings</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Form Heading</label>
              <input
                type="text"
                value={content.form.title || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    form: { ...content.form, title: e.target.value },
                  })
                }
                placeholder="Send a Message"
                className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 font-bold focus:outline-hidden focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Consent Agreement Notice</label>
              <input
                type="text"
                value={content.form.agreement_text || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    form: { ...content.form, agreement_text: e.target.value },
                  })
                }
                placeholder="I agree that my submitted data is collected..."
                className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-700 focus:outline-hidden focus:border-black"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#111111] hover:bg-[#d0473e] text-white rounded-[10px] text-xs font-bold uppercase tracking-wider transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Contact Us Page'}</span>
            </button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
