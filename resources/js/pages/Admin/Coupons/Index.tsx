import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { Plus, Search, Tag, Edit2, Trash2, CheckCircle2, XCircle, Clock, Percent, IndianRupee, Layers } from 'lucide-react';

interface CouponItem {
  id: number;
  code: string;
  description?: string;
  type: 'fixed' | 'percent';
  value: number;
  min_spend?: number;
  max_discount?: number;
  usage_limit?: number;
  usage_limit_per_user?: number;
  usage_count: number;
  start_date?: string;
  expires_at?: string;
  is_active: boolean;
  allow_stacking?: boolean;
}

interface CouponsIndexProps {
  coupons: CouponItem[];
  filters: {
    search: string;
  };
}

export default function Index({ coupons = [], filters }: CouponsIndexProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [couponList, setCouponList] = useState<CouponItem[]>(coupons);

  useEffect(() => {
    setCouponList(coupons);
  }, [coupons]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(
      '/admin/coupons',
      { search: searchTerm },
      { preserveState: true, replace: true }
    );
  };

  const handleToggleActive = async (id: number) => {
    // Optimistic UI toggle
    setCouponList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_active: !item.is_active } : item
      )
    );

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      const response = await fetch(`/admin/coupons/${id}/toggle-active`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrfToken,
        },
      });

      if (!response.ok) {
        // Revert on error
        setCouponList((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, is_active: !item.is_active } : item
          )
        );
      }
    } catch {
      // Revert on error
      setCouponList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_active: !item.is_active } : item
        )
      );
    }
  };

  const [couponToDelete, setCouponToDelete] = useState<{ id: number; code: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = (id: number, code: string) => {
    setCouponToDelete({ id, code });
  };

  const confirmDelete = () => {
    if (!couponToDelete) return;
    setDeleting(true);
    router.delete(`/admin/coupons/${couponToDelete.id}`, {
      onFinish: () => {
        setDeleting(false);
        setCouponToDelete(null);
      },
    });
  };

  const getStatusBadge = (c: CouponItem) => {
    if (!c.is_active) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-[11px] font-bold">
          <XCircle className="w-3 h-3 text-gray-400" />
          Inactive
        </span>
      );
    }

    const now = new Date();
    if (c.expires_at && new Date(c.expires_at) < now) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 rounded-full text-[11px] font-bold border border-rose-200">
          <Clock className="w-3 h-3 text-rose-500" />
          Expired
        </span>
      );
    }

    if (c.start_date && new Date(c.start_date) > now) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-[11px] font-bold border border-amber-200">
          <Clock className="w-3 h-3 text-amber-500" />
          Scheduled
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-bold border border-emerald-200">
        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
        Active
      </span>
    );
  };

  return (
    <AdminLayout title="Coupons & Discounts">
      <Head title="Coupons & Promo Codes — Admin Haarmonaa" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Coupons & Promo Codes
          </h1>
          <p className="text-xs sm:text-[13px] text-gray-500 mt-1">
            Create and manage promo discount codes, spend thresholds, usage limits, and product restrictions.
          </p>
        </div>

        <Link
          href="/admin/coupons/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111111] hover:bg-[#d0473e] text-white rounded-full text-xs font-bold transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-gray-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search coupon code or description..."
            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-9 pr-4 text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-black focus:bg-white"
          />
        </form>

        <div className="text-xs text-gray-500 font-medium">
          Showing <span className="font-bold text-gray-900">{couponList.length}</span> promo codes
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-500 font-bold border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-5">Coupon Code</th>
                <th className="py-3.5 px-5">Discount Value</th>
                <th className="py-3.5 px-5">Restrictions</th>
                <th className="py-3.5 px-5">Usage Count</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {couponList.length > 0 ? (
                couponList.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center flex-shrink-0 border border-amber-200">
                          <Tag className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-gray-900 font-mono text-sm tracking-wide">
                              {c.code}
                            </span>
                            {c.allow_stacking ? (
                              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-extrabold rounded-full border border-blue-200" title="Can be combined with other stackable coupons">
                                Stackable
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full" title="Cannot be combined with other coupons">
                                Single Use
                              </span>
                            )}
                          </div>
                          {c.description ? (
                            <span className="text-[11px] text-gray-500 line-clamp-1">{c.description}</span>
                          ) : (
                            <span className="text-[11px] text-gray-400">No description</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-900 rounded-xl font-bold">
                        {c.type === 'percent' ? (
                          <>
                            <Percent className="w-3.5 h-3.5 text-amber-600" />
                            <span>{c.value}% OFF</span>
                          </>
                        ) : (
                          <>
                            <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                            <span>₹{c.value} OFF</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-5 space-y-0.5 text-[11px]">
                      {c.min_spend ? (
                        <div className="text-gray-700 font-semibold">Min Spend: ₹{c.min_spend}</div>
                      ) : (
                        <div className="text-gray-400">No min spend</div>
                      )}
                      {c.max_discount && c.type === 'percent' && (
                        <div className="text-amber-800 font-semibold">Max Discount: ₹{c.max_discount}</div>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      <div className="space-y-1">
                        <div className="font-bold text-gray-900 text-xs">
                          {c.usage_count} {c.usage_limit ? `/ ${c.usage_limit}` : 'used'}
                        </div>
                        <span className="text-[10.5px] text-gray-400 block">
                          Limit per user: {c.usage_limit_per_user ?? 1}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(c.id)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                            c.is_active ? 'bg-emerald-500 shadow-xs' : 'bg-gray-200'
                          }`}
                          title={c.is_active ? 'Deactivate Coupon' : 'Activate Coupon'}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                              c.is_active ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        {getStatusBadge(c)}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/coupons/${c.id}/edit`}
                          className="p-1.5 text-gray-400 hover:text-black rounded-lg hover:bg-gray-100 transition-colors"
                          title="Edit Coupon"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(c.id, c.code)}
                          className="p-1.5 text-gray-400 hover:text-[#d0473e] rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    No coupons found. Click "Create New Coupon" to set up your first promo code.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!couponToDelete}
        onClose={() => setCouponToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Coupon Voucher?"
        itemName={couponToDelete?.code}
        message={`Are you sure you want to delete coupon "${couponToDelete?.code}"? Customers will no longer be able to apply or stack this promo discount at checkout.`}
        confirmLabel="Delete Coupon"
        processing={deleting}
      />
    </AdminLayout>
  );
}
