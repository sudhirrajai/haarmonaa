import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import {
  Layout,
  ExternalLink,
  Edit3,
  Layers,
  Sparkles,
  Package,
  FileText,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Camera,
} from 'lucide-react';

interface PageItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  sections_count: number;
  status: 'published' | 'draft';
  updated_at: string;
  edit_url: string;
  preview_url: string;
}

interface PagesIndexProps {
  pages: PageItem[];
}

export default function Index({ pages }: PagesIndexProps) {
  const getPageIcon = (id: string) => {
    switch (id) {
      case 'home':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'product':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'about':
        return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
      default:
        return <FileText className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <AdminLayout title="Pages Management">
      <Head title="Pages & Layouts — Admin Haarmonaa" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Pages & Section Customizer
          </h1>
          <p className="text-xs sm:text-[13px] text-gray-500 mt-1">
            Manage page structures, live hero sliders, curated Instagram feeds, trust guarantee badges, and storefront layouts.
          </p>
        </div>

        <Link
          href="/admin/pages/home"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111111] hover:bg-[#d0473e] text-white rounded-[10px] text-xs font-bold transition-all shadow-xs shrink-0"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Edit Homepage Sections</span>
        </Link>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {pages.map((page) => (
          <div
            key={page.id}
            className="bg-white rounded-[10px] border border-gray-200/80 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between p-5 space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-gray-50 border border-gray-100 rounded-[8px]">
                  {getPageIcon(page.id)}
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Live</span>
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-[#d0473e] transition-colors">
                  {page.name}
                </h3>
                <span className="text-[11px] font-mono text-gray-400 block mt-0.5">
                  Route: {page.slug}
                </span>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  {page.description}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-500">
                <Layers className="w-3.5 h-3.5 text-gray-400" />
                <span>{page.sections_count} Sections</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={page.preview_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-[8px] transition-colors"
                  title="View Live Page"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>

                <Link
                  href={page.edit_url}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#111111] hover:bg-[#d0473e] text-white rounded-[8px] text-xs font-bold transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Customize</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
