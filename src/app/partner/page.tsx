'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { OrderStatus, DayMenuSchedule } from '@/types';
import {
  ChefHat,
  Package,
  Users,
  Calendar,
  Settings,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Flame,
  Save,
  Edit3,
  Sliders,
  DollarSign,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

const ORDER_STATUS_ORDER: OrderStatus[] = [
  'Scheduled',
  'Confirmed',
  'Accepted',
  'Preparing',
  'Ready',
  'Out for Delivery',
  'Delivered',
];

export default function PartnerDashboardPage() {
  const {
    providers,
    activePartnerProviderId,
    setActivePartnerProviderId,
    pastOrders,
    userPlans,
    updateDailyMenu,
    updateWeeklyDayMenu,
    updateProviderSettings,
    updateOrderStatus,
    showToast,
  } = useApp();

  const currentProvider =
    providers.find((p) => p.id === activePartnerProviderId) || providers[0];

  // Dashboard Tab state
  const [activeTab, setActiveTab] = useState<'orders' | 'subscribers' | 'menu' | 'settings'>('orders');

  // Order status filter in Orders tab
  const [orderStatusFilter, setOrderStatusFilter] = useState<'All' | OrderStatus>('All');

  // Daily menu form fields
  const [lunchSpecialInput, setLunchSpecialInput] = useState(currentProvider.todayHighlight.lunchSpecial);
  const [dinnerSpecialInput, setDinnerSpecialInput] = useState(currentProvider.todayHighlight.dinnerSpecial);

  // Weekly schedule editor state
  const [selectedWeekDay, setSelectedWeekDay] = useState<string>('Monday');
  const activeDaySchedule =
    currentProvider.weeklySchedule.find((s) => s.day.toLowerCase() === selectedWeekDay.toLowerCase()) ||
    currentProvider.weeklySchedule[0];

  const [editLunchMain, setEditLunchMain] = useState(activeDaySchedule.lunch.mainCurry);
  const [editLunchSabzi, setEditLunchSabzi] = useState(activeDaySchedule.lunch.drySabzi);
  const [editLunchBreads, setEditLunchBreads] = useState(activeDaySchedule.lunch.breads);
  const [editLunchRice, setEditLunchRice] = useState(activeDaySchedule.lunch.rice);
  const [editLunchSides, setEditLunchSides] = useState(activeDaySchedule.lunch.accompaniments);
  const [editLunchCalories, setEditLunchCalories] = useState(activeDaySchedule.lunch.calories);

  const [editDinnerMain, setEditDinnerMain] = useState(activeDaySchedule.dinner.mainCurry);
  const [editDinnerSabzi, setEditDinnerSabzi] = useState(activeDaySchedule.dinner.drySabzi);
  const [editDinnerBreads, setEditDinnerBreads] = useState(activeDaySchedule.dinner.breads);
  const [editDinnerRice, setEditDinnerRice] = useState(activeDaySchedule.dinner.rice);
  const [editDinnerSides, setEditDinnerSides] = useState(activeDaySchedule.dinner.accompaniments);
  const [editDinnerCalories, setEditDinnerCalories] = useState(activeDaySchedule.dinner.calories);

  // Settings form fields
  const [priceInput, setPriceInput] = useState(currentProvider.sampleMealPrice);
  const [capacityInput, setCapacityInput] = useState(currentProvider.maxDailyCapacity);
  const [lunchSlotInput, setLunchSlotInput] = useState(currentProvider.deliverySlots.lunch);
  const [dinnerSlotInput, setDinnerSlotInput] = useState(currentProvider.deliverySlots.dinner);
  const [lunchCutoffInput, setLunchCutoffInput] = useState(currentProvider.lunchCutoffTime);
  const [dinnerCutoffInput, setDinnerCutoffInput] = useState(currentProvider.dinnerCutoffTime);
  const [serviceAreasInput, setServiceAreasInput] = useState<string[]>([...currentProvider.serviceableAreas]);

  // Sync state when active provider changes
  const handleProviderChange = (id: string) => {
    setActivePartnerProviderId(id);
    const p = providers.find((prov) => prov.id === id) || providers[0];
    setLunchSpecialInput(p.todayHighlight.lunchSpecial);
    setDinnerSpecialInput(p.todayHighlight.dinnerSpecial);
    setPriceInput(p.sampleMealPrice);
    setCapacityInput(p.maxDailyCapacity);
    setLunchSlotInput(p.deliverySlots.lunch);
    setDinnerSlotInput(p.deliverySlots.dinner);
    setLunchCutoffInput(p.lunchCutoffTime);
    setDinnerCutoffInput(p.dinnerCutoffTime);
    setServiceAreasInput([...p.serviceableAreas]);
  };

  // Sync weekly form fields when day changes
  const handleSelectWeekDay = (day: string) => {
    setSelectedWeekDay(day);
    const s = currentProvider.weeklySchedule.find((item) => item.day.toLowerCase() === day.toLowerCase());
    if (s) {
      setEditLunchMain(s.lunch.mainCurry);
      setEditLunchSabzi(s.lunch.drySabzi);
      setEditLunchBreads(s.lunch.breads);
      setEditLunchRice(s.lunch.rice);
      setEditLunchSides(s.lunch.accompaniments);
      setEditLunchCalories(s.lunch.calories);

      setEditDinnerMain(s.dinner.mainCurry);
      setEditDinnerSabzi(s.dinner.drySabzi);
      setEditDinnerBreads(s.dinner.breads);
      setEditDinnerRice(s.dinner.rice);
      setEditDinnerSides(s.dinner.accompaniments);
      setEditDinnerCalories(s.dinner.calories);
    }
  };

  // Filter orders for this provider
  const providerOrders = pastOrders.filter((o) => o.providerId === currentProvider.id);
  const filteredOrders =
    orderStatusFilter === 'All'
      ? providerOrders
      : providerOrders.filter((o) => o.status === orderStatusFilter);

  // Filter subscribers for this provider
  const providerSubscribers = userPlans.filter((p) => p.providerId === currentProvider.id);

  // Handlers
  const handleSaveDailyMenu = (e: React.FormEvent) => {
    e.preventDefault();
    updateDailyMenu(currentProvider.id, lunchSpecialInput, dinnerSpecialInput);
  };

  const handleSaveWeeklySchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedLunch = {
      ...activeDaySchedule.lunch,
      mainCurry: editLunchMain,
      drySabzi: editLunchSabzi,
      breads: editLunchBreads,
      rice: editLunchRice,
      accompaniments: editLunchSides,
      calories: Number(editLunchCalories),
    };
    const updatedDinner = {
      ...activeDaySchedule.dinner,
      mainCurry: editDinnerMain,
      drySabzi: editDinnerSabzi,
      breads: editDinnerBreads,
      rice: editDinnerRice,
      accompaniments: editDinnerSides,
      calories: Number(editDinnerCalories),
    };

    updateWeeklyDayMenu(currentProvider.id, selectedWeekDay, updatedLunch, updatedDinner);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateProviderSettings(currentProvider.id, {
      sampleMealPrice: Number(priceInput),
      maxDailyCapacity: Number(capacityInput),
      deliverySlots: {
        lunch: lunchSlotInput,
        dinner: dinnerSlotInput,
      },
      lunchCutoffTime: lunchCutoffInput,
      dinnerCutoffTime: dinnerCutoffInput,
      serviceableAreas: serviceAreasInput,
    });
  };

  const toggleServiceArea = (area: string) => {
    if (serviceAreasInput.includes(area)) {
      if (serviceAreasInput.length === 1) {
        showToast('At least 1 serviceable area is required.');
        return;
      }
      setServiceAreasInput(serviceAreasInput.filter((a) => a !== area));
    } else {
      setServiceAreasInput([...serviceAreasInput, area]);
    }
  };

  const advanceOrderStatus = (orderId: string, currentStatus: OrderStatus) => {
    const currentIndex = ORDER_STATUS_ORDER.indexOf(currentStatus);
    if (currentIndex !== -1 && currentIndex < ORDER_STATUS_ORDER.length - 1) {
      const nextStatus = ORDER_STATUS_ORDER[currentIndex + 1];
      updateOrderStatus(orderId, nextStatus);
    }
  };

  const capacityPercent = Math.min(
    100,
    Math.round((currentProvider.currentBookedCount / currentProvider.maxDailyCapacity) * 100)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner: Partner Header & Kitchen Switcher */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0 shadow-inner">
            <ChefHat className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Kitchen Operations Hub
              </span>
              <span className="text-xs text-stone-400">• FSSAI Verified</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
              {currentProvider.name}
            </h1>
            <p className="text-xs text-stone-400">
              {currentProvider.locationArea} • Cutoff: Lunch {currentProvider.lunchCutoffTime} | Dinner {currentProvider.dinnerCutoffTime}
            </p>
          </div>
        </div>

        {/* Switch kitchen partner */}
        <div className="bg-stone-800/80 p-3 rounded-2xl border border-stone-700/80 space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
            Select Active Home Kitchen:
          </label>
          <select
            value={currentProvider.id}
            onChange={(e) => handleProviderChange(e.target.value)}
            className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.locationArea})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Metrics Summary Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Orders */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#EFE8DA] shadow-soft space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-bold uppercase tracking-wider">Today’s Orders</span>
            <Package className="w-4 h-4 text-brand-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-stone-900">
              {providerOrders.length}
            </span>
            <span className="text-xs font-bold text-brand-700">In Pipeline</span>
          </div>
          <span className="text-[11px] text-stone-400 block">Scheduled & active dabbas</span>
        </div>

        {/* Active Subscribers */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#EFE8DA] shadow-soft space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-bold uppercase tracking-wider">Active Subscribers</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-stone-900">
              {providerSubscribers.length > 0 ? providerSubscribers.length : 1}
            </span>
            <span className="text-xs font-bold text-indigo-700">Recurring</span>
          </div>
          <span className="text-[11px] text-stone-400 block">Trial, Weekly & Monthly</span>
        </div>

        {/* Daily Capacity Status */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#EFE8DA] shadow-soft space-y-1.5">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-bold uppercase tracking-wider">Kitchen Capacity</span>
            <span className="text-xs font-bold text-amber-700">{capacityPercent}%</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-stone-900">
              {currentProvider.currentBookedCount}
            </span>
            <span className="text-xs text-stone-500 font-medium">/ {currentProvider.maxDailyCapacity} meals</span>
          </div>
          <div className="w-full h-2 bg-cream-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                capacityPercent > 85 ? 'bg-amber-600' : 'bg-brand-600'
              }`}
              style={{ width: `${capacityPercent}%` }}
            />
          </div>
        </div>

        {/* Meal Pricing */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#EFE8DA] shadow-soft space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-bold uppercase tracking-wider">Base Meal Price</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-stone-900">
              ₹{currentProvider.sampleMealPrice}
            </span>
            <span className="text-xs text-stone-500">/ full dabba</span>
          </div>
          <span className="text-[11px] text-stone-400 block">Cutoff: {currentProvider.cancellationCutoffHours}h before dispatch</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-cream-200/80 rounded-2xl border border-[#E3D7C1] overflow-x-auto">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Package className="w-4 h-4 text-brand-700" />
          <span>Daily Orders & Pipeline</span>
          <span className="px-1.5 py-0.2 rounded-full bg-brand-100 text-brand-900 text-xs">
            {providerOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('subscribers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'subscribers'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Users className="w-4 h-4 text-indigo-700" />
          <span>Active Subscribers</span>
          <span className="px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-900 text-xs">
            {providerSubscribers.length > 0 ? providerSubscribers.length : 1}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('menu')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'menu'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Calendar className="w-4 h-4 text-amber-700" />
          <span>Menu & Weekly Schedule</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Settings className="w-4 h-4 text-stone-700" />
          <span>Capacity & Cutoff Rules</span>
        </button>
      </div>

      {/* TAB 1: DAILY ORDERS & PIPELINE */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Order Status Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {['All', ...ORDER_STATUS_ORDER, 'Cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setOrderStatusFilter(st as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                  orderStatusFilter === st
                    ? 'bg-brand-700 text-white border-brand-700 shadow-sm'
                    : 'bg-white text-stone-700 border-[#E3D7C1] hover:bg-cream-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Orders List */}
          <div className="space-y-3">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const isCancelled = order.status === 'Cancelled';
                const isDelivered = order.status === 'Delivered';

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl border border-[#EFE8DA] p-5 shadow-soft space-y-3 hover:shadow-warm transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EFE8DA]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-cream-200 text-stone-700">
                          {order.id}
                        </span>
                        <h4 className="font-extrabold text-stone-900 text-sm sm:text-base">
                          {order.customerName || 'Customer'}
                        </h4>
                        <span className="text-xs text-stone-400">
                          {order.customerPhone || '+91 98765 43210'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full border ${
                            order.status === 'Scheduled'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : order.status === 'Confirmed'
                              ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                              : order.status === 'Accepted'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : order.status === 'Preparing'
                              ? 'bg-purple-50 text-purple-800 border-purple-200 animate-pulse'
                              : order.status === 'Ready'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : order.status === 'Delivered'
                              ? 'bg-green-100 text-green-900 border-green-300'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          ● {order.status}
                        </span>

                        <span className="text-xs font-extrabold text-stone-900">
                          ₹{order.price}
                        </span>
                      </div>
                    </div>

                    {/* Meal Items and Delivery Snapshot */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                          {order.mealType} Dabba Items
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {order.items.map((item, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-lg bg-cream-100 text-stone-800 border border-[#E3D7C1] text-[11px]"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-stone-400 block mb-0.5">
                          Delivery Destination
                        </span>
                        <div className="flex items-center gap-1.5 text-stone-700">
                          <MapPin className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                          <span className="font-semibold">{order.addressSnapshot}</span>
                          {order.addressType && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cream-200 text-stone-700">
                              {order.addressType}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500">
                          Time Slot: {order.timeSlot} • Cutoff: {order.cancellationCutoff || '10:30 AM'}
                        </p>
                      </div>
                    </div>

                    {/* Order Action Controls */}
                    {!isCancelled && !isDelivered && (
                      <div className="pt-2 border-t border-[#EFE8DA] flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] text-stone-500">
                          Lifecycle progression updates customer notifications in real time.
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => advanceOrderStatus(order.id, order.status)}
                            className="px-3.5 py-1.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-sm flex items-center gap-1 transition-all"
                          >
                            <span>Advance to Next Status</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-[#EFE8DA] p-6 space-y-2">
                <Package className="w-8 h-8 text-stone-400 mx-auto" />
                <h4 className="font-bold text-stone-800">No orders matching status &quot;{orderStatusFilter}&quot;</h4>
                <p className="text-xs text-stone-500">Switch filter to &quot;All&quot; to see all incoming orders.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE SUBSCRIBERS */}
      {activeTab === 'subscribers' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-[#EFE8DA] p-5 sm:p-6 shadow-soft space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EFE8DA]">
              <div>
                <h3 className="text-lg font-black text-stone-900">Active Tiffin Subscribers</h3>
                <p className="text-xs text-stone-500">
                  Subscribers have meals automatically prepared according to their saved PG and Office preferences.
                </p>
              </div>
              <span className="text-xs font-bold text-brand-800 bg-brand-50 px-3 py-1 rounded-full border border-brand-200 self-start sm:self-auto">
                {userPlans.length} Total Platform Subscribers
              </span>
            </div>

            <div className="space-y-3">
              {userPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="p-4 rounded-2xl border border-[#EFE8DA] bg-cream-50/50 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-stone-900 text-sm">
                          {plan.customerName || 'Saurabh Sharma'}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-800 uppercase">
                          {plan.planType} Plan
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cream-200 text-stone-700 uppercase">
                          {plan.mealSlot}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {plan.customerPhone || '+91 98765 43210'} • Subscribed to {plan.planName}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="text-xs font-bold text-stone-700 bg-white px-2.5 py-1 rounded-xl border border-[#E3D7C1]">
                        {plan.consumedMeals}/{plan.totalMeals} meals served
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-xl border ${
                          plan.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {plan.status}
                      </span>
                    </div>
                  </div>

                  {/* Destination snapshot */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-[#EFE8DA]">
                    <div className="flex items-center gap-1.5 text-stone-600">
                      <span className="font-bold text-amber-800">☀️ Lunch Destination:</span>
                      <span className="truncate">Office Desk (Prestige Tech Park)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-stone-600">
                      <span className="font-bold text-indigo-800">🌙 Dinner Destination:</span>
                      <span className="truncate">PG Room 304 (Stanza Living)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MENU & 7-DAY ROTATING SCHEDULE */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          {/* Today's Menu Highlight Editor */}
          <div className="bg-white rounded-3xl border border-[#EFE8DA] p-5 sm:p-7 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE8DA]">
              <div>
                <h3 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>Update Today’s Menu Highlights</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Changes here appear instantly on customer provider cards and detail pages.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveDailyMenu} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-amber-800 block mb-1">
                    ☀️ Afternoon Lunch Special Dish
                  </label>
                  <textarea
                    rows={2}
                    value={lunchSpecialInput}
                    onChange={(e) => setLunchSpecialInput(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-amber-200 bg-amber-50/30 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    placeholder="e.g. Amritsari Dal Tadka + Bhindi Do Pyaza + 4 Desi Ghee Phulkas"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-indigo-800 block mb-1">
                    🌙 Night Dinner Special Dish
                  </label>
                  <textarea
                    rows={2}
                    value={dinnerSpecialInput}
                    onChange={(e) => setDinnerSpecialInput(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-indigo-200 bg-indigo-50/30 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="e.g. Paneer Butter Masala (Homestyle) + Jeera Rice + Warm Phulkas"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Today’s Menu</span>
                </button>
              </div>
            </form>
          </div>

          {/* 7-Day Weekly Schedule Editor */}
          <div className="bg-white rounded-3xl border border-[#EFE8DA] p-5 sm:p-7 shadow-soft space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EFE8DA]">
              <div>
                <h3 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-600" />
                  <span>Configure 7-Day Rotating Menu Calendar</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Select a day to update the detailed course offerings and calorie counts.
                </p>
              </div>
            </div>

            {/* Day Selector Tabs */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 bg-cream-100 p-1.5 rounded-2xl border border-[#E3D7C1]">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectWeekDay(day)}
                  className={`py-2 px-1 rounded-xl text-center flex flex-col items-center justify-center transition-all ${
                    selectedWeekDay.toLowerCase() === day.toLowerCase()
                      ? 'bg-brand-700 text-white font-bold shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-cream-200/80 font-medium'
                  }`}
                >
                  <span className="text-[11px] uppercase">{day.slice(0, 3)}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveWeeklySchedule} className="space-y-5">
              <h4 className="text-sm font-bold text-stone-900">
                Editing Menu for {selectedWeekDay}
              </h4>

              {/* Lunch Breakdown Form */}
              <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/30 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block">
                  ☀️ Lunch Courses ({selectedWeekDay})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-stone-600 block mb-1">Main Curry / Dal</label>
                    <input
                      type="text"
                      value={editLunchMain}
                      onChange={(e) => setEditLunchMain(e.target.value)}
                      className="w-full p-2 rounded-xl border border-amber-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-600 block mb-1">Dry Sabzi</label>
                    <input
                      type="text"
                      value={editLunchSabzi}
                      onChange={(e) => setEditLunchSabzi(e.target.value)}
                      className="w-full p-2 rounded-xl border border-amber-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-600 block mb-1">Breads (Phulkas)</label>
                    <input
                      type="text"
                      value={editLunchBreads}
                      onChange={(e) => setEditLunchBreads(e.target.value)}
                      className="w-full p-2 rounded-xl border border-amber-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-600 block mb-1">Rice</label>
                    <input
                      type="text"
                      value={editLunchRice}
                      onChange={(e) => setEditLunchRice(e.target.value)}
                      className="w-full p-2 rounded-xl border border-amber-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-600 block mb-1">Sides & Salad</label>
                    <input
                      type="text"
                      value={editLunchSides}
                      onChange={(e) => setEditLunchSides(e.target.value)}
                      className="w-full p-2 rounded-xl border border-amber-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-600 block mb-1">Calories (kcal)</label>
                    <input
                      type="number"
                      value={editLunchCalories}
                      onChange={(e) => setEditLunchCalories(Number(e.target.value))}
                      className="w-full p-2 rounded-xl border border-amber-200 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Dinner Breakdown Form */}
              <div className="p-4 rounded-2xl border border-indigo-200 bg-indigo-50/30 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 block">
                  🌙 Dinner Courses ({selectedWeekDay})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-stone-600 block mb-1">Main Curry</label>
                    <input
                      type="text"
                      value={editDinnerMain}
                      onChange={(e) => setEditDinnerMain(e.target.value)}
                      className="w-full p-2 rounded-xl border border-indigo-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-600 block mb-1">Dry Sabzi</label>
                    <input
                      type="text"
                      value={editDinnerSabzi}
                      onChange={(e) => setEditDinnerSabzi(e.target.value)}
                      className="w-full p-2 rounded-xl border border-indigo-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-600 block mb-1">Breads</label>
                    <input
                      type="text"
                      value={editDinnerBreads}
                      onChange={(e) => setEditDinnerBreads(e.target.value)}
                      className="w-full p-2 rounded-xl border border-indigo-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-600 block mb-1">Rice</label>
                    <input
                      type="text"
                      value={editDinnerRice}
                      onChange={(e) => setEditDinnerRice(e.target.value)}
                      className="w-full p-2 rounded-xl border border-indigo-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-600 block mb-1">Sides</label>
                    <input
                      type="text"
                      value={editDinnerSides}
                      onChange={(e) => setEditDinnerSides(e.target.value)}
                      className="w-full p-2 rounded-xl border border-indigo-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-600 block mb-1">Calories (kcal)</label>
                    <input
                      type="number"
                      value={editDinnerCalories}
                      onChange={(e) => setEditDinnerCalories(Number(e.target.value))}
                      className="w-full p-2 rounded-xl border border-indigo-200 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save {selectedWeekDay}’s Menu</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: CAPACITY, CUTOFF RULES & SERVICE AREAS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-[#EFE8DA] p-5 sm:p-7 shadow-soft space-y-6">
          <div className="pb-3 border-b border-[#EFE8DA]">
            <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-brand-700" />
              <span>Configure Kitchen Capacity, Cutoffs & Service Areas</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              These rules automatically govern customer cancellations, order capacity caps, and address switch eligibility.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-5">
            {/* Meal Price & Capacity Caps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                  Starting Meal Price (₹)
                </label>
                <input
                  type="number"
                  value={priceInput}
                  onChange={(e) => setPriceInput(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-[#E3D7C1] bg-white text-sm font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                  Max Daily Kitchen Capacity (Meals/day)
                </label>
                <input
                  type="number"
                  value={capacityInput}
                  onChange={(e) => setCapacityInput(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-[#E3D7C1] bg-white text-sm font-bold"
                />
                <span className="text-[10px] text-stone-400 mt-0.5 block">
                  Prevents orders when capacity is reached.
                </span>
              </div>
            </div>

            {/* Delivery Slots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                  ☀️ Lunch Delivery Slot
                </label>
                <input
                  type="text"
                  value={lunchSlotInput}
                  onChange={(e) => setLunchSlotInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E3D7C1] bg-white text-xs sm:text-sm font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                  🌙 Dinner Delivery Slot
                </label>
                <input
                  type="text"
                  value={dinnerSlotInput}
                  onChange={(e) => setDinnerSlotInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E3D7C1] bg-white text-xs sm:text-sm font-semibold"
                />
              </div>
            </div>

            {/* Cancellation Cutoffs */}
            <div className="p-4 bg-cream-50 rounded-2xl border border-[#EFE8DA] space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                Cancellation & Skip Cutoff Rules
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-stone-600 block mb-1">Lunch Cancellation Cutoff</label>
                  <input
                    type="text"
                    value={lunchCutoffInput}
                    onChange={(e) => setLunchCutoffInput(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[#E3D7C1] bg-white text-xs font-bold"
                    placeholder="e.g. 10:30 AM"
                  />
                  <span className="text-[10px] text-stone-400 mt-0.5 block">
                    Customer cannot cancel or skip lunch after this time.
                  </span>
                </div>

                <div>
                  <label className="font-semibold text-stone-600 block mb-1">Dinner Cancellation Cutoff</label>
                  <input
                    type="text"
                    value={dinnerCutoffInput}
                    onChange={(e) => setDinnerCutoffInput(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[#E3D7C1] bg-white text-xs font-bold"
                    placeholder="e.g. 05:30 PM"
                  />
                  <span className="text-[10px] text-stone-400 mt-0.5 block">
                    Customer cannot cancel or skip dinner after this time.
                  </span>
                </div>
              </div>
            </div>

            {/* Serviceable Delivery Areas */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                Serviceable Delivery Areas (Bengaluru)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Koramangala, 5th Block',
                  'HSR Layout, Sector 3',
                  'Indiranagar, 12th Main',
                  'BTM Layout, 2nd Stage',
                  'Bellandur & Green Glen',
                  'Whitefield, ITPL Main Rd',
                ].map((area) => {
                  const isChecked = serviceAreasInput.includes(area);
                  return (
                    <button
                      key={area}
                      type="button"
                      onClick={() => toggleServiceArea(area)}
                      className={`p-3 rounded-2xl border text-left flex items-center justify-between text-xs transition-all ${
                        isChecked
                          ? 'bg-brand-50 border-brand-500 font-bold text-brand-950'
                          : 'bg-white border-[#EFE8DA] text-stone-600 hover:border-brand-200'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-brand-600" />
                        <span>{area}</span>
                      </span>
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-brand-600" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-stone-300" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-md transition-all flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Kitchen Rules & Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
