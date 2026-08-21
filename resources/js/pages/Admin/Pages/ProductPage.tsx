import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Package, ArrowLeft, ShieldCheck, Sparkles, Truck, CheckCircle2 } from 'lucide-react';

export default function ProductPage() {
  return (
    <AdminLayout title="Product Page Template">
      <Head title="Product Page Customizer — Admin Haarmonaa" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-1">
            <Link href="/admin/pages" className="hover:text-black transition-colors">
              Pages
            </Link>
            <span>/</span>
            <span className="text-gray-900">Product Detail Page</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Product Detail Page Customizer
          </h1>
          <p className="text-xs sm:text-[13px] text-gray-500 mt-0.5">
            Configure global product detail page layout rules, accordion tabs, and sticky checkout actions.
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

      {/* Section Blocks */}
      <div className="space-y-5">
        <div className="bg-white p-6 sm:p-8 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-500" />
              <h2 className="text-sm font-bold text-gray-900">Product Page Template Sections</h2>
            </div>
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10.5px] font-extrabold rounded-full border border-emerald-200">
              Ready for Expansion
            </span>
          </div>

          <p className="text-xs text-gray-500 leading-relaxed">
            The Product Detail Page route is fully wired to the central Pages architecture. As we develop custom accordion blocks, sticky add-to-cart bars, and live customer reviews widgets, their management settings will appear right here.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
