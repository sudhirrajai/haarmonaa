import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
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
  Eye,
  Calendar,
  IndianRupee,
  Package,
  ExternalLink,
  CreditCard,
  Clock,
  Sparkles,
} from 'lucide-react';

import { AdminPagination, PaginationData } from '@/components/admin/AdminPagination';
import { AdminToggle } from '@/components/admin/AdminToggle';

interface OrderItemData {
  id: number;
  product_name: string;
  product_image?: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

interface OrderData {
  id: number;
  order_number: string;
  created_at: string;
  status: string;
  payment_method: string;
  payment_status: string;
  total_amount: number;
  subtotal: number;
  discount_amount: number;
  items?: OrderItemData[];
}

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
  block_reason?: string;
  notes?: string;
  total_orders: number;
  total_spent: number;
  avatar?: string;
  deleted_at?: string | null;
  created_at?: string;
  orders?: OrderData[];
}

interface CustomersProps {
  customers: PaginationData<CustomerItem> | CustomerItem[];
  activeCount: number;
  archivedCount: number;
  filters: {
    search: string;
    status: string;
    per_page?: number;
  };
}

export default function Index({
  customers,
  activeCount = 0,
  archivedCount = 0,
  filters,
}: CustomersProps) {
  const isPaginated = !Array.isArray(customers) && 'data' in customers;
  const customerList: CustomerItem[] = isPaginated
    ? (customers as PaginationData<CustomerItem>).data
    : (customers as CustomerItem[]);
  const paginationData = isPaginated ? (customers as PaginationData<CustomerItem>) : null;

  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [currentTab, setCurrentTab] = useState<'active' | 'archived'>(
    (filters.status as any) === 'archived' ? 'archived' : 'active'
  );

  // View Modal State
  const [viewCustomer, setViewCustomer] = useState<CustomerItem | null>(null);

  // Edit / Create Modal State
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
    block_reason: '',
    send_email: true,
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
      block_reason: '',
      send_email: true,
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
      block_reason: c.block_reason || '',
      send_email: true,
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

  const handleSoftDeletePrompt = (customer: CustomerItem) => {
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
              {customerList.length > 0 ? (
                customerList.map((c) => (
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
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-[6px] text-[10.5px] font-extrabold uppercase ${
                            c.status === 'vip'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : c.status === 'blocked'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : c.status === 'inactive'
                              ? 'bg-gray-100 text-gray-600'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {c.status === 'blocked' ? 'Blocked' : c.status || 'Active'}
                        </span>
                        {c.status === 'blocked' && c.block_reason && (
                          <span className="block text-[10px] text-rose-600 truncate max-w-[140px] italic">
                            {c.block_reason}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-5 font-bold text-gray-900">
                      {c.total_orders} order(s)
                    </td>
                    <td className="py-4 px-5 font-extrabold text-gray-900 text-sm">
                      ₹{Number(c.total_spent).toFixed(2)}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Customer Button */}
                        <button
                          onClick={() => setViewCustomer(c)}
                          className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-[8px] transition-colors cursor-pointer"
                          title="View Client Details & Orders"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

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
                              onClick={() => handleSoftDeletePrompt(c)}
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

        {/* Pagination Footer */}
        {paginationData && <AdminPagination pagination={paginationData} />}
      </div>

      {/* VIEW CUSTOMER FULL DETAILS & ORDERS MODAL */}
      {viewCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setViewCustomer(null)}
          />

          <div className="relative bg-white w-full max-w-3xl rounded-[10px] shadow-2xl p-6 sm:p-8 z-10 space-y-6 animate-scale-in max-h-[90vh] overflow-y-auto border border-gray-100">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#111111] text-amber-300 font-extrabold text-lg flex items-center justify-center shadow-xs shrink-0">
                  {viewCustomer.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
                      {viewCustomer.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-[6px] text-[10.5px] font-extrabold uppercase ${
                        viewCustomer.status === 'vip'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : viewCustomer.status === 'blocked'
                          ? 'bg-rose-100 text-rose-800'
                          : viewCustomer.status === 'inactive'
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {viewCustomer.status || 'Active'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 block mt-0.5">
                    Client ID #{viewCustomer.id} • Registered Member
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewCustomer(null)}
                className="p-1.5 text-gray-400 hover:text-gray-900 rounded-[8px] hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-gray-50/80 rounded-[8px] border border-gray-200/60">
                <span className="text-[11px] font-bold text-gray-500 block uppercase">Total Orders</span>
                <span className="text-lg font-extrabold text-gray-900 mt-0.5 block">
                  {viewCustomer.total_orders}
                </span>
              </div>

              <div className="p-3.5 bg-gray-50/80 rounded-[8px] border border-gray-200/60">
                <span className="text-[11px] font-bold text-gray-500 block uppercase">Lifetime Spent</span>
                <span className="text-lg font-extrabold text-gray-900 mt-0.5 block">
                  ₹{Number(viewCustomer.total_spent).toFixed(2)}
                </span>
              </div>

              <div className="p-3.5 bg-gray-50/80 rounded-[8px] border border-gray-200/60">
                <span className="text-[11px] font-bold text-gray-500 block uppercase">Avg Order Value</span>
                <span className="text-lg font-extrabold text-gray-900 mt-0.5 block">
                  ₹{viewCustomer.total_orders > 0 ? (viewCustomer.total_spent / viewCustomer.total_orders).toFixed(2) : '0.00'}
                </span>
              </div>

              <div className="p-3.5 bg-gray-50/80 rounded-[8px] border border-gray-200/60">
                <span className="text-[11px] font-bold text-gray-500 block uppercase">Location</span>
                <span className="text-xs font-extrabold text-gray-900 mt-1 block truncate">
                  {viewCustomer.city || 'India'}
                </span>
              </div>
            </div>

            {/* Contact & Address Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-white rounded-[8px] border border-gray-200/80 space-y-2">
                <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] pb-1 border-b border-gray-100 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-gray-500" />
                  <span>Contact Information</span>
                </h4>
                <div className="space-y-1.5 text-gray-600">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email:</span>
                    <a href={`mailto:${viewCustomer.email}`} className="font-bold text-gray-900 hover:underline">
                      {viewCustomer.email}
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Phone:</span>
                    <span className="font-bold text-gray-900">{viewCustomer.phone || 'Not provided'}</span>
                  </div>
                  {viewCustomer.notes && (
                    <div className="pt-1 text-[11px] text-gray-500 italic bg-amber-50/60 p-2 rounded-[6px] border border-amber-200/60">
                      Note: {viewCustomer.notes}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-white rounded-[8px] border border-gray-200/80 space-y-2">
                <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] pb-1 border-b border-gray-100 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-500" />
                  <span>Shipping Address</span>
                </h4>
                <div className="text-gray-600 space-y-1">
                  <p className="font-bold text-gray-900">{viewCustomer.address || 'No street address on file'}</p>
                  <p>{[viewCustomer.city, viewCustomer.state, viewCustomer.postal_code].filter(Boolean).join(', ') || 'India'}</p>
                </div>
              </div>
            </div>

            {/* Orders History Table */}
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Package className="w-4 h-4 text-[#d0473e]" />
                <span>Client Orders History ({viewCustomer.orders?.length || 0})</span>
              </h4>

              {viewCustomer.orders && viewCustomer.orders.length > 0 ? (
                <div className="border border-gray-200/80 rounded-[8px] overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50/80 text-gray-500 font-bold border-b border-gray-100">
                      <tr>
                        <th className="py-2.5 px-4">Order #</th>
                        <th className="py-2.5 px-4">Date</th>
                        <th className="py-2.5 px-4">Items</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4">Payment</th>
                        <th className="py-2.5 px-4 text-right">Total Amount</th>
                        <th className="py-2.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {viewCustomer.orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-gray-50/50">
                          <td className="py-3 px-4 font-mono font-bold text-gray-900">
                            {ord.order_number}
                          </td>
                          <td className="py-3 px-4 text-gray-500">
                            {new Date(ord.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5 max-w-[200px] overflow-hidden">
                              {ord.items && ord.items.length > 0 ? (
                                ord.items.slice(0, 3).map((it, idx) => (
                                  <div
                                    key={idx}
                                    className="w-7 h-7 rounded-[4px] bg-gray-50 border border-gray-200 overflow-hidden shrink-0"
                                    title={`${it.quantity}x ${it.product_name}`}
                                  >
                                    {it.product_image ? (
                                      <img src={it.product_image} alt={it.product_name} className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="text-[9px] flex items-center justify-center h-full text-gray-400">💍</span>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <span className="text-gray-400 text-[11px]">—</span>
                              )}
                              {ord.items && ord.items.length > 3 && (
                                <span className="text-[10px] text-gray-500 font-bold">+{ord.items.length - 3}</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-extrabold uppercase ${
                                ord.status === 'delivered'
                                  ? 'bg-emerald-50 text-emerald-800'
                                  : ord.status === 'processing'
                                  ? 'bg-blue-50 text-blue-800'
                                  : ord.status === 'cancelled'
                                  ? 'bg-rose-50 text-rose-800'
                                  : 'bg-amber-50 text-amber-800'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600 font-mono text-[11px]">
                            {ord.payment_method}
                          </td>
                          <td className="py-3 px-4 text-right font-extrabold text-gray-900">
                            ₹{Number(ord.total_amount).toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Link
                              href={`/admin/orders/${ord.id}`}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-600 hover:text-black hover:underline"
                            >
                              <span>View</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 bg-gray-50/70 border border-gray-200/60 rounded-[8px] text-center text-gray-400 text-xs">
                  No previous orders placed by this customer yet.
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setViewCustomer(null)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-[8px] transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = viewCustomer;
                  setViewCustomer(null);
                  openEditModal(target);
                }}
                className="px-5 py-2.5 bg-[#111111] hover:bg-[#d0473e] text-white text-xs font-bold uppercase tracking-wider rounded-[8px] transition-all cursor-pointer"
              >
                Edit Client Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT CUSTOMER MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setModalOpen(false)}
          />

          <div className="relative bg-white w-full max-w-lg rounded-[10px] shadow-2xl p-6 sm:p-8 z-10 space-y-5 animate-scale-in max-h-[90vh] overflow-y-auto border border-gray-100">
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
                    className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white font-bold"
                  >
                    <option value="active">Active Client</option>
                    <option value="inactive">Inactive</option>
                    <option value="vip">VIP Heirloom Member</option>
                    <option value="blocked">Blocked (Suspended)</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Block / Suspension Reason Card */}
              {formData.status === 'blocked' && (
                <div className="p-4 bg-rose-50/80 border border-rose-200 rounded-[10px] space-y-3 animate-fade-in">
                  <div className="flex items-start gap-2 text-rose-800">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold">Account Suspension Details</h4>
                      <p className="text-[11px] text-rose-600 leading-snug">
                        Specify the reason for blocking this customer. You can optionally send an automated explanation email.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-rose-900 mb-1">
                      Reason for Blocking (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.block_reason}
                      onChange={(e) => setFormData({ ...formData, block_reason: e.target.value })}
                      placeholder="e.g. Fraudulent chargeback history, suspicious checkout activity, or policy violation..."
                      className="w-full bg-white border border-rose-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-rose-600"
                    />
                  </div>

                  <div className="p-3 bg-white/90 border border-rose-200 rounded-[8px]">
                    <AdminToggle
                      label="Send Suspension Notice Email to Client"
                      description={`Sends an email notice to ${formData.email || 'customer'} containing the reason above and support concierge contact.`}
                      checked={formData.send_email}
                      onChange={(val) => setFormData({ ...formData, send_email: val })}
                      activeColor="bg-rose-600"
                    />
                  </div>
                </div>
              )}

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

      {/* REUSABLE DELETE CONFIRM MODAL */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteAction}
        title={isPermanentDelete ? 'Permanently Delete Client?' : 'Archive Client Profile?'}
        itemName={customerToDelete?.name}
        message={
          isPermanentDelete
            ? 'This action cannot be undone. All client information and records will be permanently removed.'
            : 'Soft deleting moves this client to the archive while securely preserving their historical orders and expenditure data. You can restore this client anytime.'
        }
        confirmLabel={isPermanentDelete ? 'Permanently Delete' : 'Archive (Soft Delete)'}
        variant={isPermanentDelete ? 'danger' : 'warning'}
        processing={processing}
      />
    </AdminLayout>
  );
}
