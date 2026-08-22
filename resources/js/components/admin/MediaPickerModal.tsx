import React, { useState, useEffect, useRef } from 'react';
import {
  Image as ImageIcon,
  UploadCloud,
  Search,
  Check,
  X,
  Loader2,
  HardDrive,
  CheckSquare,
  Square,
  Layers,
  ArrowRight,
} from 'lucide-react';

export interface MediaItem {
  id: number;
  name: string;
  file_name: string;
  disk: string;
  mime_type: string;
  size: number;
  url: string;
  alt_text?: string | null;
  human_readable_size: string;
  full_url: string;
  created_at: string;
}

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (urls: string[]) => void;
  multiple?: boolean;
  title?: string;
  maxSelect?: number;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  multiple = false,
  title = 'Select Media from Library',
  maxSelect = 10,
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [focusedItem, setFocusedItem] = useState<MediaItem | null>(null);

  // Uploading state
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ESC Key listener to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Fetch media library items using dedicated JSON endpoint
  const fetchMedia = async (query = '') => {
    setLoading(true);
    try {
      const url = new URL('/admin/media/items', window.location.origin);
      if (query) {
        url.searchParams.set('search', query);
      }

      const response = await fetch(url.toString(), {
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      const data = await response.json();
      let items: MediaItem[] = [];

      if (Array.isArray(data.items)) {
        items = data.items;
      } else if (Array.isArray(data.media?.data)) {
        items = data.media.data;
      } else if (Array.isArray(data.media)) {
        items = data.media;
      } else if (Array.isArray(data.data)) {
        items = data.data;
      } else if (Array.isArray(data)) {
        items = data;
      }

      setMediaItems(items);
    } catch (err) {
      console.error('Failed to load media library', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedUrls([]);
      setFocusedItem(null);
      fetchMedia(search);
    }
  }, [isOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMedia(search);
  };

  const toggleSelect = (item: MediaItem) => {
    setFocusedItem(item);
    if (!multiple) {
      setSelectedUrls([item.url]);
      return;
    }

    if (selectedUrls.includes(item.url)) {
      setSelectedUrls(selectedUrls.filter((u) => u !== item.url));
    } else {
      if (selectedUrls.length >= maxSelect) {
        alert(`You can select at most ${maxSelect} images.`);
        return;
      }
      setSelectedUrls([...selectedUrls, item.url]);
    }
  };

  // Upload handler inside modal
  const handleUploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files[]', files[i]);
    }

    try {
      const csrfToken =
        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';

      const response = await fetch('/admin/media/upload', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          Accept: 'application/json',
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok && data.success && data.media) {
        const newUploaded: MediaItem[] = data.media;
        setMediaItems((prev) => [...newUploaded, ...prev]);

        // Auto select uploaded items
        const newUrls = newUploaded.map((m) => m.url);
        if (multiple) {
          setSelectedUrls((prev) => [...prev, ...newUrls].slice(0, maxSelect));
        } else {
          setSelectedUrls([newUrls[0]]);
        }
        setFocusedItem(newUploaded[0] || null);
        setActiveTab('library');
      } else {
        alert(data.message || 'Upload failed.');
      }
    } catch (err) {
      alert('Error uploading files.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleConfirm = () => {
    if (selectedUrls.length === 0) return;
    onSelect(selectedUrls);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in"
    >
      <div className="bg-white rounded-[16px] w-[96vw] max-w-6xl h-[90vh] max-h-[860px] shadow-2xl border border-gray-200/90 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-800">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900 tracking-tight">{title}</h3>
              <p className="text-[11px] text-gray-400">
                {multiple ? `Select up to ${maxSelect} images` : 'Choose 1 image'} for this product.{' '}
                <span className="text-gray-400 font-mono">(Press Esc to close)</span>
              </p>
            </div>
          </div>

          {/* Tab buttons */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('library')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'library'
                  ? 'bg-white text-black shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Media Library
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-white text-black shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Upload Files
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Content: Upload Zone */}
        {activeTab === 'upload' && (
          <div className="flex-1 p-8 sm:p-12 flex items-center justify-center bg-gray-50/50">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleUploadFiles(e.dataTransfer.files);
              }}
              className={`max-w-xl w-full bg-white rounded-2xl border-2 border-dashed p-10 sm:p-12 text-center transition-all shadow-xs ${
                dragOver ? 'border-[#d0473e] bg-rose-50/50 scale-[0.99]' : 'border-gray-300 hover:border-black'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                multiple={multiple}
                accept="image/*"
                onChange={(e) => handleUploadFiles(e.target.files)}
                className="hidden"
              />

              <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-700 shadow-2xs">
                {isUploading ? (
                  <Loader2 className="w-7 h-7 animate-spin text-black" />
                ) : (
                  <UploadCloud className="w-8 h-8 text-[#d0473e]" />
                )}
              </div>

              <h4 className="text-base font-bold text-gray-900 mb-1">
                {isUploading ? 'Uploading Image(s)...' : 'Drop images here to upload'}
              </h4>
              <p className="text-xs text-gray-500 mb-5">
                New uploads are instantly added to your store Media Library.
              </p>

              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#111111] hover:bg-[#d0473e] text-white rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                <span>Select Files From Computer</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab Content: Media Library Browser */}
        {activeTab === 'library' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-white">
            {/* Main Image Gallery */}
            <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-hidden border-b md:border-b-0 md:border-r border-gray-100">
              {/* Search Toolbar */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search media files..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-1.5 pl-8 pr-7 text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-black focus:bg-white transition-colors"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch('');
                        fetchMedia('');
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </form>

                <div className="text-[11px] font-bold text-gray-400">
                  {mediaItems.length} images available
                </div>
              </div>

              {/* Images Grid */}
              <div className="flex-1 overflow-y-auto pr-1">
                {loading ? (
                  <div className="h-64 flex flex-col items-center justify-center text-gray-400 space-y-2">
                    <Loader2 className="w-6 h-6 animate-spin text-black" />
                    <span className="text-xs font-semibold">Loading media gallery...</span>
                  </div>
                ) : mediaItems.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <ImageIcon className="w-10 h-10 text-gray-300" />
                    <p className="text-xs text-gray-500 font-medium">
                      No media files found. Switch to "Upload Files" tab to add images.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('upload')}
                      className="px-4 py-1.5 bg-black text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Upload Now
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
                    {mediaItems.map((item) => {
                      const isSelected = selectedUrls.includes(item.url);
                      const isFocused = focusedItem?.id === item.id;

                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleSelect(item)}
                          className={`aspect-square rounded-[12px] border overflow-hidden cursor-pointer relative group transition-all duration-150 ${
                            isSelected
                              ? 'border-black ring-3 ring-black/25 scale-[0.97] shadow-md'
                              : isFocused
                              ? 'border-black/60 shadow-xs'
                              : 'border-gray-200 hover:border-gray-400 hover:shadow-xs'
                          }`}
                        >
                          <img
                            src={item.url}
                            alt={item.alt_text || item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            loading="lazy"
                          />

                          {/* Selected badge checkmark */}
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center shadow-md">
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            </div>
                          )}

                          {/* Hover tooltip bar */}
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-[10px] font-bold truncate leading-tight">{item.name}</p>
                            <p className="text-[9px] text-gray-300 font-mono">{item.human_readable_size}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar: Selected Attachment Details */}
            {focusedItem && (
              <div className="w-full md:w-72 bg-gray-50/80 p-5 flex flex-col justify-between overflow-y-auto shrink-0 border-t md:border-t-0 animate-in slide-in-from-right-4 duration-200">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                      Attachment Details
                    </h5>
                    <button
                      type="button"
                      onClick={() => setFocusedItem(null)}
                      className="p-1 text-gray-400 hover:text-black rounded-md"
                      title="Hide Details"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="aspect-square bg-white rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center p-2 shadow-2xs">
                    <img
                      src={focusedItem.url}
                      alt={focusedItem.name}
                      className="max-h-full max-w-full object-contain rounded-lg"
                    />
                  </div>

                  <div className="space-y-1.5 text-[11.5px] text-gray-600 bg-white p-3 rounded-xl border border-gray-200/80">
                    <p className="font-bold text-gray-900 truncate" title={focusedItem.name}>
                      {focusedItem.name}
                    </p>
                    <p className="text-gray-400 font-mono text-[10px] break-all">{focusedItem.file_name}</p>
                    <div className="pt-1 flex justify-between border-t border-gray-100 text-[11px]">
                      <span className="text-gray-400">File size:</span>
                      <span className="font-bold text-gray-800">{focusedItem.human_readable_size}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold text-gray-900">
              {selectedUrls.length} image{selectedUrls.length === 1 ? '' : 's'} selected
            </span>

            {selectedUrls.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedUrls([])}
                className="text-[11px] font-semibold text-gray-500 hover:text-black underline cursor-pointer"
              >
                Clear Selection
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-[8px] text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={selectedUrls.length === 0}
              onClick={handleConfirm}
              className="inline-flex items-center gap-1.5 px-6 py-2 bg-[#111111] hover:bg-[#d0473e] text-white rounded-[8px] text-xs font-bold transition-all shadow-xs disabled:opacity-40 cursor-pointer"
            >
              <span>Insert Selected Media</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
