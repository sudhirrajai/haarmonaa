import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import {
  Search,
  Users,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Edit2,
  Trash2,
  RotateCcw,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Archive,
  UserCheck,
  ShieldAlert,
} from 'lucide-react';

interface CustomerItem {
  id: number;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  address?: string;
  status?: string;
  notes?: string;
  total_orders: number;
  total_spent: number;
  avatar?: string;
  deleted_at?: string | null;
  created_at?: string;
}

interface CustomersProps {
  customers: CustomerItem[];
  activeCount: number;
  archivedCount: number;
  filters: {
    search: string;
    status: string;
  };
}

export default function Index({
  customers = [],
  activeCount = 0,
  archivedCount = 0,
  filters,
}: CustomersProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [currentTab, setCurrentTab] = useState<'active' | 'archived'>(
    (filters.status as any) === 'archived' ? 'archived' : 'active'
  );

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    postal_code: '',
    address: '',
    status: 'active',
    notes: '',
  });
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Delete Confirm Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<CustomerItem | null>(null);
  const [isPermanentDelete, setIsPermanentDelete] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(
      '/admin/customers',
      { search: searchTerm, status: currentTab },
      { preserveState: true }
    );
  };

  const handleTabChange = (tab: 'active' | 'archived') => {
    setCurrentTab(tab);
    router.get(
      '/admin/customers',
      { search: searchTerm, status: tab },
      { preserveState: true }
    );
  };

  const openCreateModal = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      city: '',
      state: '',
      postal_code: '',
      address: '',
      status: 'active',
      notes: '',
    });
    setErrorMsg(null);
    setModalOpen(true);
  };

  const openEditModal = (c: CustomerItem) => {
    setEditingCustomer(c);
    setFormData({
      name: c.name || '',
      email: c.email || '',
      phone: c.phone || '',
      city: c.city || '',
      state: c.state || '',
      postal_code: c.postal_code || '',
      address: c.address || '',
      status: c.status || 'active',
      notes: c.notes || '',
    });
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setErrorMsg(null);

    if (editingCustomer) {
      router.put(`/admin/customers/${editingCustomer.id}`, formData, {
        onSuccess: () => {
          setModalOpen(false);
          setProcessing(false);
        },
        onError: (errs) => {
          setProcessing(false);
          setErrorMsg(Object.values(errs)[0] as string);
        },
      });
    } else {
      router.post('/admin/customers', formData, {
        onSuccess: () => {
          setModalOpen(false);
          setProcessing(false);
        },
        onError: (errs) => {
          setProcessing(false);
          setErrorMsg(Object.values(errs)[0] as string);
        },
      });
    }
  };

  const handleSoftDelete = (customer: CustomerItem) => {
    setCustomerToDelete(customer);
    setIsPermanentDelete(false);
    setDeleteModalOpen(true);
  };

  const handlePermanentDeletePrompt = (customer: CustomerItem) => {
    setCustomerToDelete(customer);
    setIsPermanentDelete(true);
    setDeleteModalOpen(true);
  };

  const confirmDeleteAction = () => {
    if (!customerToDelete) return;
    setProcessing(true);

    if (isPermanentDelete) {
      router.delete(`/admin/customers/${customerToDelete.id}/force-delete`, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setCustomerToDelete(null);
          setProcessing(false);
        },
        onError: () => setProcessing(false),
      });
    } else {
      router.delete(`/admin/customers/${customerToDelete.id}`, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setCustomerToDelete(null);
          setProcessing(false);
        },
        onError: () => setProcessing(false),
      });
    }
  };

  const handleRestore = (id: number) => {
    router.post(`/admin/customers/${id}/restore`, {}, {
      preserveState: true,
    });
  };

  return (
    <AdminLayout title="Customers Directory">
      <Head title="Customers Directory — Admin Haarmonaa" />

      {/* Header with Title & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Customer Directory
          </h1>
          <p className="text-xs sm:text-[13px] text-gray-500 mt-1">
            Manage registered clients, profiles, order expenditures, and archive history.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111111] hover:bg-[#d0473e] text-white text-xs font-bold uppercase tracking-wider rounded-[10px] transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 bg-gray-100/80 p-1.5 rounded-[10px] border border-gray-200/80 w-fit">
          <button
            onClick={() => handleTabChange('active')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-[8px] text-xs font-bold transition-all cursor-pointer ${
              currentTab === 'active'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Active Clients</span>
            <span className="px-2 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full">
              {activeCount}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('archived')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-[8px] text-xs font-bold transition-all cursor-pointer ${
              currentTab === 'archived'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Archive className="w-3.5 h-3.5 text-amber-600" />
            <span>Archived / Soft Deleted</span>
            <span className="px-2 py-0.2 bg-amber-100 text-amber-800 text-[10px] font-extrabold rounded-full">
              {archivedCount}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-2 sm:p-3 rounded-[10px] border border-gray-200/80 shadow-2xs">
          <form onSubmit={handleSearch} className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by client name, email, or city..."
              className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2 pl-9 pr-4 text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-black focus:bg-white"
            />
          </form>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-[10px] border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-500 font-bold border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-5">Client Name</th>
                <th className="py-3.5 px-5">Contact Details</th>
                <th className="py-3.5 px-5">Location</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Orders</th>
                <th className="py-3.5 px-5">Lifetime Spent</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {customers.length > 0 ? (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#111111] text-amber-300 font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                          {c.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 block">{c.name}</span>
                          {c.notes && (
                            <span className="text-[10px] text-gray-400 truncate max-w-[150px] block">
                              {c.notes}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="space-y-0.5">
                        <span className="block text-gray-800 font-medium">{c.email}</span>
                        {c.phone && <span className="block text-[11px] text-gray-500">{c.phone}</span>}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-gray-600">
                      <div>
                        <span className="block">{c.city || 'India'}</span>
                        {c.state && <span className="text-[10.5px] text-gray-400 block">{c.state}</span>}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-[6px] text-[10.5px] font-extrabold uppercase ${
                          c.status === 'vip'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : c.status === 'blocked'
                            ? 'bg-rose-100 text-rose-800'
                            : c.status === 'inactive'
                            ? 'bg-gray-100 text-gray-600'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {c.status || 'Active'}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-bold text-gray-900">
                      {c.total_orders} order(s)
                    </td>
                    <td className="py-4 px-5 font-extrabold text-gray-900 text-sm">
                      ₹{Number(c.total_spent).toFixed(2)}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {currentTab === 'active' ? (
                          <>
                            <button
                              onClick={() => openEditModal(c)}
                              className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-[8px] transition-colors cursor-pointer"
                              title="Edit Client"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleSoftDelete(c)}
                              className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-[8px] transition-colors cursor-pointer"
                              title="Archive Client (Soft Delete)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleRestore(c.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-[8px] text-[11px] transition-colors cursor-pointer"
                              title="Restore Client"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Restore</span>
                            </button>
                            <button
                              onClick={() => handlePermanentDeletePrompt(c)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-[8px] transition-colors cursor-pointer"
                              title="Permanently Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    {currentTab === 'archived'
                      ? 'No archived or soft-deleted clients found.'
                      : 'No clients found matching search.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT CUSTOMER MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setModalOpen(false)}
          />

          <div className="relative bg-white w-full max-w-lg rounded-[10px] shadow-2xl p-6 sm:p-8 z-10 space-y-5 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {editingCustomer ? 'Edit Client Profile' : 'Create Client Profile'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-900 rounded-[8px] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-[8px] text-xs font-semibold text-rose-700">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Full Name <span className="text-[#d0473e]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="E.g. Priya Sharma"
                    className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email Address <span className="text-[#d0473e]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="priya@example.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Membership Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white font-medium"
                  >
                    <option value="active">Active Client</option>
                    <option value="vip">VIP Heirloom Member</option>
                    <option value="inactive">Inactive</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Flat / House No., Landmark, Street Name"
                  className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Mumbai"
                    className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="Maharashtra"
                    className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    placeholder="400050"
                    className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Client Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Special preferences, bespoke requests, or delivery notes..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-black rounded-[8px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-6 py-2.5 bg-[#111111] hover:bg-[#d0473e] text-white text-xs font-bold uppercase tracking-wider rounded-[8px] transition-all cursor-pointer disabled:opacity-50"
                >
                  {processing ? 'Saving...' : editingCustomer ? 'Update Profile' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE / ARCHIVE CONFIRMATION MODAL */}
      {deleteModalOpen && customerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setDeleteModalOpen(false)}
          />

          <div className="relative bg-white w-full max-w-md rounded-[10px] shadow-2xl p-6 z-10 space-y-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isPermanentDelete ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-700'
                }`}
              >
                {isPermanentDelete ? (
                  <ShieldAlert className="w-5 h-5" />
                ) : (
                  <Archive className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {isPermanentDelete ? 'Permanently Delete Client?' : 'Archive Client Profile?'}
                </h3>
                <span className="text-xs text-gray-500">{customerToDelete.name}</span>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              {isPermanentDelete
                ? 'This action cannot be undone. All client information and records will be permanently removed.'
                : 'Soft deleting moves this client to the archive while securely preserving their historical orders and expenditure data. You can restore this client anytime.'}
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-black rounded-[8px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteAction}
                disabled={processing}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-[8px] text-white transition-all cursor-pointer ${
                  isPermanentDelete
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {processing
                  ? 'Processing...'
                  : isPermanentDelete
                  ? 'Permanently Delete'
                  : 'Archive (Soft Delete)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
