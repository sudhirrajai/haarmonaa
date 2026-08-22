import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { AdminPagination, PaginationData } from '@/components/admin/AdminPagination';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  Gem,
  Check,
  X,
  ArrowUpDown,
  Star,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
  Globe,
  FileText,
  Loader2,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { ProductImportModal } from '@/components/admin/ProductImportModal';

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
  status: 'published' | 'draft';
}

interface CategoryItem {
  id: number;
  name: string;
  slug: string;
}

interface ProductsIndexProps {
  products: PaginationData<ProductItem> | ProductItem[];
  categories: CategoryItem[];
  statusCounts?: {
    all: number;
    published: number;
    draft: number;
  };
  filters: {
    search: string;
    category: string;
    status?: string;
    per_page?: number;
  };
}

export default function Index({
  products,
  categories = [],
  statusCounts = { all: 0, published: 0, draft: 0 },
  filters,
}: ProductsIndexProps) {
  // Normalize pagination vs raw array
  const isPaginated = !Array.isArray(products) && 'data' in products;
  const productList: ProductItem[] = isPaginated ? (products as PaginationData<ProductItem>).data : (products as ProductItem[]);
  const paginationData = isPaginated ? (products as PaginationData<ProductItem>) : null;

  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedCat, setSelectedCat] = useState(filters.category || 'all');
  const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  // Local state for instant toggle updates
  const [items, setItems] = useState<ProductItem[]>(productList);

  useEffect(() => {
    setItems(productList);
  }, [productList]);

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

  const applyFilters = (newParams: Record<string, any>) => {
    router.get(
      '/admin/products',
      {
        search: searchTerm,
        category: selectedCat,
        status: selectedStatus,
        per_page: filters.per_page || 10,
        ...newParams,
      },
      { preserveState: true, replace: true }
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ search: searchTerm });
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCat(cat);
    applyFilters({ category: cat });
  };

  const handleStatusChange = (st: string) => {
    setSelectedStatus(st);
    applyFilters({ status: st });
  };

  // Selection handlers
  const handleSelectAllOnPage = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((i) => i.id));
    }
  };

  const handleToggleSelectRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Bulk Actions
  const handleBulkAction = (action: 'publish' | 'draft' | 'delete') => {
    if (selectedIds.length === 0) return;

    if (action === 'delete') {
      setShowBulkDeleteModal(true);
      return;
    }

    setBulkProcessing(true);
    router.post(
      '/admin/products/bulk-action',
      {
        action,
        product_ids: selectedIds,
      },
      {
        onFinish: () => {
          setBulkProcessing(false);
          setSelectedIds([]);
        },
      }
    );
  };

  const confirmBulkDelete = () => {
    setBulkProcessing(true);
    router.post(
      '/admin/products/bulk-action',
      {
        action: 'delete',
        product_ids: selectedIds,
      },
      {
        onFinish: () => {
          setBulkProcessing(false);
          setShowBulkDeleteModal(false);
          setSelectedIds([]);
        },
      }
    );
  };

  // Toggle Featured & Status fast async
  const handleToggleFeatured = async (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_featured: !item.is_featured } : item
      )
    );

    try {
      const csrfToken =
        document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      await fetch(`/admin/products/${id}/toggle-featured`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrfToken,
        },
      });
    } catch {
      // Revert on error
      setItems(productList);
    }
  };

  const handleToggleStatus = async (id: number) => {
    const target = items.find((i) => i.id === id);
    if (!target) return;
    const newStatus = target.status === 'draft' ? 'published' : 'draft';

    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );

    try {
      const csrfToken =
        document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      await fetch(`/admin/products/${id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrfToken,
        },
      });
    } catch {
      setItems(productList);
    }
  };

  // Single Delete
  const [productToDelete, setProductToDelete] = useState<{ id: number; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);

  const confirmSingleDelete = () => {
    if (!productToDelete) return;
    setDeleting(true);
    router.delete(`/admin/products/${productToDelete.id}`, {
      onFinish: () => {
        setDeleting(false);
        setProductToDelete(null);
      },
    });
  };

  return (
    <AdminLayout title="Products Management">
      <Head title="Products Catalog — Admin Haarmonaa" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Products Catalog
          </h1>
          <p className="text-xs sm:text-[13px] text-gray-500 mt-1">
            Manage your fine jewelry products, stock inventory, and featured landing page items.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Export CSV Button */}
          <a
            href="/admin/products/export"
            download="haarmonaa-products-export.csv"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-full text-xs font-bold transition-all shadow-2xs cursor-pointer"
            title="Export all products to CSV"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Export CSV</span>
          </a>

          {/* Import CSV Button */}
          <button
            type="button"
            onClick={() => setImportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold transition-all shadow-2xs cursor-pointer"
            title="Import products from CSV spreadsheet"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Import CSV</span>
          </button>

          {/* Add New Product Button */}
          <Link
            href="/admin/products/create"
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#111111] hover:bg-[#d0473e] text-white rounded-full text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Jewelry</span>
          </Link>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-4 pt-2 rounded-t-[10px] border-x border-t border-gray-200/80">
        <button
          type="button"
          onClick={() => handleStatusChange('all')}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            selectedStatus === 'all'
              ? 'border-black text-black'
              : 'border-transparent text-gray-400 hover:text-black'
          }`}
        >
          All Items ({statusCounts.all})
        </button>

        <button
          type="button"
          onClick={() => handleStatusChange('published')}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
            selectedStatus === 'published'
              ? 'border-black text-black'
              : 'border-transparent text-gray-400 hover:text-black'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Published / Live ({statusCounts.published})</span>
        </button>

        <button
          type="button"
          onClick={() => handleStatusChange('draft')}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
            selectedStatus === 'draft'
              ? 'border-black text-black'
              : 'border-transparent text-gray-400 hover:text-black'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-gray-400" />
          <span>Drafts ({statusCounts.draft})</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 border-x border-b border-gray-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
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
              All Categories
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

      {/* Floating / Sticky Bulk Action Toolbar */}
      {selectedIds.length > 0 && (
        <div className="p-3.5 bg-black text-white rounded-[10px] shadow-lg flex flex-wrap items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-amber-400 text-black text-xs font-extrabold flex items-center justify-center">
              {selectedIds.length}
            </span>
            <span className="text-xs font-bold">
              {selectedIds.length} jewelry {selectedIds.length === 1 ? 'item' : 'items'} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={bulkProcessing}
              onClick={() => handleBulkAction('publish')}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[6px] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Set as Published (Live)</span>
            </button>

            <button
              type="button"
              disabled={bulkProcessing}
              onClick={() => handleBulkAction('draft')}
              className="px-3.5 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-[6px] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Set as Draft</span>
            </button>

            <button
              type="button"
              disabled={bulkProcessing}
              onClick={() => handleBulkAction('delete')}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-[6px] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-xs text-gray-400 hover:text-white px-2 py-1 underline font-semibold cursor-pointer"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-[10px] border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-500 font-bold border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={items.length > 0 && selectedIds.length === items.length}
                    onChange={handleSelectAllOnPage}
                    className="w-4 h-4 text-black focus:ring-black rounded-sm cursor-pointer"
                    title="Select All on this page"
                  />
                </th>
                <th className="py-3.5 px-4">Jewelry Item</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Featured</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {items.length > 0 ? (
                items.map((p) => {
                  const isSelected = selectedIds.includes(p.id);
                  const isDraft = p.status === 'draft';
                  return (
                    <tr
                      key={p.id}
                      className={`transition-colors ${
                        isSelected ? 'bg-amber-50/40' : 'hover:bg-gray-50/60'
                      }`}
                    >
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectRow(p.id)}
                          className="w-4 h-4 text-black focus:ring-black rounded-sm cursor-pointer"
                        />
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-12 h-12 rounded-[8px] object-cover bg-gray-100 flex-shrink-0 border border-gray-100"
                          />
                          <div className="min-w-0">
                            <span className="block font-bold text-gray-900 truncate max-w-xs">{p.name}</span>
                            <span className="text-[11px] text-gray-400">★ {p.rating} (5.0)</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-md text-[11px] font-bold">
                          {p.category_name}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-extrabold text-gray-900 text-sm">₹{p.price}</span>
                          {p.original_price && (
                            <span className="text-gray-400 line-through text-[11px]">₹{p.original_price}</span>
                          )}
                        </div>
                      </td>

                      {/* Status Column with 1-Click Switch */}
                      <td className="py-4 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(p.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                            isDraft
                              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
                              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                          title={`Click to switch to ${isDraft ? 'Published' : 'Draft'}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isDraft ? 'bg-gray-400' : 'bg-emerald-500'
                            }`}
                          />
                          <span>{isDraft ? 'Draft' : 'Live'}</span>
                        </button>
                      </td>

                      <td className="py-4 px-4">
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

                      <td className="py-4 px-4">
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

                      <td className="py-4 px-4 text-right">
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
                            onClick={() => setProductToDelete({ id: p.id, name: p.name })}
                            className="p-1.5 text-gray-400 hover:text-[#d0473e] rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    No products found matching your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {paginationData && <AdminPagination pagination={paginationData} />}
      </div>

      {/* Single Delete Modal */}
      <DeleteConfirmModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={confirmSingleDelete}
        title="Delete Jewelry Product?"
        itemName={productToDelete?.name}
        message={`Are you sure you want to delete "${productToDelete?.name}"? This will permanently remove its pricing, variants, and gallery assets from the boutique.`}
        confirmLabel="Delete Product"
        processing={deleting}
      />

      {/* Bulk Delete Modal */}
      <DeleteConfirmModal
        isOpen={showBulkDeleteModal}
        onClose={() => setShowBulkDeleteModal(false)}
        onConfirm={confirmBulkDelete}
        title={`Delete ${selectedIds.length} Selected Products?`}
        itemName={`${selectedIds.length} Products`}
        message={`Are you sure you want to permanently delete all ${selectedIds.length} selected products? This action cannot be undone.`}
        confirmLabel={`Delete ${selectedIds.length} Products`}
        processing={bulkProcessing}
      />

      {/* CSV Product Import Modal */}
      <ProductImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
      />
    </AdminLayout>
  );
}
