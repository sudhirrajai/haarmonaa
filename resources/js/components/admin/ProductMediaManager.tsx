import React, { useState, useRef } from 'react';
import {
  Upload,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Star,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  AlertCircle,
  Layers,
} from 'lucide-react';
import { MediaPickerModal } from '@/components/admin/MediaPickerModal';

interface ProductMediaManagerProps {
  images: string[];
  onChange: (updatedImages: string[]) => void;
  maxImages?: number;
  error?: string;
}

export const ProductMediaManager: React.FC<ProductMediaManagerProps> = ({
  images = [],
  onChange,
  maxImages = 10,
  error,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isMaxReached = images.length >= maxImages;

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (isMaxReached) {
      alert(`Maximum upload limit reached (${maxImages} images allowed per product).`);
      return;
    }

    const availableSlots = maxImages - images.length;
    const filesToUpload = Array.from(files).slice(0, availableSlots);

    if (files.length > availableSlots) {
      alert(`Only ${availableSlots} more image(s) can be added. Excess files were ignored.`);
    }

    setUploading(true);
    const newUrls: string[] = [];

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/admin/products/upload-media', {
          method: 'POST',
          headers: {
            'X-CSRF-TOKEN':
              (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
            Accept: 'application/json',
          },
          body: formData,
        });

        const data = await response.json();
        if (response.ok && data.url) {
          newUrls.push(data.url);
        } else {
          alert(`Failed to upload ${file.name}: ${data.message || 'Unknown error'}`);
        }
      } catch {
        alert(`Error uploading file ${file.name}`);
      }
    }

    if (newUrls.length > 0) {
      onChange([...images, ...newUrls]);
    }
    setUploading(false);
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    if (isMaxReached) {
      alert(`Maximum upload limit reached (${maxImages} images allowed per product).`);
      return;
    }

    onChange([...images, urlInput.trim()]);
    setUrlInput('');
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const makePrimary = (index: number) => {
    if (index === 0) return;
    const item = images[index];
    const remaining = images.filter((_, i) => i !== index);
    onChange([item, ...remaining]);
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div>
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-amber-600" />
            <span>Product Media Gallery</span>
          </h2>
          <p className="text-[11.5px] text-gray-500 mt-0.5">
            The 1st image is <strong className="text-black">Primary Cover</strong>, 2nd is <strong className="text-black">Hover</strong>, rest are <strong className="text-black">Gallery</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* WordPress-style Choose from Media Library Button */}
          <button
            type="button"
            disabled={isMaxReached}
            onClick={() => setMediaPickerOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#111111] hover:bg-[#d0473e] text-white rounded-[10px] text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Layers className="w-3.5 h-3.5 text-amber-300" />
            <span>Choose from Media Library</span>
          </button>

          <span
            className={`px-2.5 py-1 font-extrabold text-[11px] rounded-full border shrink-0 ${
              isMaxReached
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-amber-50 text-amber-900 border-amber-200'
            }`}
          >
            {images.length} / {maxImages} Max
          </span>
        </div>
      </div>

      {/* Upload & Drag Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!isMaxReached) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (!isMaxReached) handleFileUpload(e.dataTransfer.files);
        }}
        onClick={() => !isMaxReached && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-5 text-center transition-all ${
          isMaxReached
            ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
            : dragOver
            ? 'border-black bg-amber-50/50 scale-[0.99] cursor-pointer'
            : 'border-gray-200 hover:border-gray-400 bg-gray-50/60 hover:bg-white cursor-pointer'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFileUpload(e.target.files)}
          multiple
          accept="image/*"
          disabled={isMaxReached}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-white shadow-2xs border border-gray-200 flex items-center justify-center text-gray-700">
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
            ) : isMaxReached ? (
              <AlertCircle className="w-5 h-5 text-rose-500" />
            ) : (
              <Upload className="w-4 h-4 text-gray-600" />
            )}
          </div>
          <div>
            <span className="text-xs font-bold text-gray-900 block">
              {uploading
                ? 'Uploading images...'
                : isMaxReached
                ? `Maximum limit of ${maxImages} images reached`
                : 'Click to Upload or Drag & Drop Images'}
            </span>
            <span className="text-[11px] text-gray-400 block mt-0.5">
              Uploaded files are also automatically stored in your store Media Library.
            </span>
          </div>
        </div>
      </div>

      {/* External URL Input Form */}
      <form onSubmit={handleAddUrl} className="flex items-center gap-2">
        <div className="relative flex-1">
          <LinkIcon className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="url"
            disabled={isMaxReached}
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder={isMaxReached ? `Limit of ${maxImages} images reached` : 'Paste image URL (https://...)'}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-3 text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-black focus:bg-white disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={!urlInput.trim() || isMaxReached}
          className="px-3.5 py-2 bg-gray-100 hover:bg-[#111111] hover:text-white text-gray-800 font-bold text-xs rounded-xl transition-all disabled:opacity-50 cursor-pointer shrink-0 border border-gray-200 flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add URL</span>
        </button>
      </form>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        multiple={true}
        maxSelect={maxImages - images.length}
        title="Select Product Images from Media Library"
        onSelect={(selected) => {
          onChange([...images, ...selected].slice(0, maxImages));
        }}
      />

      {error && <span className="text-rose-500 text-[11px] block font-semibold">{error}</span>}

      {/* Image Gallery Grid with Rearranging & Roles (2x2 Grid Layout) */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 pt-1">
          {images.map((url, idx) => {
            const isPrimary = idx === 0;
            const isSecondary = idx === 1;

            return (
              <div
                key={`${url}-${idx}`}
                className={`flex flex-col rounded-2xl overflow-hidden bg-white border-2 transition-all shadow-2xs group ${
                  isPrimary
                    ? 'border-amber-500 ring-2 ring-amber-400/20'
                    : isSecondary
                    ? 'border-blue-500'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                {/* Image Aspect Box (Clicking image sets it as Primary Cover) */}
                <div
                  onClick={() => makePrimary(idx)}
                  className="aspect-square relative overflow-hidden bg-gray-100 cursor-pointer"
                  title={isPrimary ? 'Primary Cover Image' : 'Click to set as Primary Cover'}
                >
                  <img
                    src={url}
                    alt={`Product Media ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop';
                    }}
                  />

                  {/* Top Badges Overlay */}
                  <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between pointer-events-none z-10">
                    <div className="pointer-events-auto">
                      {isPrimary && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500 text-black font-extrabold text-[10px] rounded-md shadow-xs">
                          <Star className="w-3 h-3 fill-black stroke-black" /> Cover
                        </span>
                      )}
                      {isSecondary && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-600 text-white font-extrabold text-[10px] rounded-md shadow-xs">
                          <ImageIcon className="w-3 h-3" /> Hover
                        </span>
                      )}
                      {!isPrimary && !isSecondary && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-black/75 text-white font-bold text-[10px] rounded-md">
                          #{idx + 1}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(idx);
                      }}
                      className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md transition-transform hover:scale-110 cursor-pointer pointer-events-auto shrink-0"
                      title="Remove Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Click to Make Cover Hover Hint */}
                  {!isPrimary && (
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-center p-2">
                      <span className="px-2.5 py-1 bg-amber-400 text-black font-extrabold text-[10px] rounded-lg shadow-md flex items-center gap-1">
                        <Star className="w-3 h-3 fill-black" /> Make Cover
                      </span>
                    </div>
                  )}
                </div>

                {/* Compact Bottom Toolbar (Fits 100% cleanly in 2x2 grid) */}
                <div className="p-1.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      moveImage(idx, 'left');
                    }}
                    className="p-1.5 bg-white hover:bg-black hover:text-white border border-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0"
                    title="Move Left / Earlier"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  <span className="text-[10.5px] font-extrabold text-gray-700 truncate px-1 text-center select-none">
                    {isPrimary ? (
                      <span className="text-amber-800 font-extrabold">★ Cover</span>
                    ) : isSecondary ? (
                      <span className="text-blue-800 font-extrabold">Hover</span>
                    ) : (
                      `Gallery #${idx + 1}`
                    )}
                  </span>

                  <button
                    type="button"
                    disabled={idx === images.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      moveImage(idx, 'right');
                    }}
                    className="p-1.5 bg-white hover:bg-black hover:text-white border border-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0"
                    title="Move Right / Later"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-8 text-center bg-gray-50 border border-gray-200/80 rounded-2xl p-4 text-gray-400 space-y-1">
          <ImageIcon className="w-8 h-8 mx-auto text-gray-300 stroke-[1.5]" />
          <p className="text-xs font-bold text-gray-700">No media images added yet</p>
          <p className="text-[11px] text-gray-400">
            Upload images from your computer or paste photo URLs above to build the product gallery.
          </p>
        </div>
      )}
    </div>
  );
};

