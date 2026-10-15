'use client';

import React from 'react';
import { PastOrder, OrderStatus } from '@/types';
import {
  Bike,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Phone,
  ExternalLink,
  ShieldAlert,
  Flame,
  ChefHat,
  PackageCheck,
  Building,
  Home,
  Check,
  Sparkles,
} from 'lucide-react';

interface DeliveryStatusTrackerProps {
  order: PastOrder;
  compact?: boolean;
}

export default function DeliveryStatusTracker({ order, compact = false }: DeliveryStatusTrackerProps) {
  const { status, rider, deliveryMode, estimatedDeliveryWindow, estimatedMinutesAway, failedReason, cancellationReason, deliveryInstructions } = order;

  // Status mapping to 5 visual steps:
  // Step 1: Confirmed
  // Step 2: Preparing
  // Step 3: Packed & Ready / Assigned
  // Step 4: Out for Delivery
  // Step 5: Delivered
  const getStepProgress = (s: OrderStatus): number => {
    switch (s) {
      case 'Scheduled':
      case 'Confirmed':
      case 'Accepted':
        return 1;
      case 'Preparing':
        return 2;
      case 'Ready':
      case 'Assigned':
        return 3;
      case 'Picked Up':
      case 'Out for Delivery':
        return 4;
      case 'Delivered':
        return 5;
      case 'Failed':
      case 'Cancelled':
        return -1;
      default:
        return 1;
    }
  };

  const stepProgress = getStepProgress(status);

  const steps = [
    { label: 'Confirmed', desc: 'Order received', icon: CheckCircle2 },
    { label: 'Cooking', desc: 'Fresh in kitchen', icon: Flame },
    { label: 'Packed', desc: 'Ready for runner', icon: PackageCheck },
    { label: 'On The Way', desc: 'Out for delivery', icon: Bike },
    { label: 'Delivered', desc: 'At your door/desk', icon: Check },
  ];

  // Special State: Delivery Failed
  if (status === 'Failed') {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-orange-50/60 border border-rose-200 p-4 sm:p-5 space-y-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-rose-100 text-rose-700 flex-shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-rose-900 text-sm">Delivery Attempt Failed</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-800 uppercase">
                Action Taken
              </span>
            </div>
            <p className="text-xs text-rose-800 font-medium leading-relaxed">
              {failedReason || 'Delivery partner could not complete the drop-off due to gate access or customer unavailability.'}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-rose-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-rose-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span className="font-semibold">
              Rozzo Guarantee: 100% rollover meal credit applied to your plan. No meal deducted.
            </span>
          </div>

          {rider && (
            <a
              href={`tel:${rider.phone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white text-rose-800 font-bold border border-rose-300 hover:bg-rose-50 transition-colors shadow-xs self-start sm:self-auto"
            >
              <Phone className="w-3 h-3 text-rose-600" />
              <span>Call Rider ({rider.name.split(' ')[0]})</span>
            </a>
          )}
        </div>
      </div>
    );
  }

  // Special State: Cancelled
  if (status === 'Cancelled') {
    return (
      <div className="rounded-2xl bg-stone-50 border border-stone-200 p-4 space-y-2">
        <div className="flex items-center gap-2 text-stone-700 font-bold text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Meal Cancelled</span>
        </div>
        <p className="text-xs text-stone-500 leading-relaxed">
          {cancellationReason || 'This meal was cancelled before the preparation cutoff. Subscription balance preserved.'}
        </p>
      </div>
    );
  }

  // Active / Normal Delivery Tracking
  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#FAF8F3] to-[#F5EFE6] border border-[#E8DFC8] p-4 sm:p-5 space-y-4">
      {/* Live Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs ${
              status === 'Delivered'
                ? 'bg-brand-600 text-white'
                : status === 'Out for Delivery' || status === 'Picked Up'
                ? 'bg-brand-600 text-white animate-pulse'
                : 'bg-amber-500 text-white'
            }`}
          >
            {status === 'Delivered' ? (
              <Check className="w-5 h-5" />
            ) : status === 'Out for Delivery' || status === 'Picked Up' ? (
              <Bike className="w-5 h-5" />
            ) : (
              <ChefHat className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-stone-900">
                {status === 'Delivered'
                  ? 'Meal Delivered Successfully'
                  : status === 'Out for Delivery'
                  ? 'Hot Dabba Out for Delivery!'
                  : status === 'Picked Up'
                  ? 'Picked Up by Delivery Partner'
                  : status === 'Assigned' || status === 'Ready'
                  ? 'Dabba Ready • Runner Assigned'
                  : status === 'Preparing'
                  ? 'Cooking Fresh in Kitchen'
                  : 'Order Confirmed for Kitchen'}
              </span>

              {/* Delivery Fleet Mode Badge */}
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  deliveryMode === 'platform-managed'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {deliveryMode === 'platform-managed' ? 'Rozzo Green Fleet' : 'Kitchen Express'}
              </span>
            </div>

            {/* Live ETA or Delivery Window */}
            {status !== 'Delivered' && (
              <div className="flex items-center gap-2 text-xs text-stone-600 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-brand-700 flex-shrink-0" />
                <span className="font-semibold text-stone-800">
                  {estimatedDeliveryWindow || '12:30 PM - 1:45 PM'}
                </span>
                {estimatedMinutesAway !== undefined && estimatedMinutesAway > 0 && (
                  <span className="px-2 py-0.2 rounded-full bg-brand-100 text-brand-800 font-extrabold text-[11px] animate-pulse">
                    ~{estimatedMinutesAway} mins away
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* External Map Navigation Link */}
        {order.mapQueryUrl && (
          <a
            href={order.mapQueryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-cream-100 text-stone-700 border border-[#DED4BE] text-xs font-semibold transition-colors shadow-xs"
          >
            <MapPin className="w-3.5 h-3.5 text-brand-700" />
            <span>View Map Route</span>
            <ExternalLink className="w-3 h-3 text-stone-400" />
          </a>
        )}
      </div>

      {/* Visual Step Progress Bar */}
      <div className="pt-2">
        <div className="grid grid-cols-5 gap-1 sm:gap-2 relative">
          {steps.map((step, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepProgress >= stepNum;
            const isCurrent = stepProgress === stepNum;

            return (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                    isCompleted
                      ? 'bg-brand-600 text-white'
                      : 'bg-stone-200 text-stone-400'
                  } ${isCurrent ? 'ring-4 ring-brand-200/80 scale-105' : ''}`}
                >
                  <step.icon className="w-3.5 h-3.5" />
                </div>
                <span
                  className={`text-[10px] sm:text-xs mt-1.5 line-clamp-1 font-bold ${
                    isCurrent
                      ? 'text-brand-800 font-black'
                      : isCompleted
                      ? 'text-stone-800'
                      : 'text-stone-400'
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-[9px] text-stone-400 hidden sm:block">
                  {step.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assigned Runner Card (When Runner is assigned) */}
      {rider && status !== 'Delivered' && (
        <div className="p-3.5 rounded-2xl bg-white/90 border border-[#E3D7C1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white font-extrabold text-sm shadow-xs flex-shrink-0">
              {rider.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs sm:text-sm text-stone-900">
                  {rider.name}
                </span>
                {rider.rating && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-900">
                    ★ {rider.rating}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 truncate">
                {rider.vehicleType} • <span className="font-mono font-semibold">{rider.vehicleNumber}</span>
              </p>
            </div>
          </div>

          <a
            href={`tel:${rider.phone}`}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200 text-xs font-bold transition-colors self-start sm:self-auto"
          >
            <Phone className="w-3.5 h-3.5 text-brand-700" />
            <span>Call {rider.name.split(' ')[0]}</span>
          </a>
        </div>
      )}

      {/* Special Drop Instructions Banner (PG Warden / Office Desk) */}
      {deliveryInstructions && (
        <div className="px-3.5 py-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
          <Building className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Runner Delivery Note: </span>
            <span className="text-amber-800 font-medium">{deliveryInstructions}</span>
          </div>
        </div>
      )}
    </div>
  );
}
