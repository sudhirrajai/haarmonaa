import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Clock, PackageCheck, Truck, CheckCircle2, XCircle } from 'lucide-react';

interface OrderStatusSelectProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
}

export const OrderStatusSelect: React.FC<OrderStatusSelectProps> = ({
  currentStatus,
  onStatusChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const statuses = [
    {
      id: 'pending',
      label: 'Pending',
      desc: 'Awaiting payment/verification',
      color: 'bg-purple-500',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: Clock,
    },
    {
      id: 'processing',
      label: 'Processing',
      desc: 'Being packed & prepared',
      color: 'bg-amber-500',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: PackageCheck,
    },
    {
      id: 'shipped',
      label: 'Shipped',
      desc: 'In transit with courier',
      color: 'bg-blue-500',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Truck,
    },
    {
      id: 'delivered',
      label: 'Delivered',
      desc: 'Successfully delivered to client',
      color: 'bg-emerald-500',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
    },
    {
      id: 'cancelled',
      label: 'Cancelled',
      desc: 'Order voided or refunded',
      color: 'bg-rose-500',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: XCircle,
    },
  ];

  const activeStatusObj = statuses.find((s) => s.id === currentStatus) || statuses[0];

  const handleSelect = (statusId: string) => {
    onStatusChange(statusId);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2.5 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-full text-xs font-bold text-gray-900 shadow-2xs transition-all cursor-pointer focus:outline-hidden focus:border-black"
      >
        <span className={`w-2 h-2 rounded-full ${activeStatusObj.color}`} />
        <span>{activeStatusObj.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-black' : ''
          }`}
        />
      </button>

      {/* Floating Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200/90 rounded-2xl shadow-xl z-50 p-1.5 space-y-1 animate-fade-in">
          <div className="px-3 py-1.5 border-b border-gray-100">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-gray-400">
              Update Order Status
            </span>
          </div>

          {statuses.map((status) => {
            const isSelected = status.id === currentStatus;
            const Icon = status.icon;
            return (
              <button
                key={status.id}
                type="button"
                onClick={() => handleSelect(status.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                  isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-900 leading-tight">
                      {status.label}
                    </span>
                    <span className="block text-[10.5px] text-gray-400 leading-tight">{status.desc}</span>
                  </div>
                </div>

                {isSelected && <Check className="w-4 h-4 text-black stroke-[3]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
