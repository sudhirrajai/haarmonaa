import React, { useState, useRef, useEffect } from 'react';
import {
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  ArrowRight,
  ArrowLeft,
  FileCheck,
  Layers,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { router } from '@inertiajs/react';

interface ProductImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface PreviewRow {
  _row_number: number;
  _errors: string[];
  _is_valid: boolean;
  name?: string;
  category?: string;
  collections?: string;
  price?: string;
  original_price?: string;
  images?: string;
  stock_quantity?: string;
  status?: string;
  [key: string]: any;
}

export const ProductImportModal: React.FC<ProductImportModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'summary'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [updateExisting, setUpdateExisting] = useState(true);
  const [defaultStatus, setDefaultStatus] = useState<'published' | 'draft'>('published');

  // Preview data
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState<{
    headers: string[];
    total_rows: number;
    preview_rows: PreviewRow[];
    error_count: number;
    sample_errors: string[];
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Result data
  const [importResult, setImportResult] = useState<{
    created_count: number;
    updated_count: number;
    skipped_count: number;
    errors: string[];
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (step !== 'importing') {
          handleClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, step]);

  const handleClose = () => {
    setStep('upload');
    setFile(null);
    setPreviewData(null);
    setErrorMessage(null);
    setImportResult(null);
    onClose();
  };

  // Handle file select and trigger preview
  const handleFileChange = async (selectedFile: File) => {
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.txt')) {
      setErrorMessage('Please upload a valid CSV file (.csv).');
      return;
    }

    setFile(selectedFile);
    setErrorMessage(null);
    setPreviewLoading(true);

    const formData = new FormData();
    formData.append('csv_file', selectedFile);

    try {
      const csrfToken =
        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';

      const response = await fetch('/admin/products/import/preview', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          Accept: 'application/json',
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPreviewData(data);
        setStep('preview');
      } else {
        setErrorMessage(data.message || 'Failed to parse CSV file.');
      }
    } catch (err: any) {
      setErrorMessage('Error reading CSV file. Please check file format.');
    } finally {
      setPreviewLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Execute import
  const handleExecuteImport = async () => {
    if (!file) return;

    setStep('importing');
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('csv_file', file);
    formData.append('update_existing', updateExisting ? '1' : '0');
    formData.append('default_status', defaultStatus);

    try {
      const csrfToken =
        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';

      const response = await fetch('/admin/products/import/execute', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          Accept: 'application/json',
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setImportResult(data);
        setStep('summary');
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(data.message || 'CSV Import failed.');
        setStep('preview');
      }
    } catch (err: any) {
      setErrorMessage('A network error occurred while executing import.');
      setStep('preview');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && step !== 'importing') {
          handleClose();
        }
      }}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in"
    >
      <div className="bg-white rounded-[16px] w-[95vw] max-w-4xl max-h-[90vh] shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900 tracking-tight">
                Import Products via CSV
              </h3>
              <p className="text-[11.5px] text-gray-500">
                Bulk upload jewelry products with image URLs from the Media Library.
              </p>
            </div>
          </div>

          {step !== 'importing' && (
            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {/* STEP 1: Upload CSV & Options */}
          {step === 'upload' && (
            <div className="space-y-6">
              {/* Sample Template Download Card */}
              <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                    CSV
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-950">
                      Need the standard CSV structure?
                    </h4>
                    <p className="text-[11px] text-amber-800/80">
                      Download our pre-formatted template with sample jewelry rows and column guides.
                    </p>
                  </div>
                </div>

                <a
                  href="/admin/products/import/template"
                  download="haarmonaa-products-import-template.csv"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-amber-100/60 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Sample Template</span>
                </a>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const droppedFile = e.dataTransfer.files?.[0];
                  if (droppedFile) handleFileChange(droppedFile);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer ${
                  dragOver
                    ? 'border-emerald-600 bg-emerald-50/50 scale-[0.99]'
                    : 'border-gray-300 hover:border-gray-400 bg-gray-50/60 hover:bg-white'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv,text/csv"
                  onChange={(e) => {
                    const selected = e.target.files?.[0];
                    if (selected) handleFileChange(selected);
                  }}
                  className="hidden"
                />

                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-gray-200 flex items-center justify-center text-emerald-600">
                    {previewLoading ? (
                      <Loader2 className="w-7 h-7 animate-spin text-emerald-600" />
                    ) : (
                      <Upload className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-gray-900 block">
                      {previewLoading ? 'Analyzing CSV rows...' : 'Choose a CSV file or drag it here'}
                    </span>
                    <span className="text-xs text-gray-500 block mt-1">
                      Supports comma-separated UTF-8 CSV files up to 10MB
                    </span>
                  </div>
                </div>
              </div>

              {/* Import Options Configuration */}
              <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-4.5 space-y-3">
                <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Import Settings
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={updateExisting}
                      onChange={(e) => setUpdateExisting(e.target.checked)}
                      className="mt-0.5 rounded text-black focus:ring-black"
                    />
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">
                        Update Existing Products
                      </span>
                      <span className="text-[11px] text-gray-500">
                        If a product with matching title or slug already exists, update its details.
                      </span>
                    </div>
                  </label>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-900 block">
                      Default Product Status
                    </label>
                    <select
                      value={defaultStatus}
                      onChange={(e) => setDefaultStatus(e.target.value as any)}
                      className="w-full bg-white border border-gray-200 rounded-xl py-1.5 px-3 text-xs text-gray-800 font-medium focus:outline-hidden focus:border-black"
                    >
                      <option value="published">Published (Visible in store)</option>
                      <option value="draft">Draft (Hidden from store)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Live Data Preview */}
          {step === 'preview' && previewData && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 bg-gray-50 border border-gray-200 rounded-2xl">
                <div className="flex items-center gap-2.5">
                  <FileCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">
                      {file?.name} ({previewData.total_rows} total rows detected)
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Showing preview of first {previewData.preview_rows.length} rows
                    </span>
                  </div>
                </div>

                {previewData.error_count > 0 && (
                  <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold rounded-lg shrink-0">
                    {previewData.error_count} row(s) have warnings
                  </span>
                )}
              </div>

              {/* Data Preview Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden overflow-x-auto max-h-[340px]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100 text-gray-700 font-bold border-b border-gray-200 uppercase text-[10px] tracking-wider sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Product Name</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Price</th>
                      <th className="py-2.5 px-3">MRP</th>
                      <th className="py-2.5 px-3">Collections</th>
                      <th className="py-2.5 px-3">Images</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {previewData.preview_rows.map((row) => (
                      <tr
                        key={row._row_number}
                        className={!row._is_valid ? 'bg-rose-50/50' : 'hover:bg-gray-50/60'}
                      >
                        <td className="py-2.5 px-3 font-mono text-gray-400 font-medium">
                          {row._row_number}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-gray-900 max-w-xs truncate">
                          {row.name || (
                            <span className="text-rose-500 italic font-normal">Missing Name</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-gray-600">{row.category || '—'}</td>
                        <td className="py-2.5 px-3 font-bold text-gray-900">
                          {row.price ? (
                            `₹${row.price}`
                          ) : (
                            <span className="text-rose-500 italic">Invalid</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-gray-400">
                          {row.original_price ? `₹${row.original_price}` : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-gray-500 max-w-[140px] truncate">
                          {row.collections || '—'}
                        </td>
                        <td className="py-2.5 px-3 text-gray-600">
                          {row.images ? (
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-semibold text-[10.5px]">
                              {row.images.split(/[,|]/).filter(Boolean).length} URLs
                            </span>
                          ) : (
                            <span className="text-gray-400">No Image</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          {row._is_valid ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Ready</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-[11px]">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>{row._errors[0]}</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STEP 3: Importing Spinner */}
          {step === 'importing' && (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <h4 className="text-base font-extrabold text-gray-900">
                Importing Products to Database...
              </h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Please wait while we process categories, collections, product images, and pricing.
              </p>
            </div>
          )}

          {/* STEP 4: Summary Result */}
          {step === 'summary' && importResult && (
            <div className="space-y-6 py-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="text-center">
                <h4 className="text-lg font-extrabold text-gray-900">
                  Import Process Completed!
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  Your products have been synchronized and are available in your catalog.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
                  <span className="text-2xl font-black text-emerald-700 block">
                    {importResult.created_count}
                  </span>
                  <span className="text-xs font-bold text-emerald-900 mt-0.5 block">
                    Created
                  </span>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
                  <span className="text-2xl font-black text-blue-700 block">
                    {importResult.updated_count}
                  </span>
                  <span className="text-xs font-bold text-blue-900 mt-0.5 block">
                    Updated
                  </span>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center">
                  <span className="text-2xl font-black text-gray-600 block">
                    {importResult.skipped_count}
                  </span>
                  <span className="text-xs font-bold text-gray-700 mt-0.5 block">
                    Skipped
                  </span>
                </div>
              </div>

              {importResult.errors.length > 0 && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 max-h-36 overflow-y-auto text-xs text-rose-800 space-y-1">
                  <span className="font-bold block">Skipped Lines / Warnings:</span>
                  {importResult.errors.map((err, idx) => (
                    <p key={idx} className="font-mono text-[11px]">
                      • {err}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200/80 flex items-center justify-between shrink-0">
          {step === 'upload' && (
            <>
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-[8px] text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-6 py-2 bg-[#111111] hover:bg-black text-white rounded-[8px] text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Select CSV File</span>
              </button>
            </>
          )}

          {step === 'preview' && (
            <>
              <button
                type="button"
                onClick={() => setStep('upload')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-[8px] text-xs font-bold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Choose Different File</span>
              </button>

              <button
                type="button"
                onClick={handleExecuteImport}
                className="inline-flex items-center gap-1.5 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[8px] text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Execute Import ({previewData?.total_rows} Products)</span>
              </button>
            </>
          )}

          {step === 'summary' && (
            <div className="w-full flex justify-end">
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  router.reload();
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#111111] hover:bg-black text-white rounded-[8px] text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Done & Refresh Products</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
