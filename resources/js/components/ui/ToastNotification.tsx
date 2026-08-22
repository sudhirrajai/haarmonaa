import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';

interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
}

export const ToastNotification: React.FC = () => {
  const { props } = usePage();
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const flash = (props.flash as {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
    message?: string;
    status?: string;
  }) || {};

  const errors = (props.errors as Record<string, string>) || {};

  // Monitor incoming flash messages and errors
  useEffect(() => {
    const newToasts: ToastItem[] = [];
    const timestamp = Date.now();

    if (flash.success) {
      newToasts.push({
        id: `success-${timestamp}`,
        type: 'success',
        title: 'Success',
        message: flash.success,
      });
    }

    if (flash.status) {
      newToasts.push({
        id: `status-${timestamp}`,
        type: 'success',
        title: 'Status Update',
        message: flash.status,
      });
    }

    if (flash.error) {
      newToasts.push({
        id: `error-${timestamp}`,
        type: 'error',
        title: 'Error Occurred',
        message: flash.error,
      });
    }

    if (flash.warning) {
      newToasts.push({
        id: `warning-${timestamp}`,
        type: 'warning',
        title: 'Notice',
        message: flash.warning,
      });
    }

    if (flash.info || flash.message) {
      newToasts.push({
        id: `info-${timestamp}`,
        type: 'info',
        title: 'Information',
        message: flash.info || flash.message || '',
      });
    }

    // Capture validation errors if any field failed
    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0 && !flash.error) {
      const errorMsg =
        errorKeys.length === 1
          ? errors[errorKeys[0]]
          : `Please correct the ${errorKeys.length} highlighted error(s) in the form.`;
      newToasts.push({
        id: `validation-${timestamp}`,
        type: 'error',
        title: 'Validation Error',
        message: errorMsg,
      });
    }

    if (newToasts.length > 0) {
      setToasts((prev) => [...prev, ...newToasts]);
    }
  }, [flash.success, flash.error, flash.warning, flash.info, flash.message, flash.status, props.errors]);

  // Auto dismiss toasts after 5 seconds
  useEffect(() => {
    if (toasts.length === 0) return;

    const timer = setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 5000);

    return () => clearTimeout(timer);
  }, [toasts]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-2xl border flex items-start gap-3 transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-top-4 backdrop-blur-md ${
              isSuccess
                ? 'bg-[#111111]/95 border-emerald-500/40 text-white'
                : isError
                ? 'bg-[#181111]/95 border-rose-500/50 text-white'
                : isWarning
                ? 'bg-[#16140e]/95 border-amber-500/50 text-white'
                : 'bg-[#111418]/95 border-blue-500/50 text-white'
            }`}
          >
            {/* Icon */}
            <div className="pt-0.5 shrink-0">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-blue-400" />}
            </div>

            {/* Content */}
            <div className="flex-1 space-y-0.5 pr-2">
              {toast.title && (
                <h4
                  className={`text-xs font-extrabold tracking-tight ${
                    isSuccess
                      ? 'text-emerald-400'
                      : isError
                      ? 'text-rose-400'
                      : isWarning
                      ? 'text-amber-400'
                      : 'text-blue-400'
                  }`}
                >
                  {toast.title}
                </h4>
              )}
              <p className="text-xs text-gray-200 leading-relaxed font-medium">
                {toast.message}
              </p>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
