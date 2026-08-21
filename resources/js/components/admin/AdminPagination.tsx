import React from 'react';
import { Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

export interface PaginationData<T = any> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
  prev_page_url: string | null;
  next_page_url: string | null;
  links?: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
}

interface AdminPaginationProps {
  pagination: PaginationData;
  perPageOptions?: number[];
  onPerPageChange?: (perPage: number) => void;
}

export const AdminPagination: React.FC<AdminPaginationProps> = ({
  pagination,
  perPageOptions = [10, 15, 20, 50, 100],
  onPerPageChange,
}) => {
  if (!pagination || pagination.total === 0) {
    return null;
  }

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = Number(e.target.value);
    if (onPerPageChange) {
      onPerPageChange(newPerPage);
    } else {
      const url = new URL(window.location.href);
      url.searchParams.set('per_page', String(newPerPage));
      url.searchParams.set('page', '1');
      router.get(url.pathname + url.search, {}, { preserveState: true, preserveScroll: true });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-white border-t border-gray-100 rounded-b-[10px]">
      {/* Left: Per Page Selector & Showing Count */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-600">Rows per page:</span>

          {/* Luxury Native Styled Select (Never clipped by overflow) */}
          <div className="relative inline-flex items-center">
            <select
              value={pagination.per_page}
              onChange={handlePerPageChange}
              className="appearance-none bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200 hover:border-black rounded-[8px] pl-3 pr-8 py-1.5 text-xs font-bold transition-all shadow-2xs cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-black"
            >
              {perPageOptions.map((opt) => (
                <option key={opt} value={opt} className="bg-white text-gray-900 font-medium">
                  {opt} items
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 pointer-events-none" />
          </div>
        </div>

        <span className="text-gray-300">|</span>

        <span>
          Showing <strong className="font-bold text-gray-900">{pagination.from || 0}</strong>–
          <strong className="font-bold text-gray-900">{pagination.to || 0}</strong> of{' '}
          <strong className="font-bold text-gray-900">{pagination.total}</strong>
        </span>
      </div>

      {/* Right: Page Navigation Links */}
      {pagination.last_page > 1 && (
        <div className="flex items-center gap-1">
          {/* Previous Button */}
          {pagination.prev_page_url ? (
            <Link
              href={pagination.prev_page_url}
              preserveScroll
              preserveState
              className="p-1.5 rounded-[8px] border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-black transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
          ) : (
            <span className="p-1.5 rounded-[8px] border border-gray-100 text-gray-300 cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
            </span>
          )}

          {/* Numbered Page Links */}
          {pagination.links &&
            pagination.links
              .filter((l) => !l.label.includes('&laquo;') && !l.label.includes('&raquo;'))
              .map((link, idx) => {
                if (!link.url) {
                  return (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs text-gray-400 select-none font-medium"
                    >
                      {link.label}
                    </span>
                  );
                }

                return (
                  <Link
                    key={idx}
                    href={link.url}
                    preserveScroll
                    preserveState
                    className={`px-3 py-1 rounded-[8px] text-xs font-bold transition-all ${
                      link.active
                        ? 'bg-black text-white shadow-2xs'
                        : 'text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-200'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

          {/* Next Button */}
          {pagination.next_page_url ? (
            <Link
              href={pagination.next_page_url}
              preserveScroll
              preserveState
              className="p-1.5 rounded-[8px] border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-black transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="p-1.5 rounded-[8px] border border-gray-100 text-gray-300 cursor-not-allowed">
              <ChevronRight className="w-4 h-4" />
            </span>
          )}
        </div>
      )}
    </div>
  );
};
