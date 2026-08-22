import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, Layers } from 'lucide-react';
import { MediaPickerModal } from '@/components/admin/MediaPickerModal';

interface SingleImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
}

export function SingleImageUploader({
  value,
  onChange,
  label = 'Image',
  placeholder = 'Upload image from system or paste URL...',
  hint,
  error,
}: SingleImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds 10MB limit.');
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Fetch CSRF token
      const csrfToken =
        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';

      const response = await fetch('/admin/products/upload-media', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          Accept: 'application/json',
        },
        body: formData,
      });

      const resData = await response.json();

      if (response.ok && resData.url) {
        onChange(resData.url);
      } else {
        setUploadError(resData.message || 'Image upload failed.');
      }
    } catch (err: any) {
      setUploadError('Network error uploading file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        {label && <label className="block text-xs font-bold text-gray-700">{label}</label>}
        {hint && (
          <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md">
            {hint}
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Thumbnail Preview Box */}
        <div className="relative w-20 h-20 rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 group">
          {value ? (
            <>
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-black text-white rounded-full transition-opacity cursor-pointer opacity-0 group-hover:opacity-100"
                title="Remove Image"
              >
                <X className="w-3 h-3" />
              </button>
            </>
          ) : (
            <ImageIcon className="w-6 h-6 text-gray-300" />
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-black animate-spin" />
            </div>
          )}
        </div>

        {/* Upload Controls & URL Input */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />

            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-gray-900 hover:bg-[#d0473e] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-2 shrink-0 shadow-2xs disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isUploading ? 'Uploading...' : 'Upload From System'}</span>
            </button>

            {/* Choose from Media Library Button */}
            <button
              type="button"
              disabled={isUploading}
              onClick={() => setMediaPickerOpen(true)}
              className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-2 shrink-0 shadow-2xs disabled:opacity-50"
            >
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span>Choose from Library</span>
            </button>

            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="px-3 py-2 border border-gray-200 hover:border-gray-400 text-gray-600 hover:text-black text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Media Picker Modal */}
          <MediaPickerModal
            isOpen={mediaPickerOpen}
            onClose={() => setMediaPickerOpen(false)}
            multiple={false}
            title={`Select ${label} from Media Library`}
            onSelect={(selected) => {
              if (selected[0]) {
                onChange(selected[0]);
              }
            }}
          />

          {/* Fallback Direct URL input */}
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
          />
        </div>
      </div>

      {(error || uploadError) && (
        <span className="text-rose-500 text-[11px] block">{error || uploadError}</span>
      )}
    </div>
  );
}
