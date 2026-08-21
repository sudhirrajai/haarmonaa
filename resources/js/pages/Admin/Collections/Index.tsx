import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { SingleImageUploader } from '@/components/admin/SingleImageUploader';
import { Product } from '@/types/shop';
import {
  Layers,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Save,
  Check,
  Eye,
  Sparkles,
  ExternalLink,
  Tag,
  CheckCircle2,
} from 'lucide-react';

interface CollectionItem {
  id: number;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  image?: string;
  banner_image?: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  products_count?: number;
  products?: Array<{
    id: number;
    name: string;
    image: string;
    price: number;
    category_name: string;
  }>;
}

interface ProductOption {
  id: number;
  name: string;
  image: string;
  price: number;
  category?: string;
  category_name?: string;
}

interface CollectionsIndexProps {
  collections: CollectionItem[];
  products: ProductOption[];
  filters: {
    search?: string;
  };
}

export default function CollectionsIndex({
  collections = [],
  products = [],
  filters = {},
}: CollectionsIndexProps) {
  const [search, setSearch] = useState(filters.search || '');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<CollectionItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    tagline: '',
    description: '',
    image: '',
    banner_image: '',
    is_featured: true,
    is_active: true,
    sort_order: 0,
    product_ids: [] as number[],
  });

  const [productSearch, setProductSearch] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get('/admin/collections', { search }, { preserveState: true });
  };

  const openCreateModal = () => {
    setEditingCollection(null);
    setFormData({
      name: '',
      slug: '',
      tagline: '',
      description: '',
      image: '',
      banner_image: '',
      is_featured: true,
      is_active: true,
      sort_order: 0,
      product_ids: [],
    });
    setProductSearch('');
    setModalOpen(true);
  };

  const openEditModal = (col: CollectionItem) => {
    setEditingCollection(col);
    setFormData({
      name: col.name,
      slug: col.slug,
      tagline: col.tagline || '',
      description: col.description || '',
      image: col.image || '',
      banner_image: col.banner_image || '',
      is_featured: col.is_featured,
      is_active: col.is_active,
      sort_order: col.sort_order || 0,
      product_ids: col.products ? col.products.map((p) => p.id) : [],
    });
    setProductSearch('');
    setModalOpen(true);
  };

  const handleToggleProduct = (productId: number) => {
    setFormData((prev) => {
      const exists = prev.product_ids.includes(productId);
      return {
        ...prev,
        product_ids: exists
          ? prev.product_ids.filter((id) => id !== productId)
          : [...prev.product_ids, productId],
      };
    });
  };

  const handleSelectAllFiltered = (filteredIds: number[]) => {
    setFormData((prev) => {
      const allSelected = filteredIds.every((id) => prev.product_ids.includes(id));
      if (allSelected) {
        return {
          ...prev,
          product_ids: prev.product_ids.filter((id) => !filteredIds.includes(id)),
        };
      } else {
        const set = new Set([...prev.product_ids, ...filteredIds]);
        return {
          ...prev,
          product_ids: Array.from(set),
        };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    if (editingCollection) {
      router.put(`/admin/collections/${editingCollection.id}`, formData as any, {
        onSuccess: () => {
          setProcessing(false);
          setModalOpen(false);
        },
        onError: () => setProcessing(false),
      });
    } else {
      router.post('/admin/collections', formData as any, {
        onSuccess: () => {
          setProcessing(false);
          setModalOpen(false);
        },
        onError: () => setProcessing(false),
      });
    }
  };

  const [collectionToDelete, setCollectionToDelete] = useState<{ id: number; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = (id: number, name: string) => {
    setCollectionToDelete({ id, name });
  };

  const confirmDelete = () => {
    if (!collectionToDelete) return;
    setDeleting(true);
    router.delete(`/admin/collections/${collectionToDelete.id}`, {
      onFinish: () => {
        setDeleting(false);
        setCollectionToDelete(null);
      },
    });
  };

  // Filtered products for modal picker
  const filteredProducts = products.filter((p) => {
    const q = productSearch.toLowerCase();
    const catName = p.category_name || p.category || '';
    return (
      p.name.toLowerCase().includes(q) ||
      catName.toLowerCase().includes(q)
    );
  });


  return (
    <AdminLayout title="Collections Management">
      <Head title="Collections — Admin Haarmonaa" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Collections ({collections.length})
            </h1>
          </div>
          <p className="text-xs text-gray-500">
            Create custom curated collections, seasonal edits, and assign specific jewelry pieces.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-[#111111] hover:bg-[#d0473e] text-white text-xs font-bold rounded-2xl flex items-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Collection</span>
        </button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-3 max-w-md">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search collections by name or tagline..."
            className="w-full bg-white border border-gray-200 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-gray-900 focus:outline-hidden focus:border-black"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-2xl transition-colors cursor-pointer"
        >
          Filter
        </button>
      </form>

      {/* Collections Grid */}
      {collections.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/80 space-y-4">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <Layers className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900">No collections found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Create your first luxury jewelry collection and assign products to showcase on the storefront.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="px-6 py-2.5 bg-[#111111] hover:bg-[#d0473e] text-white text-xs font-bold rounded-full transition-all cursor-pointer shadow-xs"
          >
            Create Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((col) => (
            <div
              key={col.id}
              className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all"
            >
              <div>
                {/* Banner / Image Header */}
                <div className="relative aspect-16/9 bg-gray-100 overflow-hidden">
                  <img
                    src={col.banner_image || col.image || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800'}
                    alt={col.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-xs text-gray-900 text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-xs">
                      {col.products_count ?? col.products?.length ?? 0} Products
                    </span>

                    <div className="flex items-center gap-1.5">
                      {col.is_featured && (
                        <span className="px-2 py-0.5 bg-amber-400 text-black text-[10px] font-extrabold rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Featured</span>
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                          col.is_active
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-400 text-white'
                        }`}
                      >
                        {col.is_active ? 'Active' : 'Draft'}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Heading */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    {col.tagline && (
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 block mb-0.5">
                        {col.tagline}
                      </span>
                    )}
                    <h3 className="text-lg font-extrabold tracking-tight text-white leading-tight">
                      {col.name}
                    </h3>
                  </div>
                </div>

                {/* Description & Attached Products Thumbnails */}
                <div className="p-5 space-y-4">
                  {col.description && (
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {col.description}
                    </p>
                  )}

                  {/* Attached Products Preview Avatars */}
                  {col.products && col.products.length > 0 && (
                    <div className="space-y-1.5 pt-1 border-t border-gray-100">
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        Assigned Jewelry Items:
                      </span>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {col.products.slice(0, 5).map((p) => (
                          <div
                            key={p.id}
                            className="w-10 h-10 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 shrink-0"
                            title={p.name}
                          >
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {col.products.length > 5 && (
                          <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-[11px] font-extrabold text-gray-700 shrink-0">
                            +{col.products.length - 5}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 py-3.5 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-gray-400">
                  /{col.slug}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(col)}
                    className="p-2 text-gray-600 hover:text-black hover:bg-white rounded-xl transition-all shadow-2xs cursor-pointer"
                    title="Edit Collection"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(col.id, col.name)}
                    className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                    title="Delete Collection"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT COLLECTION MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-gray-900" />
                <h2 className="text-base font-extrabold text-gray-900">
                  {editingCollection ? `Edit Collection: ${editingCollection.name}` : 'Create New Collection'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Collection Name <span className="text-[#d0473e]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Summer Solstice Capsule"
                    className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Slug (Auto-generated if blank)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. summer-solstice-capsule"
                    className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Tagline / Subheading
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="e.g. LIMITED EDITION 2026"
                    className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                  />
                </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SingleImageUploader
                  label="Thumbnail Cover Image"
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  placeholder="Upload file from system or paste URL..."
                />
                <SingleImageUploader
                  label="Banner / Showcase Image"
                  value={formData.banner_image}
                  onChange={(url) => setFormData({ ...formData, banner_image: url })}
                  placeholder="Upload file from system or paste URL..."
                />
              </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the aesthetic and inspiration behind this collection..."
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-6 pt-2 pb-2 border-y border-gray-100">
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-black focus:ring-black rounded-sm cursor-pointer"
                  />
                  <span>Active & Published</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 text-black focus:ring-black rounded-sm cursor-pointer"
                  />
                  <span>Featured Collection (Display on Homepage)</span>
                </label>
              </div>

              {/* Multi-Product Selector Section */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900">
                      Assign Jewelry Products ({formData.product_ids.length} selected)
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Check the products you wish to include in this collection.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectAllFiltered(filteredProducts.map((p) => p.id))}
                    className="text-xs font-bold text-[#d0473e] hover:underline cursor-pointer"
                  >
                    Select / Deselect Filtered ({filteredProducts.length})
                  </button>
                </div>

                {/* Product Search Filter */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Quick filter products by name or category..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-3 text-xs text-gray-900 focus:outline-hidden focus:bg-white focus:border-black"
                  />
                </div>

                {/* Products Multi-Select Scroll Area */}
                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-2xl p-2 divide-y divide-gray-100 bg-gray-50/50">
                  {filteredProducts.length === 0 ? (
                    <div className="p-4 text-center text-xs text-gray-500">
                      No products match your search.
                    </div>
                  ) : (
                    filteredProducts.map((prod) => {
                      const isSelected = formData.product_ids.includes(prod.id);
                      return (
                        <div
                          key={prod.id}
                          onClick={() => handleToggleProduct(prod.id)}
                          className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-amber-50/80 border border-amber-200/60'
                              : 'hover:bg-gray-100/80'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}} // Handled by parent div
                              className="w-4 h-4 text-black focus:ring-black rounded-sm pointer-events-none"
                            />
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border border-gray-200 shrink-0">
                              <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-gray-900">{prod.name}</div>
                              <div className="text-[11px] text-gray-500">
                                {prod.category_name || prod.category || 'Jewelry'} • ₹{prod.price}
                              </div>

                            </div>
                          </div>

                          {isSelected && (
                            <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                              Selected
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-300 hover:bg-gray-100 text-gray-800 text-xs font-bold rounded-full transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={processing}
                  className="px-6 py-2.5 bg-[#111111] hover:bg-[#d0473e] text-white text-xs font-bold rounded-full flex items-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{processing ? 'Saving...' : editingCollection ? 'Update Collection' : 'Create Collection'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!collectionToDelete}
        onClose={() => setCollectionToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Jewelry Collection?"
        itemName={collectionToDelete?.name}
        message={`Are you sure you want to delete the collection "${collectionToDelete?.name}"? Assigned products will remain intact in your inventory, but this curated collection and its banner will be removed.`}
        confirmLabel="Delete Collection"
        processing={deleting}
      />
    </AdminLayout>
  );
}
