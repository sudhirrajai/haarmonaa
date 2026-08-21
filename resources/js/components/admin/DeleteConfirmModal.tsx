import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  itemName?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  processing?: boolean;
  variant?: 'danger' | 'warning';
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Item?',
  itemName,
  message,
  confirmLabel = 'Delete Permanently',
  cancelLabel = 'Cancel',
  processing = false,
  variant = 'danger',
}) => {
  if (!isOpen) return null;

  const isWarning = variant === 'warning';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-md rounded-[10px] shadow-2xl p-6 z-10 space-y-4 animate-scale-in border border-gray-100">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0 ${
                isWarning ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-600'
              }`}
            >
              {isWarning ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <Trash2 className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 leading-tight">{title}</h3>
              {itemName && (
                <span className="text-xs text-gray-500 font-medium line-clamp-1 mt-0.5">
                  {itemName}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-900 rounded-[6px] hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Body */}
        <p className="text-xs text-gray-600 leading-relaxed">
          {message ||
            'Are you sure you want to delete this item? This action cannot be undone and will permanently remove all associated data.'}
        </p>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={processing}
            className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-black rounded-[8px] transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={processing}
            className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-[8px] text-white transition-all cursor-pointer shadow-xs disabled:opacity-50 ${
              isWarning
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-rose-600 hover:bg-rose-700'
            }`}
          >
            {processing ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
