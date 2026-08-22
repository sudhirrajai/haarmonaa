import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { MultiCategorySelect } from '@/components/admin/MultiCategorySelect';
import { ProductMediaManager } from '@/components/admin/ProductMediaManager';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { AdminToggle } from '@/components/admin/AdminToggle';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Sparkles,
  Sliders,
  Check,
  Palette,
  Tag,
  Boxes,
  Layers,
  Image as ImageIcon,
  Search,
  Truck,
} from 'lucide-react';

interface AttributeValueItem {
  id: number;
  attribute_id: number;
  name: string;
  value?: string;
  color_code?: string;
}

interface AttributeItem {
  id: number;
  name: string;
  slug: string;
  display_type: 'color_swatch' | 'button_pill' | 'select_dropdown';
  values: AttributeValueItem[];
}

interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  image?: string;
}

interface ProductVariantItem {
  id?: number;
  name?: string;
  sku?: string;
  price?: number | string;
  stock_quantity?: number;
  image?: string;
  attributes?: { [key: string]: string };
}

interface ProductItem {
  id?: number;
  name: string;
  slug?: string;
  category_id?: number;
  category_ids?: number[];
  collection_ids?: number[];
  price: number;
  original_price?: number;
  discount_percent?: number;
  image: string;
  secondary_image?: string;
  images?: string[];
  description?: string;
  stock_quantity: number;
  in_stock: boolean;
  is_featured: boolean;
  is_best_seller: boolean;
  variants?: ProductVariantItem[];
}

interface CollectionOption {
  id: number;
  name: string;
}

interface FormProps {
  product?: ProductItem | null;
  categories: CategoryItem[];
  collections?: CollectionOption[];
  availableAttributes: AttributeItem[];
  allProducts?: Array<{ id: number; name: string; price: number; image?: string }>;
}

export default function Form({
  product,
  categories = [],
  collections = [],
  availableAttributes = [],
  allProducts = [],
}: FormProps) {
  const isEditing = !!product?.id;

  const defaultCatIds = product?.category_ids?.length
    ? product.category_ids
    : product?.category_id
    ? [product.category_id]
    : [categories[0]?.id ?? 1];

  const initialImages = product?.images?.length
    ? product.images
    : [product?.image, product?.secondary_image].filter(Boolean) as string[];

  const [data, setData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    category_ids: defaultCatIds,
    collection_ids: product?.collection_ids || [],
    upsell_ids: ((product as any)?.upsell_ids as number[]) || [],
    price: product?.price || '',
    original_price: product?.original_price || '',
    discount_percent: product?.discount_percent || 0,
    image: product?.image || (initialImages[0] ?? 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop'),
    secondary_image: product?.secondary_image || (initialImages[1] ?? ''),
    images: initialImages.length > 0 ? initialImages : ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop'],
    description: product?.description || '',
    stock_quantity: product?.stock_quantity ?? 50,
    in_stock: product?.in_stock ?? true,
    is_featured: product?.is_featured ?? false,
    is_best_seller: product?.is_best_seller ?? false,
    status: ((product as any)?.status as 'published' | 'draft') || 'published',
    shipping_type: product?.shipping_type || 'default',
    shipping_fee: product?.shipping_fee ?? '',
    variants: product?.variants || [],
  });

  const [upsellSearch, setUpsellSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'attributes'>('general');

  // Selected Attributes Configuration for Matrix Generation
  const [selectedAttributeTerms, setSelectedAttributeTerms] = useState<{
    [attrName: string]: string[];
  }>({});

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handlePriceChange = (priceVal: string, origVal: string) => {
    const p = parseFloat(priceVal) || 0;
    const o = parseFloat(origVal) || 0;
    let disc = 0;
    if (o > p && o > 0) {
      disc = Math.round(((o - p) / o) * 100);
    }
    setData((prev) => ({
      ...prev,
      price: priceVal as any,
      original_price: origVal as any,
      discount_percent: disc,
    }));
  };

  const toggleTermSelection = (attrName: string, termName: string) => {
    setSelectedAttributeTerms((prev) => {
      const current = prev[attrName] || [];
      if (current.includes(termName)) {
        return { ...prev, [attrName]: current.filter((t) => t !== termName) };
      } else {
        return { ...prev, [attrName]: [...current, termName] };
      }
    });
  };

  const generateVariationMatrix = () => {
    const entries = Object.entries(selectedAttributeTerms).filter(
      ([_, terms]) => terms.length > 0
    );

    if (entries.length === 0) {
      alert('Please select at least one attribute term to generate variations.');
      return;
    }

    // Cartesian product of terms
    const combine = (arr: Array<[string, string[]]>): Array<{ [key: string]: string }> => {
      if (arr.length === 0) return [{}];
      const [attrName, terms] = arr[0];
      const restCombos = combine(arr.slice(1));
      const result: Array<{ [key: string]: string }> = [];

      for (const term of terms) {
        for (const combo of restCombos) {
          result.push({ [attrName]: term, ...combo });
        }
      }
      return result;
    };

    const combinations = combine(entries);
    const baseSlug = data.name
      ? data.name.substring(0, 4).toUpperCase().replace(/\s+/g, '')
      : 'JEWL';

    const newVariants: ProductVariantItem[] = combinations.map((combo, idx) => {
      const name = Object.values(combo).join(' / ');
      const sku = `${baseSlug}-${idx + 101}`;
      return {
        name,
        sku,
        price: data.price || 199.0,
        stock_quantity: 20,
        image: data.image,
        attributes: combo,
      };
    });

    setData((prev) => ({
      ...prev,
      variants: newVariants,
    }));
    setActiveTab('attributes');
  };

  const updateVariantRow = (index: number, field: string, value: any) => {
    const updated = [...data.variants];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, variants: updated });
  };

  const removeVariantRow = (index: number) => {
    setData({
      ...data,
      variants: data.variants.filter((_, i) => i !== index),
    });
  };

  const addEmptyVariantRow = () => {
    setData({
      ...data,
      variants: [
        ...data.variants,
        {
          name: 'Custom Variant',
          sku: `CUSTOM-${Date.now().toString().slice(-4)}`,
          price: data.price || 199.0,
          stock_quantity: 20,
          image: data.image,
          attributes: {},
        },
      ],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      router.put(`/admin/products/${product.id}`, data as any, {
        onError: (err) => setErrors(err),
      });
    } else {
      router.post('/admin/products', data as any, {
        onError: (err) => setErrors(err),
      });
    }
  };


  return (
    <AdminLayout title={isEditing ? 'Edit Product' : 'Add New Product'}>
      <Head title={`${isEditing ? 'Edit' : 'Add'} Product — Admin Haarmonaa`} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 bg-white hover:bg-gray-100 rounded-full border border-gray-200 text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {isEditing ? `Edit "${product?.name}"` : 'Create New Jewelry'}
            </h1>
            <p className="text-xs text-gray-500">
              Manage product pricing, attributes, and variation matrix.
            </p>
          </div>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center gap-2 p-1 bg-white border border-gray-200/80 rounded-full shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'general'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            General & Pricing
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('attributes')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'attributes'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <span>Attributes & Variations</span>
            {data.variants.length > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-400 text-black text-[10px] rounded-full font-extrabold">
                {data.variants.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {activeTab === 'general' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Left Column: Basic Details (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Card 1: Identity */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
                <h2 className="text-sm font-bold text-gray-900">General Information</h2>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Product Title <span className="text-[#d0473e]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={data.name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      if (!isEditing && (!data.slug || data.slug === data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''))) {
                        setData({
                          ...data,
                          name: newName,
                          slug: newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
                        });
                      } else {
                        setData({ ...data, name: newName });
                      }
                    }}
                    placeholder="e.g. Anti-Tarnish Starfish Crown Adjustable Ring"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                  />
                  {errors.name && (
                    <span className="text-rose-500 text-[11px] mt-1 block">{errors.name}</span>
                  )}
                </div>

                {/* SEO Product URL Slug */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Product URL Slug <span className="text-gray-400 font-normal">(Clean SEO URL)</span>
                  </label>
                  <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 focus-within:border-black focus-within:bg-white overflow-hidden px-3.5 py-1">
                    <span className="text-xs text-gray-400 select-none font-mono">/product/</span>
                    <input
                      type="text"
                      value={data.slug || ''}
                      onChange={(e) =>
                        setData({
                          ...data,
                          slug: e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, '-')
                            .replace(/-+/g, '-'),
                        })
                      }
                      placeholder="anti-tarnish-starfish-crown-adjustable-ring"
                      className="w-full bg-transparent border-0 py-1.5 px-1 text-xs text-gray-900 font-mono focus:outline-hidden"
                    />
                  </div>
                  {errors.slug && (
                    <span className="text-rose-500 text-[11px] mt-1 block">{errors.slug}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  {/* Multi Category Dropdown */}
                  <div>
                    <MultiCategorySelect
                      categories={categories}
                      selectedCategoryIds={data.category_ids}
                      onChange={(ids) => setData({ ...data, category_ids: ids })}
                      error={errors.category_ids}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Stock Inventory Count <span className="text-[#d0473e]">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={data.stock_quantity}
                      onChange={(e) =>
                        setData({ ...data, stock_quantity: parseInt(e.target.value) || 0 })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white h-[42px]"
                    />
                  </div>
                </div>

                <RichTextEditor
                  label="Product Rich Description"
                  value={data.description}
                  onChange={(html) => setData({ ...data, description: html })}
                  placeholder="Write detailed product description, highlights, care instructions..."
                />
              </div>

              {/* Card 2: Pricing & Discount */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
                <h2 className="text-sm font-bold text-gray-900">Pricing (in ₹ Indian Rupee)</h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Base Sale Price (₹) <span className="text-[#d0473e]">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={data.price}
                      onChange={(e) =>
                        handlePriceChange(e.target.value, data.original_price as any)
                      }
                      placeholder="199.00"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs text-gray-900 font-bold focus:outline-hidden focus:border-black focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Original Price (₹) (Optional)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={data.original_price}
                      onChange={(e) => handlePriceChange(data.price as any, e.target.value)}
                      placeholder="220.00"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Auto Discount Badge (%)
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={data.discount_percent ? `-${data.discount_percent}%` : 'No Discount'}
                      className="w-full bg-gray-100 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs text-gray-500 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2.5: Shipping Class & Delivery Rules (WordPress/WooCommerce Style) */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <div className="p-1.5 bg-amber-50 text-amber-700 rounded-lg">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-gray-900">Shipping & Fulfillment Class</h2>
                    <p className="text-[11px] text-gray-400">
                      Configure custom courier rules, always-free delivery, or exclude this jewelry piece from free shipping threshold.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">
                      Shipping Rule Class
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <label
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                          data.shipping_type === 'default'
                            ? 'bg-amber-50/70 border-amber-300 shadow-2xs'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="shipping_type"
                          value="default"
                          checked={data.shipping_type === 'default'}
                          onChange={() => setData({ ...data, shipping_type: 'default' })}
                          className="mt-0.5 text-black focus:ring-black"
                        />
                        <div>
                          <span className="text-xs font-bold text-gray-900 block">Standard Store Rule</span>
                          <span className="text-[10.5px] text-gray-500 block mt-0.5 leading-snug">
                            Inherits store courier fee and qualifies for Free Shipping order threshold.
                          </span>
                        </div>
                      </label>

                      <label
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                          data.shipping_type === 'free'
                            ? 'bg-emerald-50/70 border-emerald-300 shadow-2xs'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="shipping_type"
                          value="free"
                          checked={data.shipping_type === 'free'}
                          onChange={() => setData({ ...data, shipping_type: 'free' })}
                          className="mt-0.5 text-emerald-600 focus:ring-emerald-600"
                        />
                        <div>
                          <span className="text-xs font-bold text-gray-900 block">Always Free Shipping</span>
                          <span className="text-[10.5px] text-gray-500 block mt-0.5 leading-snug">
                            Complimentary shipping on this piece regardless of cart total.
                          </span>
                        </div>
                      </label>

                      <label
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                          data.shipping_type === 'flat_rate'
                            ? 'bg-blue-50/70 border-blue-300 shadow-2xs'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="shipping_type"
                          value="flat_rate"
                          checked={data.shipping_type === 'flat_rate'}
                          onChange={() => setData({ ...data, shipping_type: 'flat_rate' })}
                          className="mt-0.5 text-blue-600 focus:ring-blue-600"
                        />
                        <div>
                          <span className="text-xs font-bold text-gray-900 block">Custom Flat Rate Fee</span>
                          <span className="text-[10.5px] text-gray-500 block mt-0.5 leading-snug">
                            Override with a fixed courier charge for insured shipping.
                          </span>
                        </div>
                      </label>

                      <label
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                          data.shipping_type === 'exclude_free_shipping'
                            ? 'bg-rose-50/70 border-rose-300 shadow-2xs'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="shipping_type"
                          value="exclude_free_shipping"
                          checked={data.shipping_type === 'exclude_free_shipping'}
                          onChange={() => setData({ ...data, shipping_type: 'exclude_free_shipping' })}
                          className="mt-0.5 text-rose-600 focus:ring-rose-600"
                        />
                        <div>
                          <span className="text-xs font-bold text-gray-900 block">Exclude from Free Shipping</span>
                          <span className="text-[10.5px] text-gray-500 block mt-0.5 leading-snug">
                            Always charges shipping even if cart exceeds the threshold.
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {data.shipping_type === 'flat_rate' && (
                    <div className="pt-2 animate-fade-in">
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Custom Product Shipping Charge (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={data.shipping_fee}
                        onChange={(e) => setData({ ...data, shipping_fee: e.target.value })}
                        placeholder="e.g. 99.00"
                        className="w-full sm:w-48 bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 font-bold focus:outline-hidden focus:border-black focus:bg-white"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Visuals & Flags (4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Card 2.8: Publishing Status & Visibility */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <h2 className="text-sm font-bold text-gray-900">Product Visibility</h2>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      data.status === 'published'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        data.status === 'published' ? 'bg-emerald-500' : 'bg-gray-400'
                      }`}
                    />
                    {data.status === 'published' ? 'Live' : 'Draft'}
                  </span>
                </div>

                <div className="space-y-2">
                  <label
                    className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                      data.status === 'published'
                        ? 'bg-emerald-50/70 border-emerald-300 shadow-2xs'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="published"
                      checked={data.status === 'published'}
                      onChange={() => setData({ ...data, status: 'published' })}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">
                        Published (Live on Boutique)
                      </span>
                      <span className="text-[10.5px] text-gray-500 block mt-0.5 leading-snug">
                        Product is immediately visible and purchasable by store customers.
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                      data.status === 'draft'
                        ? 'bg-gray-100 border-gray-400 shadow-2xs'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="draft"
                      checked={data.status === 'draft'}
                      onChange={() => setData({ ...data, status: 'draft' })}
                      className="mt-0.5 text-black focus:ring-black cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">
                        Draft (Hidden from Storefront)
                      </span>
                      <span className="text-[10.5px] text-gray-500 block mt-0.5 leading-snug">
                        Save all details and images privately without displaying on public catalog.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Card 3: Media Images */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs">
                <ProductMediaManager
                  images={data.images}
                  onChange={(updatedImages) => {
                    setData((prev) => ({
                      ...prev,
                      images: updatedImages,
                      image: updatedImages[0] || '',
                      secondary_image: updatedImages[1] || updatedImages[0] || '',
                    }));
                  }}
                  error={errors.image || errors.images}
                />
              </div>

              {/* Card 4: Product Badges & Visibility */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
                <h2 className="text-sm font-bold text-gray-900 pb-2 border-b border-gray-100">
                  Inventory & Featured Tags
                </h2>

                <div className="space-y-3">
                  <AdminToggle
                    label="In Stock Available"
                    description="Allow shoppers to add this piece to cart."
                    checked={data.in_stock}
                    onChange={(val) => setData({ ...data, in_stock: val })}
                    activeColor="bg-emerald-600"
                  />

                  <AdminToggle
                    label="Featured on Homepage"
                    description="Highlight this product on curated home showcase."
                    checked={data.is_featured}
                    onChange={(val) => setData({ ...data, is_featured: val })}
                    activeColor="bg-amber-500"
                  />

                  <AdminToggle
                    label="Best Seller Tag"
                    description="Showcase luxury Best Seller ribbon badge."
                    checked={data.is_best_seller}
                    onChange={(val) => setData({ ...data, is_best_seller: val })}
                    activeColor="bg-purple-600"
                  />
                </div>
              </div>

              {/* Card 5: Collections Assignment */}
              {collections && collections.length > 0 && (
                <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-gray-900">Collections</h2>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full">
                      {data.collection_ids.length} Assigned
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Assign this product to custom curated collections or seasonal drops.
                  </p>

                  <div className="space-y-2 max-h-48 overflow-y-auto pt-1">
                    {collections.map((col) => {
                      const isChecked = data.collection_ids.includes(col.id);
                      return (
                        <label
                          key={col.id}
                          className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-amber-50/80 border-amber-300'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              setData((prev) => ({
                                ...prev,
                                collection_ids: e.target.checked
                                  ? [...prev.collection_ids, col.id]
                                  : prev.collection_ids.filter((id) => id !== col.id),
                              }));
                            }}
                            className="w-4 h-4 rounded-xs border-gray-300 text-black focus:ring-black cursor-pointer"
                          />
                          <span className="text-xs font-bold text-gray-800">{col.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Card 6: Frequently Bought Together Upsells */}
              {allProducts && allProducts.length > 0 && (
                <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-gray-900">
                        Frequently Bought Together (Recommended Upsells)
                      </h2>
                      <p className="text-[11px] text-gray-500">
                        Select products to recommend as pairings on the storefront product page.
                      </p>
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-black text-white rounded-full shrink-0">
                      {data.upsell_ids.length} Selected
                    </span>
                  </div>

                  {/* Quick Search Input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={upsellSearch}
                      onChange={(e) => setUpsellSearch(e.target.value)}
                      placeholder="Quick search products to pair..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-8 py-2 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                    />
                    {upsellSearch && (
                      <button
                        type="button"
                        onClick={() => setUpsellSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black text-xs font-bold cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Search / Selection Grid */}
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1 pt-1">
                    {allProducts
                      .filter((p) => p.name.toLowerCase().includes(upsellSearch.toLowerCase()))
                      .map((pItem) => {
                        const isSelected = data.upsell_ids.includes(pItem.id);
                        return (
                          <div
                            key={pItem.id}
                            onClick={() => {
                              const next = isSelected
                                ? data.upsell_ids.filter((id) => id !== pItem.id)
                                : [...data.upsell_ids, pItem.id];
                              setData({ ...data, upsell_ids: next });
                            }}
                            className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                              isSelected
                                ? 'border-black bg-gray-50 ring-1 ring-black shadow-2xs'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            <img
                              src={pItem.image || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=400&auto=format&fit=crop'}
                              alt={pItem.name}
                              className="w-12 h-12 object-cover rounded-xl border border-gray-200 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs font-bold text-gray-900 truncate">{pItem.name}</h4>
                              <span className="text-xs font-extrabold text-gray-700">₹{Number(pItem.price).toFixed(2)}</span>
                            </div>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border text-xs font-bold shrink-0 ${
                              isSelected ? 'bg-black text-white border-black' : 'border-gray-300 text-transparent'
                            }`}>
                              ✓
                            </div>
                          </div>
                        );
                      })}

                    {allProducts.filter((p) => p.name.toLowerCase().includes(upsellSearch.toLowerCase())).length === 0 && (
                      <div className="py-6 text-center text-xs text-gray-400">
                        No products match "{upsellSearch}"
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Tab 2: Attributes & Variations Matrix Builder */
          <div className="space-y-6">
            {/* 1. Global Attributes Picker */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Step 1: Choose Product Attributes & Terms
                  </h2>
                  <p className="text-xs text-gray-500">
                    Select which metal finishes, sizes, and stones apply to this item.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={generateVariationMatrix}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111111] hover:bg-[#d0473e] text-white rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Variations Matrix</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {availableAttributes.map((attr) => {
                  const selectedTerms = selectedAttributeTerms[attr.name] || [];
                  return (
                    <div
                      key={attr.id}
                      className="p-4 bg-gray-50/70 border border-gray-200/90 rounded-2xl space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900">{attr.name}</span>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-white border border-gray-200 rounded-full text-gray-600">
                          {attr.display_type.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {attr.values?.map((val) => {
                          const isChecked = selectedTerms.includes(val.name);
                          return (
                            <button
                              key={val.id}
                              type="button"
                              onClick={() => toggleTermSelection(attr.name, val.name)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                isChecked
                                  ? 'bg-[#111111] text-white shadow-2xs'
                                  : 'bg-white text-gray-700 border border-gray-200 hover:border-black'
                              }`}
                            >
                              {attr.display_type === 'color_swatch' && val.color_code && (
                                <span
                                  className="w-3 h-3 rounded-full border border-white/20"
                                  style={{ backgroundColor: val.color_code }}
                                />
                              )}
                              <span>{val.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Generated Variations Matrix Table */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Step 2: Variations Matrix ({data.variants.length} SKUs)
                  </h2>
                  <p className="text-xs text-gray-500">
                    Set specific prices, stock inventory, and photo URLs for each variation.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addEmptyVariantRow}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-100 hover:bg-black hover:text-white rounded-full text-xs font-bold text-gray-800 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Custom Variant</span>
                </button>
              </div>

              {data.variants.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50/80 text-gray-500 font-bold border-b border-gray-100">
                      <tr>
                        <th className="py-3 px-4">Variant Option</th>
                        <th className="py-3 px-4">SKU</th>
                        <th className="py-3 px-4">Price (₹)</th>
                        <th className="py-3 px-4">Stock</th>
                        <th className="py-3 px-4">Specific Image URL</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.variants.map((v, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50">
                          <td className="py-3 px-4">
                            <span className="font-bold text-gray-900">{v.name || 'Standard'}</span>
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={v.sku || ''}
                              onChange={(e) => updateVariantRow(idx, 'sku', e.target.value)}
                              className="bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-2 text-xs text-gray-900 font-mono w-28 focus:outline-hidden focus:border-black"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              step="0.01"
                              value={v.price ?? data.price}
                              onChange={(e) => updateVariantRow(idx, 'price', e.target.value)}
                              className="bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-2 text-xs text-gray-900 font-bold w-24 focus:outline-hidden focus:border-black"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              min="0"
                              value={v.stock_quantity ?? 20}
                              onChange={(e) =>
                                updateVariantRow(idx, 'stock_quantity', parseInt(e.target.value) || 0)
                              }
                              className="bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-2 text-xs text-gray-900 w-20 focus:outline-hidden focus:border-black"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={v.image || ''}
                              onChange={(e) => updateVariantRow(idx, 'image', e.target.value)}
                              placeholder="https://..."
                              className="bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-2 text-xs text-gray-900 w-48 focus:outline-hidden focus:border-black"
                            />
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => removeVariantRow(idx)}
                              className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete Variant"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-10 text-center text-gray-400 space-y-2">
                  <Boxes className="w-8 h-8 mx-auto text-gray-300" />
                  <p className="text-xs">
                    No variations generated yet. Select attribute terms above and click "Generate
                    Variations Matrix".
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Global Save Button at Bottom */}
        <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <Link
            href="/admin/products"
            className="px-6 py-3 border border-gray-300 text-xs font-bold text-gray-700 rounded-full hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-8 py-3.5 bg-[#111111] hover:bg-[#d0473e] text-white font-bold text-xs uppercase tracking-wider rounded-full flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'Update Jewelry Item' : 'Save & Publish Product'}</span>
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
