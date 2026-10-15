'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { OrderStatus, DeliveryMode, RiderInfo, PastOrder } from '@/types';
import {
  Bike,
  Package,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  ChefHat,
  Filter,
  ArrowRight,
  UserCheck,
  RefreshCw,
  Building,
  Home,
  Sliders,
  Check,
  X,
  Navigation,
  Info,
} from 'lucide-react';

export default function DeliveryDashboardPage() {
  const {
    pastOrders,
    riders,
    providers,
    assignRiderToOrder,
    updateDeliveryStatus,
    toggleProviderDeliveryMode,
    showToast,
  } = useApp();

  // Filters
  const [statusFilter, setStatusFilter] = useState<'All' | 'Ready' | 'InFlight' | 'Delivered' | 'Failed'>('All');
  const [fleetFilter, setFleetFilter] = useState<'All' | DeliveryMode>('All');
  const [selectedProviderId, setSelectedProviderId] = useState<string>('all');

  // Modals state
  const [assigningOrderId, setAssigningOrderId] = useState<string | null>(null);
  const [selectedRiderId, setSelectedRiderId] = useState<string>('rider-1');

  const [failingOrderId, setFailingOrderId] = useState<string | null>(null);
  const [failReason, setFailReason] = useState<string>(
    'Customer unreachable after 3 phone attempts and gated security refused drop without OTP.'
  );

  // ETA input map per order for quick updating
  const [etaInputs, setEtaInputs] = useState<Record<string, number>>({
    'ORD-8925': 12,
    'ORD-8924': 25,
    'ORD-8923': 35,
  });

  // Filter logic
  const filteredOrders = pastOrders.filter((order) => {
    // Fleet filter
    if (fleetFilter !== 'All' && order.deliveryMode !== fleetFilter) {
      return false;
    }

    // Provider filter
    if (selectedProviderId !== 'all' && order.providerId !== selectedProviderId) {
      return false;
    }

    // Status filter
    if (statusFilter === 'Ready') {
      return order.status === 'Ready';
    }
    if (statusFilter === 'InFlight') {
      return (
        order.status === 'Assigned' ||
        order.status === 'Picked Up' ||
        order.status === 'Out for Delivery'
      );
    }
    if (statusFilter === 'Delivered') {
      return order.status === 'Delivered';
    }
    if (statusFilter === 'Failed') {
      return order.status === 'Failed' || order.status === 'Cancelled';
    }

    return true;
  });

  // KPI Metrics
  const readyCount = pastOrders.filter((o) => o.status === 'Ready').length;
  const inFlightCount = pastOrders.filter(
    (o) => o.status === 'Assigned' || o.status === 'Picked Up' || o.status === 'Out for Delivery'
  ).length;
  const deliveredCount = pastOrders.filter((o) => o.status === 'Delivered').length;
  const failedCount = pastOrders.filter((o) => o.status === 'Failed').length;

  const handleAssignRiderSubmit = () => {
    if (assigningOrderId) {
      assignRiderToOrder(assigningOrderId, selectedRiderId);
      setAssigningOrderId(null);
    }
  };

  const handleMarkFailedSubmit = () => {
    if (failingOrderId) {
      updateDeliveryStatus(failingOrderId, 'Failed', {
        failedReason: failReason,
      });
      setFailingOrderId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EFE8DA]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-brand-100 text-brand-800 shadow-xs">
              <Bike className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Delivery Operations & Runner Hub
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            Dispatch fresh tiffins, coordinate Rozzo Green Fleet vs. Kitchen Express runners, enforce PG & office drop instructions, and resolve delivery exceptions.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link
            href="/partner"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-cream-100 hover:bg-cream-200 text-stone-700 font-bold text-xs border border-[#E3D7C1] transition-colors"
          >
            <ChefHat className="w-3.5 h-3.5 text-amber-700" />
            <span>Kitchen Dashboard</span>
          </Link>

          <Link
            href="/orders"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Customer View</span>
          </Link>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-3xl border border-[#EFE8DA] p-4 shadow-soft space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Ready for Dispatch</span>
            <Package className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">{readyCount}</div>
          <span className="text-[11px] text-amber-700 font-semibold block">
            Freshly packed hot boxes
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-[#EFE8DA] p-4 shadow-soft space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Active In-Flight</span>
            <Bike className="w-4 h-4 text-brand-600 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-stone-900">{inFlightCount}</div>
          <span className="text-[11px] text-brand-700 font-semibold block">
            Runners currently on route
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-[#EFE8DA] p-4 shadow-soft space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Delivered Today</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">{deliveredCount}</div>
          <span className="text-[11px] text-emerald-700 font-semibold block">
            100% on-time window
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-[#EFE8DA] p-4 shadow-soft space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Exceptions & Failed</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">{failedCount}</div>
          <span className="text-[11px] text-rose-700 font-semibold block">
            Zero-penalty rollovers applied
          </span>
        </div>
      </div>

      {/* Filter and Mode Controls Bar */}
      <div className="bg-white rounded-3xl border border-[#EFE8DA] p-4 shadow-soft space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
            {(
              [
                { id: 'All', label: 'All Runs' },
                { id: 'Ready', label: `Ready (${readyCount})` },
                { id: 'InFlight', label: `In-Flight (${inFlightCount})` },
                { id: 'Delivered', label: `Delivered (${deliveredCount})` },
                { id: 'Failed', label: `Failed / Issues (${failedCount})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap ${
                  statusFilter === tab.id
                    ? 'bg-brand-700 text-white shadow-xs'
                    : 'bg-cream-100 hover:bg-cream-200 text-stone-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Fleet Mode & Kitchen Dropdowns */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Fleet Mode Selector */}
            <select
              value={fleetFilter}
              onChange={(e) => setFleetFilter(e.target.value as 'All' | DeliveryMode)}
              className="text-xs font-semibold px-3 py-1.5 rounded-2xl bg-cream-100 border border-[#E3D7C1] text-stone-800 focus:outline-none"
            >
              <option value="All">All Fleets</option>
              <option value="platform-managed">Rozzo Green Fleet (Platform)</option>
              <option value="provider-managed">Kitchen Express (Provider)</option>
            </select>

            {/* Provider Filter */}
            <select
              value={selectedProviderId}
              onChange={(e) => setSelectedProviderId(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-2xl bg-cream-100 border border-[#E3D7C1] text-stone-800 focus:outline-none max-w-[200px]"
            >
              <option value="all">All Kitchens</option>
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name.split(' - ')[0]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Informative Delivery Policy Banner */}
        <div className="p-2.5 rounded-2xl bg-brand-50/70 border border-brand-200/80 text-xs text-brand-900 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-brand-700 flex-shrink-0" />
            <span>
              <strong>Dispatch Cutoff Policy:</strong> Lunch dispatches start at 12:00 PM (10:30 AM cutoff). Dinner dispatches start at 7:15 PM (5:30 PM cutoff).
            </span>
          </div>
          <span className="text-[11px] font-bold text-brand-800 bg-brand-100/80 px-2 py-0.5 rounded-full whitespace-nowrap">
            3 Active Runners Online
          </span>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#EFE8DA] p-12 text-center space-y-3">
            <Bike className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="text-base font-bold text-stone-700">No delivery runs found</h3>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              There are no orders matching the selected status or fleet filter. Try clearing filters or creating new orders.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const rider = order.rider;
            const currentEta = etaInputs[order.id] ?? order.estimatedMinutesAway ?? 15;

            return (
              <div
                key={order.id}
                className={`bg-white rounded-3xl border transition-all p-5 sm:p-6 shadow-soft space-y-4 ${
                  order.status === 'Failed'
                    ? 'border-rose-200 bg-rose-50/20'
                    : order.status === 'Delivered'
                    ? 'border-[#EFE8DA] opacity-90'
                    : 'border-[#E3D7C1] hover:shadow-warm'
                }`}
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EFE8DA]">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-xl bg-stone-100 text-stone-800 border border-stone-200">
                      {order.id}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-stone-900 text-sm sm:text-base">
                          {order.providerName}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-cream-200 font-bold text-stone-700">
                          {order.mealType}
                        </span>
                      </div>
                      <span className="text-xs text-stone-500">{order.date} • {order.timeSlot}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {/* Delivery Fleet Badge */}
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        order.deliveryMode === 'platform-managed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {order.deliveryMode === 'platform-managed'
                        ? 'Rozzo Green Fleet'
                        : 'Kitchen Express'}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                        order.status === 'Delivered'
                          ? 'bg-brand-50 text-brand-800 border-brand-200'
                          : order.status === 'Out for Delivery'
                          ? 'bg-teal-50 text-teal-800 border-teal-300 animate-pulse'
                          : order.status === 'Failed'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : order.status === 'Cancelled'
                          ? 'bg-stone-100 text-stone-800 border-stone-200'
                          : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                      }`}
                    >
                      ● {order.status}
                    </span>
                  </div>
                </div>

                {/* Customer Details & Destination Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left: Customer Info & Items */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-900">
                        Customer: {order.customerName || 'Saurabh Sharma'}
                      </span>
                      {order.customerPhone && (
                        <a
                          href={`tel:${order.customerPhone}`}
                          className="inline-flex items-center gap-1 font-bold text-brand-700 hover:underline"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{order.customerPhone}</span>
                        </a>
                      )}
                    </div>

                    <div className="p-3 rounded-2xl bg-cream-50 border border-[#EBE3D3] space-y-1">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                        Packed Dishes
                      </span>
                      <p className="text-xs font-medium text-stone-700">
                        {order.items.join(' • ')}
                      </p>
                    </div>
                  </div>

                  {/* Right: Drop Address & Special Delivery Instructions */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                        <MapPin className="w-3.5 h-3.5 text-brand-700 flex-shrink-0" />
                        <span className="truncate">Drop: {order.addressSnapshot}</span>
                      </div>
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

                    {/* Specific drop instructions */}
                    {order.deliveryInstructions ? (
                      <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-1.5">
                        <Building className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Drop Note: </span>
                          <span>{order.deliveryInstructions}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-stone-400 italic">No special gate notes.</div>
                    )}

                    {/* Google Maps External Navigation */}
                    {order.mapQueryUrl && (
                      <a
                        href={order.mapQueryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-800"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Open Turn-by-Turn GPS Navigation</span>
                        <ExternalLink className="w-3 h-3 text-stone-400" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Assigned Runner Strip (if assigned) */}
                {rider && (
                  <div className="p-3 rounded-2xl bg-cream-100/70 border border-[#E3D7C1] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {rider.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-stone-900">
                          Runner: {rider.name} (★ {rider.rating || '4.9'})
                        </span>
                        <span className="text-stone-500 ml-2">
                          {rider.vehicleType} • <span className="font-mono">{rider.vehicleNumber}</span>
                        </span>
                      </div>
                    </div>

                    <a
                      href={`tel:${rider.phone}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:underline self-start sm:self-auto"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{rider.phone}</span>
                    </a>
                  </div>
                )}

                {/* Failure Reason Banner (if Failed) */}
                {order.status === 'Failed' && order.failedReason && (
                  <div className="p-3 rounded-2xl bg-rose-100/80 border border-rose-300 text-xs text-rose-900 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <ShieldAlert className="w-4 h-4 text-rose-700" />
                      <span>Delivery Exception Reported:</span>
                    </div>
                    <p className="text-rose-800">{order.failedReason}</p>
                    <p className="text-[11px] text-rose-700 font-semibold italic">
                      Automated resolution: 100% rollover meal credited to customer subscription.
                    </p>
                  </div>
                )}

                {/* Status Transition Action Buttons */}
                <div className="pt-3 border-t border-[#EFE8DA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: ETA Controller (when in flight) */}
                  {(order.status === 'Assigned' ||
                    order.status === 'Picked Up' ||
                    order.status === 'Out for Delivery') && (
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span className="text-stone-600 font-semibold">ETA:</span>
                      <div className="flex items-center gap-1">
                        {[10, 15, 25, 35].map((mins) => (
                          <button
                            key={mins}
                            onClick={() => {
                              setEtaInputs((prev) => ({ ...prev, [order.id]: mins }));
                              showToast(`⏱️ ETA updated to ${mins} mins`);
                            }}
                            className={`px-2 py-0.5 rounded-lg font-bold text-[11px] transition-colors ${
                              currentEta === mins
                                ? 'bg-brand-600 text-white'
                                : 'bg-cream-100 hover:bg-cream-200 text-stone-700 border border-[#E3D7C1]'
                            }`}
                          >
                            {mins}m
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Right: Operational Actions */}
                  <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
                    {/* When Ready -> Assign Rider */}
                    {order.status === 'Ready' && (
                      <button
                        onClick={() => {
                          setAssigningOrderId(order.id);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Assign Runner</span>
                      </button>
                    )}

                    {/* When Assigned -> Confirm Pickup */}
                    {order.status === 'Assigned' && (
                      <button
                        onClick={() => {
                          updateDeliveryStatus(order.id, 'Picked Up');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Confirm Kitchen Pickup</span>
                      </button>
                    )}

                    {/* When Picked Up -> Start Out for Delivery */}
                    {order.status === 'Picked Up' && (
                      <button
                        onClick={() => {
                          updateDeliveryStatus(order.id, 'Out for Delivery', {
                            estimatedMinutes: currentEta,
                          });
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Bike className="w-3.5 h-3.5" />
                        <span>Start Delivery Run</span>
                      </button>
                    )}

                    {/* When Out for Delivery -> Mark Delivered or Mark Failed */}
                    {order.status === 'Out for Delivery' && (
                      <>
                        <button
                          onClick={() => {
                            updateDeliveryStatus(order.id, 'Delivered');
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Delivered</span>
                        </button>

                        <button
                          onClick={() => {
                            setFailingOrderId(order.id);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-colors flex items-center gap-1"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Report Issue / Failed</span>
                        </button>
                      </>
                    )}

                    {/* When Failed -> Re-dispatch option */}
                    {order.status === 'Failed' && (
                      <button
                        onClick={() => {
                          updateDeliveryStatus(order.id, 'Ready');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Re-dispatch / Retry Delivery</span>
                      </button>
                    )}

                    {order.status === 'Delivered' && (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <Check className="w-4 h-4" /> Drop-off Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Assign Runner Modal */}
      {assigningOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FCFAF6] rounded-3xl max-w-md w-full border border-[#E3D7C1] shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE8DA]">
              <div className="flex items-center gap-2 text-stone-900">
                <Bike className="w-5 h-5 text-brand-700" />
                <h3 className="text-lg font-black">Assign Delivery Partner</h3>
              </div>
              <button
                onClick={() => setAssigningOrderId(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-500">
              Select an active runner to pick up and deliver order <strong>#{assigningOrderId}</strong>.
            </p>

            <div className="space-y-2">
              {Object.values(riders).map((rider) => (
                <div
                  key={rider.id}
                  onClick={() => setSelectedRiderId(rider.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedRiderId === rider.id
                      ? 'bg-brand-50 border-brand-500 ring-2 ring-brand-500/20'
                      : 'bg-white border-[#E3D7C1] hover:bg-cream-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-700 text-white font-bold text-xs flex items-center justify-center">
                      {rider.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-stone-900">{rider.name}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900">
                          ★ {rider.rating}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500">
                        {rider.vehicleType} • <span className="font-mono">{rider.vehicleNumber}</span>
                      </p>
                    </div>
                  </div>

                  <input
                    type="radio"
                    checked={selectedRiderId === rider.id}
                    onChange={() => setSelectedRiderId(rider.id)}
                    className="accent-brand-700"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EFE8DA]">
              <button
                onClick={() => setAssigningOrderId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-cream-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignRiderSubmit}
                className="px-4 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Failed Delivery Modal */}
      {failingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FCFAF6] rounded-3xl max-w-md w-full border border-[#E3D7C1] shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE8DA]">
              <div className="flex items-center gap-2 text-rose-700">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="text-lg font-black text-stone-900">Report Delivery Issue</h3>
              </div>
              <button
                onClick={() => setFailingOrderId(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Why could order <strong>#{failingOrderId}</strong> not be handed over? The customer will immediately receive a notification with a 100% rollover meal credit.
            </p>

            <div className="space-y-2">
              {[
                'Customer unreachable after 3 phone attempts and gated security refused drop without OTP.',
                'Security guard / PG warden denied delivery box entry without resident present.',
                'Customer changed delivery address post cutoff to an unserviceable area.',
                'Wrong desk / wing specified and building security prohibited entry.',
                'Severe weather / flash rain causing impassable localized waterlogging.',
              ].map((reason, idx) => (
                <label
                  key={idx}
                  onClick={() => setFailReason(reason)}
                  className={`p-3 rounded-2xl border text-xs cursor-pointer block transition-all ${
                    failReason === reason
                      ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-200'
                      : 'bg-white border-[#E3D7C1] hover:bg-cream-50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <input
                      type="radio"
                      name="failReason"
                      checked={failReason === reason}
                      onChange={() => setFailReason(reason)}
                      className="mt-0.5 accent-rose-600"
                    />
                    <span className="text-stone-800 leading-snug">{reason}</span>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EFE8DA]">
              <button
                onClick={() => setFailingOrderId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-cream-100"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkFailedSubmit}
                className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Confirm Failure & Issue Rollover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
