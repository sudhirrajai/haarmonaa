import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Search, Users, Mail, Phone, MapPin, ShoppingBag } from 'lucide-react';

interface CustomerItem {
  id: number;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  total_orders: number;
  total_spent: number;
  avatar?: string;
}

interface CustomersProps {
  customers: CustomerItem[];
  filters: {
    search: string;
  };
}

export default function Index({ customers = [], filters }: CustomersProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get('/admin/customers', { search: searchTerm }, { preserveState: true });
  };

  return (
    <AdminLayout title="Customers Directory">
      <Head title="Customers Directory — Admin Haarmonaa" />

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Customer Directory
        </h1>
        <p className="text-xs sm:text-[13px] text-gray-500 mt-1">
          Registered boutique clients, order histories, and lifetime expenditures.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-3xl border border-gray-200/80 shadow-2xs">
        <form onSubmit={handleSearch} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by client name, email, or city..."
            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-9 pr-4 text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-black focus:bg-white"
          />
        </form>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-500 font-bold border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-5">Customer Name</th>
                <th className="py-3.5 px-5">Contact Details</th>
                <th className="py-3.5 px-5">Location</th>
                <th className="py-3.5 px-5">Total Orders</th>
                <th className="py-3.5 px-5">Lifetime Spent</th>
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
                        <span className="font-bold text-gray-900">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="space-y-0.5">
                        <span className="block text-gray-800">{c.email}</span>
                        {c.phone && <span className="block text-[11px] text-gray-400">{c.phone}</span>}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-gray-600">
                      {c.city || 'India'}
                    </td>
                    <td className="py-4 px-5 font-bold text-gray-900">
                      {c.total_orders} order(s)
                    </td>
                    <td className="py-4 px-5 font-extrabold text-gray-900 text-sm">
                      ₹{c.total_spent}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    No customers found matching search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
