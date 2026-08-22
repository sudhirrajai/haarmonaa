import React, { useState, useRef, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { SingleImageUploader } from '@/components/admin/SingleImageUploader';
import {
  Plus,
  Edit2,
  Trash2,
  FolderTree,
  X,
  Search,
  CornerDownRight,
  Layers,
  ChevronRight,
  ChevronDown,
  Check,
  Filter,
} from 'lucide-react';
import { AdminPagination, PaginationData } from '@/components/admin/AdminPagination';

interface SimpleCategory {
  id: number;
  name: string;
  parent_id?: number | null;
  slug: string;
}

interface CategoryItem {
  id: number;
  parent_id?: number | null;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  products_count?: number;
  parent?: SimpleCategory | null;
  children?: SimpleCategory[];
}

interface CategoriesProps {
  categories: PaginationData<CategoryItem> | CategoryItem[];
  allCategories?: SimpleCategory[];
  filters?: {
    search?: string;
    parent_id?: string;
    per_page?: number;
  };
}

export default function Index({ categories, allCategories = [], filters = {} }: CategoriesProps) {
  const isPaginated = !Array.isArray(categories) && 'data' in categories;
  const categoryList: CategoryItem[] = isPaginated
    ? (categories as PaginationData<CategoryItem>).data
    : (categories as CategoryItem[]);
  const paginationData = isPaginated ? (categories as PaginationData<CategoryItem>) : null;

  const [search, setSearch] = useState(filters.search || '');
  const [parentFilter, setParentFilter] = useState(filters.parent_id || '');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    parent_id: '' as string | number,
    image: '',
    description: '',
  });

  const openCreateModal = (presetParentId?: number) => {
    setEditingCategory(null);
    setFormData({
      name: '',
      parent_id: presetParentId ? String(presetParentId) : '',
      image: '',
      description: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      parent_id: cat.parent_id ? String(cat.parent_id) : '',
      image: cat.image || '',
      description: cat.description || '',
    });
    setModalOpen(true);
  };

  const handleFilterChange = (newSearch = search, newParent = parentFilter) => {
    router.get(
      '/admin/categories',
      {
        search: newSearch || undefined,
        parent_id: newParent || undefined,
      },
      { preserveState: true, replace: true }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      parent_id: formData.parent_id ? Number(formData.parent_id) : null,
    };

    if (editingCategory) {
      router.put(`/admin/categories/${editingCategory.id}`, payload, {
        onSuccess: () => setModalOpen(false),
      });
    } else {
      router.post('/admin/categories', payload, {
        onSuccess: () => setModalOpen(false),
      });
    }
  };

  const [categoryToDelete, setCategoryToDelete] = useState<{ id: number; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = (id: number, name: string) => {
    setCategoryToDelete({ id, name });
  };

  const confirmDelete = () => {
    if (!categoryToDelete) return;
    setDeleting(true);
    router.delete(`/admin/categories/${categoryToDelete.id}`, {
      onFinish: () => {
        setDeleting(false);
        setCategoryToDelete(null);
      },
    });
  };

  const [parentDropdownOpen, setParentDropdownOpen] = useState(false);
  const [parentSearch, setParentSearch] = useState('');
  const parentDropdownRef = useRef<HTMLDivElement>(null);

  // Close parent dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (parentDropdownRef.current && !parentDropdownRef.current.contains(event.target as Node)) {
        setParentDropdownOpen(false);
      }
    };
    if (parentDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [parentDropdownOpen]);

  // Eligible parent options (cannot be self or child of self when editing)
  const availableParents = allCategories.filter((c) => {
    if (!editingCategory) return true;
    if (c.id === editingCategory.id) return false;
    return true;
  });

  const filteredParents = availableParents.filter((p) =>
    p.name.toLowerCase().includes(parentSearch.toLowerCase()) ||
    p.slug.toLowerCase().includes(parentSearch.toLowerCase())
  );

  const selectedParent = availableParents.find((p) => String(p.id) === String(formData.parent_id));

  return (
    <AdminLayout title="Categories">
      <Head title="Categories — Admin Haarmonaa" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Jewelry Categories & Subcategories
          </h1>
          <p className="text-xs sm:text-[13px] text-gray-500 mt-1">
            Organize catalog groupings and subcategories (e.g. Earrings → Studs, Hoops, Drops).
          </p>
        </div>

        <button
          onClick={() => openCreateModal()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111111] hover:bg-[#d0473e] text-white rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              handleFilterChange(e.target.value, parentFilter);
            }}
            placeholder="Search categories..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:border-black focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => {
                setParentFilter('');
                handleFilterChange(search, '');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                parentFilter === ''
                  ? 'bg-white text-black shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                setParentFilter('parents_only');
                handleFilterChange(search, 'parents_only');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                parentFilter === 'parents_only'
                  ? 'bg-white text-black shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Main Only
            </button>
            <button
              onClick={() => {
                setParentFilter('subcategories_only');
                handleFilterChange(search, 'subcategories_only');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                parentFilter === 'subcategories_only'
                  ? 'bg-white text-black shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Subcategories Only
            </button>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      {categoryList.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200/80 p-12 text-center space-y-3">
          <FolderTree className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-gray-800">No categories found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try adjusting your search filters or click the button above to create a new category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryList.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden group hover:border-black transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-4/3 bg-gray-100 overflow-hidden">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <FolderTree className="w-12 h-12 stroke-[1]" />
                    </div>
                  )}

                  {/* Items Count Badge */}
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-black text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-2xs">
                    {cat.products_count || 0} items
                  </span>

                  {/* Parent / Subcategory Badge */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {cat.parent ? (
                      <span className="inline-flex items-center gap-1 bg-black/80 backdrop-blur-xs text-amber-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-2xs">
                        <CornerDownRight className="w-3 h-3" />
                        <span>Sub of {cat.parent.name}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-2xs">
                        <Layers className="w-3 h-3" />
                        <span>Main Category</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-base font-bold text-gray-900 group-hover:text-[#d0473e] transition-colors">
                      {cat.name}
                    </h2>
                    <span className="text-[11px] font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md shrink-0">
                      /{cat.slug}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {cat.description || 'No description provided.'}
                  </p>

                  {/* Child Subcategories Pills */}
                  {cat.children && cat.children.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                        Subcategories ({cat.children.length}):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.children.map((child) => (
                          <span
                            key={child.id}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-[11px] font-medium"
                          >
                            <ChevronRight className="w-2.5 h-2.5 text-gray-400" />
                            {child.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Actions Footer */}
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  {!cat.parent_id ? (
                    <button
                      onClick={() => openCreateModal(cat.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      title="Add child subcategory"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Sub</span>
                    </button>
                  ) : (
                    <span />
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-2 text-gray-500 hover:text-black rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="p-2 text-gray-500 hover:text-[#d0473e] rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {paginationData && (
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs mt-6">
          <AdminPagination pagination={paginationData} />
        </div>
      )}

      {/* Create/Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 z-10 space-y-4 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-gray-400 hover:text-black cursor-pointer rounded-lg hover:bg-gray-100"
              >
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
                  placeholder="e.g. Stud Earrings"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                />
              </div>

              {/* Parent Category Custom Dropdown Selector */}
              <div className="relative" ref={parentDropdownRef}>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center justify-between">
                  <span>Parent Category (Hierarchy)</span>
                  {formData.parent_id && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, parent_id: '' })}
                      className="text-[11px] font-bold text-[#d0473e] hover:underline cursor-pointer"
                    >
                      Clear / Make Top-Level
                    </button>
                  )}
                </label>

                {/* Custom Trigger Button */}
                <button
                  type="button"
                  onClick={() => setParentDropdownOpen(!parentDropdownOpen)}
                  className="w-full bg-gray-50 hover:bg-white border border-gray-200 hover:border-black focus:border-black rounded-xl p-3 text-xs text-gray-900 transition-all flex items-center justify-between shadow-2xs cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {selectedParent ? (
                      <>
                        <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
                          <CornerDownRight className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-left truncate">
                          <span className="font-bold text-gray-900 block truncate">
                            {selectedParent.name}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            /{selectedParent.slug}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-6 h-6 rounded-lg bg-gray-200 text-gray-700 flex items-center justify-center shrink-0">
                          <Layers className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-left">
                          <span className="font-bold text-gray-800 block">
                            None (Top-Level / Main Category)
                          </span>
                          <span className="text-[10.5px] text-gray-400">
                            Primary standalone catalog group
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                      {selectedParent ? 'Subcategory' : 'Main'}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 group-hover:text-black transition-transform duration-200 ${
                        parentDropdownOpen ? 'rotate-180 text-black' : ''
                      }`}
                    />
                  </div>
                </button>

                {/* Custom Animated Dropdown Menu */}
                {parentDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 shadow-2xl rounded-2xl p-2 z-50 animate-fade-in max-h-72 flex flex-col">
                    {/* Search inside dropdown if categories > 4 */}
                    {availableParents.length > 4 && (
                      <div className="p-1 pb-2 border-b border-gray-100">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={parentSearch}
                            onChange={(e) => setParentSearch(e.target.value)}
                            placeholder="Filter parent categories..."
                            className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:border-black focus:outline-hidden"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                    )}

                    <div className="overflow-y-auto space-y-1 py-1 flex-1">
                      {/* Option 1: None (Top-Level Category) */}
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, parent_id: '' });
                          setParentDropdownOpen(false);
                          setParentSearch('');
                        }}
                        className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer ${
                          !formData.parent_id
                            ? 'bg-amber-50/80 text-amber-950 font-bold border border-amber-200'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                            <Layers className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold block">
                              None (Top-Level / Main Category)
                            </span>
                            <span className="text-[10px] text-gray-400">
                              Standalone category (e.g. Earrings, Rings)
                            </span>
                          </div>
                        </div>

                        {!formData.parent_id && <Check className="w-4 h-4 text-amber-700 shrink-0" />}
                      </button>

                      {/* Filtered Parent Categories */}
                      {filteredParents.length > 0 && (
                        <div className="pt-2">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2.5 pb-1 block">
                            Select Parent Category:
                          </span>
                          {filteredParents.map((parent) => {
                            const isSelected = String(formData.parent_id) === String(parent.id);
                            return (
                              <button
                                key={parent.id}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, parent_id: String(parent.id) });
                                  setParentDropdownOpen(false);
                                  setParentSearch('');
                                }}
                                className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-black text-white font-bold'
                                    : 'hover:bg-gray-50 text-gray-800'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div
                                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                                      isSelected
                                        ? 'bg-white/20 text-white'
                                        : parent.parent_id
                                        ? 'bg-gray-100 text-gray-500'
                                        : 'bg-amber-50 text-amber-800'
                                    }`}
                                  >
                                    {parent.parent_id ? (
                                      <CornerDownRight className="w-3.5 h-3.5" />
                                    ) : (
                                      <Layers className="w-3.5 h-3.5" />
                                    )}
                                  </div>

                                  <div className="truncate">
                                    <span className="text-xs font-semibold block truncate">
                                      {parent.name}
                                    </span>
                                    <span
                                      className={`text-[10px] font-mono block ${
                                        isSelected ? 'text-gray-300' : 'text-gray-400'
                                      }`}
                                    >
                                      /{parent.slug}
                                    </span>
                                  </div>
                                </div>

                                {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <p className="text-[11px] text-gray-400 mt-1">
                  Choose a parent to nest this under (e.g. Hoops under Earrings), or leave as None for top-level categories.
                </p>
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
                  placeholder="Category description for customer storefront & SEO..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-xs font-bold text-gray-700 rounded-full hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#111111] hover:bg-[#d0473e] text-white text-xs font-bold rounded-full transition-all shadow-xs cursor-pointer"
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Jewelry Category?"
        itemName={categoryToDelete?.name}
        message={`Are you sure you want to delete category "${categoryToDelete?.name}"? Any subcategories under it will become top-level categories, and products will remain in the catalog.`}
        confirmLabel="Delete Category"
        processing={deleting}
      />
    </AdminLayout>
  );
}
