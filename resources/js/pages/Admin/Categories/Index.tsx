import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { SingleImageUploader } from '@/components/admin/SingleImageUploader';
import { Plus, Edit2, Trash2, FolderTree, X, Save } from 'lucide-react';

interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  products_count?: number;
}

interface CategoriesProps {
  categories: CategoryItem[];
}

export default function Index({ categories = [] }: CategoriesProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    image: '',
    description: '',
  });

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', image: '', description: '' });
    setModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      image: cat.image || '',
      description: cat.description || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      router.put(`/admin/categories/${editingCategory.id}`, formData, {
        onSuccess: () => setModalOpen(false),
      });
    } else {
      router.post('/admin/categories', formData, {
        onSuccess: () => setModalOpen(false),
      });
    }
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete category "${name}"?`)) {
      router.delete(`/admin/categories/${id}`);
    }
  };

  return (
    <AdminLayout title="Categories">
      <Head title="Categories — Admin Haarmonaa" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Jewelry Categories
          </h1>
          <p className="text-xs sm:text-[13px] text-gray-500 mt-1">
            Organize catalog groupings (Rings, Necklaces, Bracelets, Earrings).
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111111] hover:bg-[#d0473e] text-white rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col justify-between group"
          >
            <div className="aspect-4/3 overflow-hidden bg-gray-100 relative">
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <FolderTree className="w-10 h-10" />
                </div>
              )}
              <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-black text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-2xs">
                {cat.products_count || 0} items
              </span>
            </div>

            <div className="p-5 space-y-2">
              <h2 className="text-base font-bold text-gray-900">{cat.name}</h2>
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                {cat.description || 'No description provided.'}
              </p>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(cat)}
                  className="p-2 text-gray-500 hover:text-black rounded-lg hover:bg-gray-100 transition-colors"
                  title="Edit Category"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-2 text-gray-500 hover:text-[#d0473e] rounded-lg hover:bg-rose-50 transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 z-10 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Earrings"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                />
              </div>

              <SingleImageUploader
                label="Category Cover Image"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                placeholder="Upload file from system or paste URL..."
              />

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Category description..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-xs font-bold text-gray-700 rounded-full hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#111111] hover:bg-[#d0473e] text-white text-xs font-bold rounded-full transition-all shadow-xs"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
