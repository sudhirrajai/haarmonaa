import React, { useState, useRef, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminPagination } from '@/components/admin/AdminPagination';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { CustomDropdown, DropdownOption } from '@/components/admin/CustomDropdown';
import {
  Image as ImageIcon,
  UploadCloud,
  Search,
  Grid,
  List as ListIcon,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Eye,
  X,
  FileText,
  Video,
  Layers,
  ArrowUpDown,
  Filter,
  CheckSquare,
  Square,
  HardDrive,
  Download,
  Edit2,
  Save,
  Loader2,
} from 'lucide-react';

interface MediaItem {
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

interface MediaIndexProps {
  media: {
    data: MediaItem[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
  };
  filters: {
    search: string;
    type: string;
    sort: string;
    per_page: number;
    view?: 'grid' | 'list';
  };
  stats: {
    total_count: number;
    total_size: string;
  };
}

export default function Index({ media, filters, stats }: MediaIndexProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(filters.view || 'grid');
  const [search, setSearch] = useState(filters.search || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [dragOver, setDragOver] = useState(false);
  const [showUploadZone, setShowUploadZone] = useState(false);

  // Selection & Details State
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<number | string | null>(null);

  // Edit Alt / Title State
  const [editingTitle, setEditingTitle] = useState('');
  const [editingAlt, setEditingAlt] = useState('');
  const [isSavingDetails, setIsSavingDetails] = useState(false);

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MediaItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Copy Direct Link to Clipboard
  const handleCopyLink = (url: string, id: number | string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Copy All Selected Links
  const handleCopySelectedLinks = () => {
    const selectedItems = media.data.filter((item) => selectedIds.includes(item.id));
    const urls = selectedItems.map((item) => item.full_url).join(', ');
    navigator.clipboard.writeText(urls);
    setCopiedId('bulk');
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Search Filter change
  const handleFilterChange = (params: Partial<typeof filters>) => {
    router.get(
      '/admin/media',
      {
        ...filters,
        search,
        view: viewMode,
        ...params,
      },
      {
        preserveState: true,
        preserveScroll: true,
      }
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange({ search });
  };

  // File Upload Handler (Single / Multiple)
  const handleFilesUpload = async (files: FileList | null) => {
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
      if (response.ok && data.success) {
        // Refresh page to load new files
        router.reload({ preserveScroll: true });
        setShowUploadZone(false);
      } else {
        alert(data.message || 'Upload failed. Please verify file sizes and formats.');
      }
    } catch (err) {
      alert('Failed to upload files. Please check network connection.');
    } finally {
      setIsUploading(false);
      setUploadProgress({});
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Open Details Modal
  const openDetailsModal = (item: MediaItem) => {
    setActiveMedia(item);
    setEditingTitle(item.name);
    setEditingAlt(item.alt_text || '');
  };

  // Save Details
  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMedia) return;

    setIsSavingDetails(true);
    try {
      const csrfToken =
        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';

      const response = await fetch(`/admin/media/${activeMedia.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: editingTitle,
          alt_text: editingAlt,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setActiveMedia({
          ...activeMedia,
          name: editingTitle,
          alt_text: editingAlt,
        });
        router.reload({ preserveScroll: true });
      }
    } catch (err) {
      alert('Failed to update media details.');
    } finally {
      setIsSavingDetails(false);
    }
  };

  // Single Delete
  const confirmDelete = (item: MediaItem) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    router.delete(`/admin/media/${itemToDelete.id}`, {
      onFinish: () => {
        setIsDeleting(false);
        setDeleteModalOpen(false);
        setItemToDelete(null);
        if (activeMedia?.id === itemToDelete.id) {
          setActiveMedia(null);
        }
      },
    });
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to permanently delete ${selectedIds.length} selected media file(s)?`)) {
      return;
    }

    setIsBulkDeleting(true);
    router.post(
      '/admin/media/bulk-delete',
      { ids: selectedIds },
      {
        onFinish: () => {
          setIsBulkDeleting(false);
          setSelectedIds([]);
        },
      }
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === media.data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(media.data.map((m) => m.id));
    }
  };

  const toggleSelectItem = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const typeOptions: DropdownOption[] = [
    { value: 'all', label: 'All Media Items', icon: Layers },
    { value: 'image', label: 'Images Only', icon: ImageIcon },
    { value: 'video', label: 'Videos Only', icon: Video },
    { value: 'document', label: 'Documents / PDFs', icon: FileText },
  ];

  const sortOptions: DropdownOption[] = [
    { value: 'latest', label: 'Newest First', icon: ArrowUpDown },
    { value: 'oldest', label: 'Oldest First', icon: ArrowUpDown },
    { value: 'name_asc', label: 'Title (A – Z)' },
    { value: 'name_desc', label: 'Title (Z – A)' },
    { value: 'size_desc', label: 'File Size (Largest)' },
    { value: 'size_asc', label: 'File Size (Smallest)' },
  ];

  const perPageOptions: DropdownOption[] = [
    { value: 12, label: '12 / page' },
    { value: 24, label: '24 / page' },
    { value: 48, label: '48 / page' },
    { value: 96, label: '96 / page' },
  ];

  return (
    <AdminLayout title="Media Library">
      <Head title="Media Library — Admin Haarmonaa" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-1">
            <Link href="/admin" className="hover:text-black transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-gray-900">Media Library</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
            <span>Media Library</span>
            <span className="text-xs font-bold px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-full border border-gray-200">
              {stats.total_count} files
            </span>
          </h1>
          <p className="text-xs sm:text-[13px] text-gray-500 mt-0.5">
            Batch upload product imagery, copy direct URLs for CSV product import, and manage visual digital assets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowUploadZone(!showUploadZone)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111111] hover:bg-[#d0473e] text-white rounded-[10px] text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 text-amber-300" />
            <span>{showUploadZone ? 'Close Uploader' : 'Add New Media'}</span>
          </button>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      {(showUploadZone || dragOver) && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFilesUpload(e.dataTransfer.files);
          }}
          className={`bg-white rounded-[12px] border-2 border-dashed p-8 sm:p-12 text-center transition-all ${
            dragOver
              ? 'border-[#d0473e] bg-rose-50/50 scale-[0.99]'
              : 'border-gray-300 hover:border-black'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*,video/*,application/pdf"
            onChange={(e) => handleFilesUpload(e.target.files)}
            className="hidden"
          />

          <div className="max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center mx-auto text-gray-700 shadow-2xs">
              {isUploading ? (
                <Loader2 className="w-6 h-6 animate-spin text-black" />
              ) : (
                <UploadCloud className="w-7 h-7 text-[#d0473e]" />
              )}
            </div>

            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                {isUploading ? 'Uploading Files...' : 'Drop files anywhere to upload'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Supports PNG, JPG, WEBP, GIF, SVG, MP4 up to 20MB per file.
              </p>
            </div>

            <div>
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
        </div>
      )}

      {/* Floating / Pinned Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-[#111111] text-white p-4 rounded-[10px] shadow-lg flex flex-wrap items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold px-2.5 py-1 bg-white/20 rounded-full">
              {selectedIds.length} item(s) selected
            </span>

            <button
              type="button"
              onClick={toggleSelectAll}
              className="text-xs text-gray-300 hover:text-white underline cursor-pointer"
            >
              {selectedIds.length === media.data.length ? 'Deselect All' : 'Select All On Page'}
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopySelectedLinks}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-[8px] text-xs font-bold transition-colors cursor-pointer"
            >
              {copiedId === 'bulk' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied All URLs!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy All URLs (CSV Ready)</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isBulkDeleting}
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-[8px] text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isBulkDeleting ? 'Deleting...' : 'Delete Selected'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Controls Bar: Search, MIME Filters, Sorting, View Modes */}
      <div className="bg-white p-3.5 rounded-[10px] border border-gray-200/80 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Left: Filters & Search */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 p-1 rounded-[8px] border border-gray-200/60">
            <button
              type="button"
              onClick={() => {
                setViewMode('grid');
                handleFilterChange({ view: 'grid' });
              }}
              className={`p-1.5 rounded-[6px] transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-black shadow-xs' : 'text-gray-500 hover:text-black'
              }`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => {
                setViewMode('list');
                handleFilterChange({ view: 'list' });
              }}
              className={`p-1.5 rounded-[6px] transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-black shadow-xs' : 'text-gray-500 hover:text-black'
              }`}
              title="List View"
            >
              <ListIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Custom Type Filter Dropdown */}
          <CustomDropdown
            value={filters.type || 'all'}
            options={typeOptions}
            onChange={(type) => handleFilterChange({ type })}
            menuWidth="w-48"
          />

          {/* Custom Sort Filter Dropdown */}
          <CustomDropdown
            value={filters.sort || 'latest'}
            options={sortOptions}
            onChange={(sort) => handleFilterChange({ sort })}
            icon={ArrowUpDown}
            menuWidth="w-48"
          />

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by file name..."
              className="w-full bg-white border border-gray-200/90 rounded-[8px] py-1.5 pl-8 pr-7 text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-black focus:ring-2 focus:ring-black/10 transition-all shadow-2xs"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  handleFilterChange({ search: '' });
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black p-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </form>
        </div>

        {/* Right: Storage Stats & Per Page Dropdown */}
        <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
            <HardDrive className="w-3.5 h-3.5 text-gray-400" />
            <span>Total Storage: <strong className="text-gray-900">{stats.total_size}</strong></span>
          </div>

          <CustomDropdown
            value={filters.per_page || 24}
            options={perPageOptions}
            onChange={(per_page) => handleFilterChange({ per_page: Number(per_page) })}
            align="right"
            menuWidth="w-32"
          />
        </div>
      </div>

      {/* Empty State */}
      {media.data.length === 0 ? (
        <div className="bg-white rounded-[10px] border border-gray-200/80 p-12 text-center space-y-4 shadow-2xs">
          <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center mx-auto text-gray-400">
            <ImageIcon className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-gray-900">No Media Files Found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Upload product photos, campaign banners, and jewelry mockups to easily generate direct links.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowUploadZone(true)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-black hover:bg-[#d0473e] text-white rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Your First File</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.data.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            const isImage = item.mime_type.startsWith('image/');
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-[10px] border overflow-hidden transition-all duration-200 shadow-2xs group relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-black ring-2 ring-black/20 bg-gray-50'
                    : 'border-gray-200/90 hover:border-black/50 hover:shadow-sm'
                }`}
              >
                {/* Selection Checkbox */}
                <button
                  type="button"
                  onClick={() => toggleSelectItem(item.id)}
                  className="absolute top-2 left-2 z-10 p-1 bg-white/90 backdrop-blur-xs rounded-[6px] text-gray-800 shadow-2xs hover:scale-105 transition-transform cursor-pointer"
                >
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-black fill-white" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-400 group-hover:text-black" />
                  )}
                </button>

                {/* Thumbnail Preview */}
                <div
                  onClick={() => openDetailsModal(item)}
                  className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer relative"
                >
                  {isImage ? (
                    <img
                      src={item.url}
                      alt={item.alt_text || item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : item.mime_type.startsWith('video/') ? (
                    <div className="text-center p-4 text-gray-500">
                      <Video className="w-8 h-8 mx-auto mb-1 text-gray-400" />
                      <span className="text-[10px] font-mono uppercase">VIDEO</span>
                    </div>
                  ) : (
                    <div className="text-center p-4 text-gray-500">
                      <FileText className="w-8 h-8 mx-auto mb-1 text-gray-400" />
                      <span className="text-[10px] font-mono uppercase">DOC</span>
                    </div>
                  )}

                  {/* Hover Overlay Actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyLink(item.full_url, item.id);
                      }}
                      className="p-2 bg-white text-gray-900 rounded-full hover:bg-emerald-500 hover:text-white transition-colors shadow-md"
                      title="Copy Direct URL"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetailsModal(item);
                      }}
                      className="p-2 bg-white text-gray-900 rounded-full hover:bg-black hover:text-white transition-colors shadow-md"
                      title="Inspect Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Bottom Info Card */}
                <div className="p-2.5 bg-white border-t border-gray-100 space-y-1">
                  <p
                    className="text-[11px] font-bold text-gray-900 truncate"
                    title={item.name}
                  >
                    {item.name}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <span>{item.human_readable_size}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyLink(item.full_url, item.id)}
                      className="text-[10px] font-bold text-gray-600 hover:text-black transition-colors cursor-pointer"
                    >
                      {isCopied ? 'Copied!' : 'Copy Link'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white rounded-[10px] border border-gray-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-extrabold uppercase tracking-wider text-[10.5px]">
                <tr>
                  <th className="p-4 w-10">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="p-0.5 text-gray-500 hover:text-black cursor-pointer"
                    >
                      {selectedIds.length === media.data.length && media.data.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-black" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="p-4">Asset</th>
                  <th className="p-4">File Name</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Size</th>
                  <th className="p-4">Direct URL</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {media.data.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  const isCopied = copiedId === item.id;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50/80 transition-colors ${
                        isSelected ? 'bg-gray-50/90' : ''
                      }`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectItem(item.id)}
                          className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                        />
                      </td>

                      {/* Thumbnail */}
                      <td className="p-4">
                        <div
                          onClick={() => openDetailsModal(item)}
                          className="w-12 h-12 rounded-[8px] bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center cursor-pointer shrink-0"
                        >
                          {item.mime_type.startsWith('image/') ? (
                            <img
                              src={item.url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FileText className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </td>

                      {/* Title */}
                      <td className="p-4 font-bold text-gray-900">
                        <button
                          type="button"
                          onClick={() => openDetailsModal(item)}
                          className="hover:text-[#d0473e] text-left block"
                        >
                          {item.name}
                        </button>
                        <span className="text-[10.5px] font-mono text-gray-400 block font-normal">
                          {item.file_name}
                        </span>
                      </td>

                      {/* MIME */}
                      <td className="p-4 font-mono text-[11px] text-gray-500">
                        {item.mime_type}
                      </td>

                      {/* Size */}
                      <td className="p-4 text-gray-600 font-medium">
                        {item.human_readable_size}
                      </td>

                      {/* Direct URL with Copy Button */}
                      <td className="p-4">
                        <div className="flex items-center gap-2 max-w-xs">
                          <input
                            type="text"
                            readOnly
                            value={item.full_url}
                            className="bg-gray-50 border border-gray-200 rounded-[6px] py-1 px-2 text-[11px] font-mono text-gray-600 w-full truncate focus:outline-hidden"
                          />
                          <button
                            type="button"
                            onClick={() => handleCopyLink(item.full_url, item.id)}
                            className="p-1.5 bg-gray-100 hover:bg-black hover:text-white rounded-[6px] transition-colors shrink-0 cursor-pointer"
                            title="Copy URL"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openDetailsModal(item)}
                            className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-[6px] transition-colors"
                            title="Inspect Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => confirmDelete(item)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-[6px] transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {media.last_page > 1 && (
        <AdminPagination
          currentPage={media.current_page}
          lastPage={media.last_page}
          total={media.total}
          perPage={media.per_page}
          onPageChange={(page) => handleFilterChange({ page })}
          onPerPageChange={(per_page) => handleFilterChange({ per_page, page: 1 })}
        />
      )}

      {/* Media Details Drawer / Modal */}
      {activeMedia && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-[16px] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200/80 flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-gray-800" />
                <h3 className="text-base font-extrabold text-gray-900">Attachment Details</h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveMedia(null)}
                className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: 2 Columns */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 flex-1">
              {/* Left Column: Big Image Preview (7 Cols) */}
              <div className="md:col-span-7 bg-gray-50 rounded-[12px] border border-gray-200/70 p-4 flex flex-col items-center justify-center min-h-[280px]">
                {activeMedia.mime_type.startsWith('image/') ? (
                  <img
                    src={activeMedia.url}
                    alt={activeMedia.alt_text || activeMedia.name}
                    className="max-h-[380px] w-auto max-w-full object-contain rounded-[8px] shadow-xs"
                  />
                ) : (
                  <div className="text-center space-y-2">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto" />
                    <p className="text-xs font-bold text-gray-600">{activeMedia.file_name}</p>
                  </div>
                )}
              </div>

              {/* Right Column: Metadata & Copy URL Form (5 Cols) */}
              <div className="md:col-span-5 space-y-5">
                {/* Meta details list */}
                <div className="space-y-1.5 text-[11.5px] text-gray-600 bg-gray-50/70 p-3.5 rounded-[10px] border border-gray-200/60">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-500">File size:</span>
                    <span className="font-bold text-gray-900">{activeMedia.human_readable_size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-500">File type:</span>
                    <span className="font-mono text-gray-800">{activeMedia.mime_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-500">Storage disk:</span>
                    <span className="font-mono text-gray-800">{activeMedia.disk}</span>
                  </div>
                </div>

                {/* Direct Copy URL (Essential for CSV imports) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-gray-900">
                    Direct File URL (For CSV Import)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={activeMedia.full_url}
                      className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2 px-3 text-xs font-mono text-gray-800 select-all focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopyLink(activeMedia.full_url, 'modal')}
                      className="px-4 py-2 bg-[#111111] hover:bg-[#d0473e] text-white rounded-[8px] text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      {copiedId === 'modal' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Edit Form: Title & Alt Text */}
                <form onSubmit={handleSaveDetails} className="space-y-3 pt-2 border-t border-gray-100">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Attachment Title
                    </label>
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-[8px] py-1.5 px-3 text-xs text-gray-900 font-bold focus:outline-hidden focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Alt Text (SEO & Accessibility)
                    </label>
                    <input
                      type="text"
                      value={editingAlt}
                      onChange={(e) => setEditingAlt(e.target.value)}
                      placeholder="Describe image for search engines..."
                      className="w-full bg-white border border-gray-200 rounded-[8px] py-1.5 px-3 text-xs text-gray-800 focus:outline-hidden focus:border-black"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="submit"
                      disabled={isSavingDetails}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-[8px] text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSavingDetails ? 'Saving...' : 'Update Details'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => confirmDelete(activeMedia)}
                      className="text-xs font-bold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
                    >
                      Delete Permanently
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Permanently Delete Media File"
        message={`Are you sure you want to permanently delete "${itemToDelete?.name}"? Any products using this direct URL may display broken image links.`}
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete File'}
        onConfirm={handleDelete}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
      />
    </AdminLayout>
  );
}
