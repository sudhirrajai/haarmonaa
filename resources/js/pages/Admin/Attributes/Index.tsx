import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Plus, Edit2, Trash2, Sliders, X, Palette, Tag, Check, Sparkles } from 'lucide-react';
import { SingleImageUploader } from '@/components/admin/SingleImageUploader';

interface AttributeValueItem {
  id: number;
  attribute_id: number;
  name: string;
  value?: string;
  color_code?: string;
  swatch_image?: string;
}

interface AttributeItem {
  id: number;
  name: string;
  slug: string;
  display_type: 'color_swatch' | 'button_pill' | 'select_dropdown';
  description?: string;
  values: AttributeValueItem[];
}

interface AttributesProps {
  attributes: AttributeItem[];
}

export default function Index({ attributes = [] }: AttributesProps) {
  const [attrModalOpen, setAttrModalOpen] = useState(false);
  const [editingAttr, setEditingAttr] = useState<AttributeItem | null>(null);
  const [attrForm, setAttrForm] = useState({
    name: '',
    display_type: 'button_pill',
    description: '',
  });

  // Value Modal State
  const [valueModalOpen, setValueModalOpen] = useState(false);
  const [selectedAttrForValue, setSelectedAttrForValue] = useState<AttributeItem | null>(null);
  const [valueForm, setValueForm] = useState({
    name: '',
    value: '',
    color_code: '#D4AF37',
    swatch_image: '',
  });

  const openCreateAttrModal = () => {
    setEditingAttr(null);
    setAttrForm({ name: '', display_type: 'button_pill', description: '' });
    setAttrModalOpen(true);
  };

  const openEditAttrModal = (attr: AttributeItem) => {
    setEditingAttr(attr);
    setAttrForm({
      name: attr.name,
      display_type: attr.display_type,
      description: attr.description || '',
    });
    setAttrModalOpen(true);
  };

  const handleAttrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAttr) {
      router.put(`/admin/attributes/${editingAttr.id}`, attrForm, {
        onSuccess: () => setAttrModalOpen(false),
      });
    } else {
      router.post('/admin/attributes', attrForm, {
        onSuccess: () => setAttrModalOpen(false),
      });
    }
  };

  const handleAttrDelete = (id: number, name: string) => {
    if (confirm(`Delete attribute "${name}" and all its assigned variation terms?`)) {
      router.delete(`/admin/attributes/${id}`);
    }
  };

  const openAddValueModal = (attr: AttributeItem) => {
    setSelectedAttrForValue(attr);
    setValueForm({ name: '', value: '', color_code: '#D4AF37', swatch_image: '' });
    setValueModalOpen(true);
  };

  const handleValueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAttrForValue) return;

    router.post(`/admin/attributes/${selectedAttrForValue.id}/values`, valueForm, {
      onSuccess: () => setValueModalOpen(false),
    });
  };

  const handleValueDelete = (valueId: number) => {
    if (confirm('Delete this term value?')) {
      router.delete(`/admin/attribute-values/${valueId}`);
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'color_swatch':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'button_pill':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      default:
        return 'bg-purple-50 text-purple-800 border-purple-200';
    }
  };

  return (
    <AdminLayout title="Attributes & Variations">
      <Head title="Attributes Management — Admin Haarmonaa" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Product Attributes & Variation Terms
          </h1>
          <p className="text-xs sm:text-[13px] text-gray-500 mt-1">
            Configure global jewelry variations (Metal colors, Ring sizes, Gemstones, Chain lengths).
          </p>
        </div>

        <button
          onClick={openCreateAttrModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111111] hover:bg-[#d0473e] text-white rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Attribute</span>
        </button>
      </div>

      {/* Attributes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {attributes.map((attr) => (
          <div
            key={attr.id}
            className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs p-6 space-y-4 flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-base font-bold text-gray-900">{attr.name}</h2>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getTypeBadge(
                        attr.display_type
                      )}`}
                    >
                      {attr.display_type.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{attr.description || 'Global jewelry attribute.'}</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditAttrModal(attr)}
                    className="p-1.5 text-gray-400 hover:text-black rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    title="Edit Attribute"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleAttrDelete(attr.id, attr.name)}
                    className="p-1.5 text-gray-400 hover:text-[#d0473e] rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Attribute"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Terms / Values List */}
              <div className="pt-4 space-y-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Configured Values ({attr.values?.length || 0})
                </span>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {attr.values?.map((val) => (
                    <span
                      key={val.id}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200/90 rounded-xl text-xs font-bold text-gray-800 shadow-2xs group"
                    >
                      {attr.display_type === 'color_swatch' && val.color_code && (
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                          style={{ backgroundColor: val.color_code }}
                        />
                      )}
                      <span>{val.name}</span>
                      <button
                        onClick={() => handleValueDelete(val.id)}
                        className="text-gray-300 group-hover:text-rose-500 hover:scale-110 transition-all cursor-pointer"
                        title="Remove Term"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  <button
                    onClick={() => openAddValueModal(attr)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-black hover:text-white rounded-xl text-xs font-bold text-gray-700 transition-all cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Term</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 1. Create/Edit Attribute Modal */}
      {attrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setAttrModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 z-10 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">
                {editingAttr ? 'Edit Attribute' : 'Create Attribute'}
              </h3>
              <button onClick={() => setAttrModalOpen(false)} className="p-1 text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAttrSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Attribute Name *</label>
                <input
                  type="text"
                  required
                  value={attrForm.name}
                  onChange={(e) => setAttrForm({ ...attrForm, name: e.target.value })}
                  placeholder="e.g. Metal Finish, Ring Size"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Display UI Type *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAttrForm({ ...attrForm, display_type: 'button_pill' })}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                      attrForm.display_type === 'button_pill'
                        ? 'border-black bg-black text-white shadow-xs'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Tag className="w-4 h-4" />
                    <span className="text-[11px] font-bold">Button / Pill</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAttrForm({ ...attrForm, display_type: 'color_swatch' })}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                      attrForm.display_type === 'color_swatch'
                        ? 'border-black bg-black text-white shadow-xs'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Palette className="w-4 h-4" />
                    <span className="text-[11px] font-bold">Color Swatch</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAttrForm({ ...attrForm, display_type: 'select_dropdown' })}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                      attrForm.display_type === 'select_dropdown'
                        ? 'border-black bg-black text-white shadow-xs'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Sliders className="w-4 h-4" />
                    <span className="text-[11px] font-bold">Dropdown</span>
                  </button>
                </div>
              </div>


              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Description</label>
                <textarea
                  rows={2}
                  value={attrForm.description}
                  onChange={(e) => setAttrForm({ ...attrForm, description: e.target.value })}
                  placeholder="Brief description of how this attribute is used..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAttrModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-xs font-bold text-gray-700 rounded-full hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#111111] hover:bg-[#d0473e] text-white text-xs font-bold rounded-full transition-all shadow-xs"
                >
                  Save Attribute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Add Term Value Modal */}
      {valueModalOpen && selectedAttrForValue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setValueModalOpen(false)} />
          <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 z-10 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Add {selectedAttrForValue.name} Term</h3>
              <button onClick={() => setValueModalOpen(false)} className="p-1 text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleValueSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Term Name *</label>
                <input
                  type="text"
                  required
                  value={valueForm.name}
                  onChange={(e) => setValueForm({ ...valueForm, name: e.target.value })}
                  placeholder="e.g. 18K Yellow Gold, US 6"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                />
              </div>

              {selectedAttrForValue.display_type === 'color_swatch' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Color Hex Code</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={valueForm.color_code}
                        onChange={(e) => setValueForm({ ...valueForm, color_code: e.target.value })}
                        className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer p-1 bg-gray-50 shrink-0"
                      />
                      <input
                        type="text"
                        value={valueForm.color_code}
                        onChange={(e) => setValueForm({ ...valueForm, color_code: e.target.value })}
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 font-mono focus:outline-hidden focus:border-black"
                      />
                    </div>
                  </div>

                  <SingleImageUploader
                    label="Custom Swatch Pattern/Texture Image (Optional)"
                    value={valueForm.swatch_image}
                    onChange={(url) => setValueForm({ ...valueForm, swatch_image: url })}
                    placeholder="Upload swatch texture image or paste URL..."
                  />
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setValueModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-xs font-bold text-gray-700 rounded-full hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#111111] hover:bg-[#d0473e] text-white text-xs font-bold rounded-full transition-all shadow-xs"
                >
                  Add Term
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
