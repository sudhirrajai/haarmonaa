import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Plus, Search, Filter, Edit2, Trash2, Eye, Gem, Check, X, ArrowUpDown } from 'lucide-react';

interface ProductItem {
  id: number;
  name: string;
  slug: string;
  category_name: string;
  price: number;
  original_price?: number;
  discount_percent?: number;
  image: string;
  rating: number;
  stock_quantity: number;
  in_stock: boolean;
  is_featured: boolean;
  is_best_seller: boolean;
}

interface CategoryItem {
  id: number;
  name: string;
  slug: string;
}

interface ProductsIndexProps {
  products: ProductItem[];
  categories: CategoryItem[];
  filters: {
    search: string;
    category: string;
  };
}

export default function Index({ products = [], categories = [], filters }: ProductsIndexProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedCat, setSelectedCat] = useState(filters.category || 'all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(
      '/admin/products',
      { search: searchTerm, category: selectedCat },
      { preserveState: true, replace: true }
    );
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCat(cat);
    router.get(
      '/admin/products',
      { search: searchTerm, category: cat },
      { preserveState: true, replace: true }
    );
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      router.delete(`/admin/products/${id}`);
    }
  };

  return (
    <AdminLayout title="Products Management">
      <Head title="Products Catalog — Admin Haarmonaa" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Products Catalog
          </h1>
          <p className="text-xs sm:text-[13px] text-gray-500 mt-1">
            Manage your fine jewelry products, stock inventory, and pricing.
          </p>
        </div>

        <Link
          href="/admin/products/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111111] hover:bg-[#d0473e] text-white rounded-full text-xs font-bold transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Jewelry</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-gray-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search jewelry name or category..."
            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-9 pr-4 text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-black focus:bg-white"
          />
        </form>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedCat === 'all'
                ? 'bg-[#111111] text-white shadow-2xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Items
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => handleCategoryChange(c.name)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedCat === c.name
                  ? 'bg-[#111111] text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-500 font-bold border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-5">Jewelry Item</th>
                <th className="py-3.5 px-5">Category</th>
                <th className="py-3.5 px-5">Price</th>
                <th className="py-3.5 px-5">Stock</th>
                <th className="py-3.5 px-5">Badges</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {products.length > 0 ? (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover bg-gray-100 flex-shrink-0 border border-gray-100"
                        />
                        <div className="min-w-0">
                          <span className="block font-bold text-gray-900 truncate max-w-xs">{p.name}</span>
                          <span className="text-[11px] text-gray-400">★ {p.rating} (5.0)</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-md text-[11px] font-bold">
                        {p.category_name}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-extrabold text-gray-900 text-sm">₹{p.price}</span>
                        {p.original_price && (
                          <span className="text-gray-400 line-through text-[11px]">₹{p.original_price}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      {p.in_stock && p.stock_quantity > 0 ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {p.stock_quantity} in stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Out of stock
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-1.5">
                        {p.is_featured && (
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-extrabold rounded-full uppercase border border-amber-200">
                            Featured
                          </span>
                        )}
                        {p.is_best_seller && (
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-extrabold rounded-full uppercase border border-purple-200">
                            Best Seller
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/product/${p.slug}`}
                          target="_blank"
                          className="p-1.5 text-gray-400 hover:text-black rounded-lg hover:bg-gray-100 transition-colors"
                          title="Preview Product"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="p-1.5 text-gray-400 hover:text-black rounded-lg hover:bg-gray-100 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 text-gray-400 hover:text-[#d0473e] rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Product"
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
                    No products found matching your search.
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
