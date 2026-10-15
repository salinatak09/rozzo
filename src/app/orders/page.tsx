'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  PackageCheck,
  Clock,
  MapPin,
  CheckCircle2,
  Star,
  RotateCcw,
  Utensils,
  ArrowRight,
  Sparkles,
  XCircle,
  AlertCircle,
  Ban,
  Bike,
} from 'lucide-react';
import { OrderStatus } from '@/types';
import DeliveryStatusTracker from '@/components/DeliveryStatusTracker';

export default function OrdersPage() {
  const { pastOrders, cancelOrder, showToast } = useApp();
  const [ratedOrders, setRatedOrders] = useState<Record<string, number>>({});
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('Change of plans / eating outside');
  const [selectedTab, setSelectedTab] = useState<'All' | 'Active' | 'Delivered' | 'Failed'>('All');

  const handleRate = (orderId: string, rating: number) => {
    setRatedOrders((prev) => ({ ...prev, [orderId]: rating }));
    showToast(`⭐ Thank you for rating ${rating} stars!`);
  };

  const handleConfirmCancel = () => {
    if (cancellingOrderId) {
      cancelOrder(cancellingOrderId, cancelReason);
      setCancellingOrderId(null);
    }
  };

  const filteredOrders = pastOrders.filter((order) => {
    if (selectedTab === 'Active') {
      return (
        order.status === 'Preparing' ||
        order.status === 'Ready' ||
        order.status === 'Assigned' ||
        order.status === 'Picked Up' ||
        order.status === 'Out for Delivery' ||
        order.status === 'Confirmed' ||
        order.status === 'Accepted'
      );
    }
    if (selectedTab === 'Delivered') {
      return order.status === 'Delivered';
    }
    if (selectedTab === 'Failed') {
      return order.status === 'Failed' || order.status === 'Cancelled';
    }
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Confirmed':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'Accepted':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Preparing':
        return 'bg-purple-50 text-purple-800 border-purple-200 animate-pulse';
      case 'Ready':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Assigned':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'Picked Up':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Out for Delivery':
        return 'bg-teal-50 text-teal-800 border-teal-300 animate-pulse';
      case 'Delivered':
        return 'bg-brand-50 text-brand-800 border-brand-200';
      case 'Failed':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EFE8DA]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-brand-100 text-brand-800">
              <PackageCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Order & Meal History
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Track daily meal deliveries, review dish menus, rate mom’s home kitchens, and cancel upcoming meals before cutoff.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            href="/delivery"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-cream-100 hover:bg-cream-200 text-stone-700 font-bold text-xs border border-[#E3D7C1] transition-all"
            title="View Delivery Operations Hub"
          >
            <Bike className="w-3.5 h-3.5 text-brand-700" />
            <span>Delivery Hub</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
          >
            <span>Order Next Meal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {(
          [
            { id: 'All', label: `All Orders (${pastOrders.length})` },
            {
              id: 'Active',
              label: `In-Flight & Prep (${
                pastOrders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled' && o.status !== 'Failed').length
              })`,
            },
            {
              id: 'Delivered',
              label: `Delivered (${pastOrders.filter((o) => o.status === 'Delivered').length})`,
            },
            {
              id: 'Failed',
              label: `Issues & Cancelled (${pastOrders.filter((o) => o.status === 'Failed' || o.status === 'Cancelled').length})`,
            },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all whitespace-nowrap ${
              selectedTab === tab.id
                ? 'bg-brand-700 text-white shadow-xs'
                : 'bg-white hover:bg-cream-100 text-stone-600 border border-[#E3D7C1]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const rating = ratedOrders[order.id];
          const canCancel =
            (order.status === 'Scheduled' || order.status === 'Confirmed') && !order.isCutoffPassed;

          return (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-[#EFE8DA] p-5 sm:p-6 shadow-soft space-y-4 hover:shadow-warm transition-all"
            >
              {/* Order Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EFE8DA]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-extrabold text-stone-900">
                      {order.providerName}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-cream-200 font-bold text-stone-700">
                      {order.mealType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                    <span>{order.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-stone-400" /> {order.timeSlot}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-[11px] text-stone-400">{order.id}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    <span>●</span>
                    <span>{order.status}</span>
                  </span>
                  <span className="text-sm font-extrabold text-stone-900">
                    ₹{order.price}
                  </span>
                </div>
              </div>

              {/* Items included in this tiffin */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                  Dabba Contents
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {order.items.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-xl bg-cream-100 text-stone-800 border border-[#E3D7C1] font-medium"
                    >
                      <Utensils className="w-3 h-3 text-brand-600" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Phase 4 Live Delivery Status Tracker */}
              <DeliveryStatusTracker order={order} />

              {/* Delivery Address & Status Notes */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-[#EFE8DA]">
                <div className="flex items-center gap-1.5 text-stone-600 flex-wrap">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                  <span className="truncate">Destination: {order.addressSnapshot}</span>
                  {order.addressType && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        order.addressType === 'Office'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                      }`}
                    >
                      {order.addressType}
                    </span>
                  )}
                </div>

                {/* Cancellation & Rating Controls */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {canCancel ? (
                    <button
                      onClick={() => setCancellingOrderId(order.id)}
                      className="px-3 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors flex items-center gap-1"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Cancel Meal</span>
                    </button>
                  ) : order.status === 'Cancelled' ? (
                    <span className="text-xs font-semibold text-rose-600 italic">
                      Order Cancelled
                    </span>
                  ) : order.status === 'Delivered' ? (
                    /* Rating Bar */
                    <div className="flex items-center gap-1">
                      <span className="text-stone-400 font-medium mr-1 text-[11px]">
                        {rating ? 'Your Rating:' : 'Rate Meal:'}
                      </span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRate(order.id, star)}
                          className="p-1 hover:scale-125 transition-transform"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              (rating || 0) >= star
                                ? 'fill-amber-400 text-amber-500'
                                : 'text-stone-300 hover:text-amber-400'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] text-stone-400 italic">
                      Cutoff passed ({order.cancellationCutoff || '10:30 AM'}) • In Kitchen
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cancel Order Modal */}
      {cancellingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FCFAF6] rounded-3xl max-w-md w-full border border-[#E3D7C1] shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE8DA]">
              <div className="flex items-center gap-2 text-rose-700">
                <Ban className="w-5 h-5" />
                <h3 className="text-lg font-black text-stone-900">Cancel Upcoming Meal</h3>
              </div>
              <button
                onClick={() => setCancellingOrderId(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Order #{cancellingOrderId} is before the dispatch cutoff. Cancelling now will release your meal credit and notify the kitchen immediately.
            </p>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1">
                Reason for Cancellation:
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E3D7C1] bg-white text-xs font-semibold text-stone-800"
              >
                <option value="Change of plans / eating outside">Change of plans / eating outside</option>
                <option value="Traveling out of town">Traveling out of town</option>
                <option value="Ordered another meal by mistake">Ordered another meal by mistake</option>
                <option value="Health / fasting today">Health / fasting today</option>
              </select>
            </div>

            <div className="pt-2 flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setCancellingOrderId(null)}
                className="px-4 py-2 rounded-xl bg-cream-200 text-stone-700 text-xs font-bold hover:bg-cream-300"
              >
                Keep Meal
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-sm"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
