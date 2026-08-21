import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { MessageSquareText, ArrowLeft } from 'lucide-react';

export default function Contact() {
  return (
    <AdminLayout title="Contact Us Page">
      <Head title="Contact Us Customizer — Admin Haarmonaa" />

      <div className="flex items-center justify-between">
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
            Configure customer concierge channels, bespoke consultation hours, and support emails.
          </p>
        </div>

        <Link
          href="/admin/pages"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-[10px] text-xs font-bold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Pages</span>
        </Link>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <MessageSquareText className="w-5 h-5 text-purple-600" />
            <h2 className="text-sm font-bold text-gray-900">Concierge & Inquiries Setup</h2>
          </div>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          Contact page configuration ready for customized concierge contact cards and support routing.
        </p>
      </div>
    </AdminLayout>
  );
}
