import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Plus, Search, Filter, Edit2, Trash2, Eye, Gem, Check, X, ArrowUpDown, Star, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [productList, setProductList] = useState<ProductItem[]>(products);

  const catScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollCatLeft, setCanScrollCatLeft] = useState(false);
  const [canScrollCatRight, setCanScrollCatRight] = useState(false);

  const checkCatScroll = useCallback(() => {
    if (catScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = catScrollRef.current;
      setCanScrollCatLeft(scrollLeft > 5);
      setCanScrollCatRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  }, []);

  useEffect(() => {
    setProductList(products);
  }, [products]);

  useEffect(() => {
    checkCatScroll();
    const el = catScrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkCatScroll, { passive: true });
    }
    window.addEventListener('resize', checkCatScroll);
    return () => {
      if (el) el.removeEventListener('scroll', checkCatScroll);
      window.removeEventListener('resize', checkCatScroll);
    };
  }, [categories, checkCatScroll]);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (catScrollRef.current) {
      const scrollAmount = direction === 'left' ? -180 : 180;
      catScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

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

  const handleToggleFeatured = async (id: number) => {
    // 1. Instantly update local state (0ms delay UI feedback)
    setProductList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_featured: !item.is_featured } : item
      )
    );

    // 2. Perform fast non-blocking background API call
    try {
      const csrfToken =
        document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      const response = await fetch(`/admin/products/${id}/toggle-featured`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrfToken,
        },
      });

      if (!response.ok) {
        // Revert local state if server returned an error
        setProductList((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, is_featured: !item.is_featured } : item
          )
        );
      }
    } catch (error) {
      // Revert local state on network error
      setProductList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_featured: !item.is_featured } : item
        )
      );
    }
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
            Manage your fine jewelry products, stock inventory, and featured landing page items.
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

        {/* Category Pills with Smooth Scroller & Arrow Controls */}
        <div className="relative flex items-center min-w-0 w-full sm:w-auto max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
          {canScrollCatLeft && (
            <button
              type="button"
              onClick={() => scrollCategories('left')}
              className="absolute left-0 z-10 p-1 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-md border border-gray-200 backdrop-blur-xs transition-all cursor-pointer -ml-2"
              title="Scroll Left"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}

          <div
            ref={catScrollRef}
            className="flex items-center gap-1.5 overflow-x-auto scroll-smooth py-1 px-1 w-full"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
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
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  selectedCat === c.name
                    ? 'bg-[#111111] text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {canScrollCatRight && (
            <button
              type="button"
              onClick={() => scrollCategories('right')}
              className="absolute right-0 z-10 p-1 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-md border border-gray-200 backdrop-blur-xs transition-all cursor-pointer -mr-2"
              title="Scroll Right"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
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
                <th className="py-3.5 px-5">Featured</th>
                <th className="py-3.5 px-5">Badges</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {productList.length > 0 ? (
                productList.map((p) => (
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
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(p.id)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                            p.is_featured ? 'bg-amber-500 shadow-xs' : 'bg-gray-200'
                          }`}
                          title={p.is_featured ? 'Remove from Featured Collection' : 'Feature on Landing Page'}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                              p.is_featured ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          >
                            {p.is_featured && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                          </span>
                        </button>
                        <span
                          className={`text-[11px] font-bold ${
                            p.is_featured ? 'text-amber-700' : 'text-gray-400'
                          }`}
                        >
                          {p.is_featured ? 'Featured' : 'Off'}
                        </span>
                      </div>
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
                  <td colSpan={7} className="py-12 text-center text-gray-400">
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
