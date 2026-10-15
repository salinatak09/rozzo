'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  Check,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  Building,
  Briefcase,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  CalendarHeart,
} from 'lucide-react';
import { TiffinProvider, SubscriptionPlan, MealSlot, Address } from '../types';
import { useApp } from '../context/AppContext';

interface BookingSummaryModalProps {
  provider: TiffinProvider;
  initialPlan?: SubscriptionPlan;
  isOpen: boolean;
  onClose: () => void;
}

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

export default function BookingSummaryModal({
  provider,
  initialPlan,
  isOpen,
  onClose,
}: BookingSummaryModalProps) {
  const { addresses, addPlanWithBooking } = useApp();

  // Find saved PG and Office addresses
  const pgAddress = addresses.find((a) => a.type === 'PG / Hostel') || addresses[0];
  const officeAddress = addresses.find((a) => a.type === 'Office') || addresses[1] || addresses[0];

  // Plan state
  const [activePlan, setActivePlan] = useState<SubscriptionPlan>(
    initialPlan || provider.plans.find((p) => p.type === 'weekly') || provider.plans[0]
  );

  // Meal customization
  const [mealSlot, setMealSlot] = useState<MealSlot>('both');
  const [selectedDays, setSelectedDays] = useState<string[]>([...ALL_DAYS]);

  // Per-meal delivery address allocation
  const [lunchAddressId, setLunchAddressId] = useState<string>(officeAddress?.id || addresses[0]?.id || '');
  const [dinnerAddressId, setDinnerAddressId] = useState<string>(pgAddress?.id || addresses[0]?.id || '');

  // Booking step: 1 = Customizer, 2 = Booking Summary & Confirmation, 3 = Success confirmation
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Sync if initialPlan changes
  useEffect(() => {
    if (initialPlan) {
      setActivePlan(initialPlan);
    }
  }, [initialPlan]);

  // Reset step on open
  useEffect(() => {
    if (isOpen) {
      setStep(1);
    }
  }, [isOpen]);

  if (!isOpen || !activePlan) return null;

  // Day toggle
  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length === 1) return; // Must keep at least 1 day
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const setWeekdayPreset = () => {
    setSelectedDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  };

  const setAllDaysPreset = () => {
    setSelectedDays([...ALL_DAYS]);
  };

  // Math calculation
  const multiplier = mealSlot === 'both' ? 2 : 1;
  const totalMeals = activePlan.durationDays * multiplier;
  const totalPrice = activePlan.pricePerMeal * totalMeals;
  const originalTotalPrice = activePlan.originalPricePerMeal * totalMeals;
  const totalSavings = originalTotalPrice - totalPrice;

  // Dates
  const today = new Date();
  const startDateObj = new Date(today);
  startDateObj.setDate(today.getDate() + 1); // Starts tomorrow
  const startDateStr = startDateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const endDateObj = new Date(startDateObj);
  endDateObj.setDate(startDateObj.getDate() + activePlan.durationDays);
  const endDateStr = endDateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const lunchAddrObj = addresses.find((a) => a.id === lunchAddressId) || addresses[0];
  const dinnerAddrObj = addresses.find((a) => a.id === dinnerAddressId) || addresses[0];

  const handleConfirmOrder = () => {
    addPlanWithBooking({
      provider,
      planId: activePlan.id,
      mealSlot,
      lunchAddressId,
      dinnerAddressId,
      selectedDays,
      startDate: startDateObj.toISOString(),
    });
    setStep(3);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/65 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FCFAF6] rounded-3xl max-w-xl w-full border border-[#E3D7C1] shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#EFE8DA] bg-white/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="w-8 h-8 rounded-full bg-cream-200 hover:bg-cream-300 flex items-center justify-center text-stone-700 transition-colors mr-1"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-1.5 text-xs text-brand-700 font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {step === 1 ? 'Configure Subscription' : step === 2 ? 'Review Booking Summary' : 'Subscription Confirmed!'}
                </span>
              </div>
              <h3 className="text-lg font-black text-stone-900 leading-tight">
                {provider.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream-200 hover:bg-cream-300 flex items-center justify-center text-stone-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5 flex-1">
          {/* STEP 1: Plan & Meal Customizer */}
          {step === 1 && (
            <>
              {/* Plan Tier Selection: Trial, Weekly, Monthly */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
                  1. Choose Subscription Tier (Trial, Weekly, Monthly)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {provider.plans.map((p) => {
                    const isSelected = activePlan.id === p.id;
                    const tierLabel = p.type === 'trial' ? '🧪 Trial' : p.type === 'weekly' ? '📅 Weekly' : '🌟 Monthly';

                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setActivePlan(p)}
                        className={`p-3 rounded-2xl border text-left transition-all relative ${
                          isSelected
                            ? 'border-brand-600 bg-brand-50/80 ring-2 ring-brand-600 shadow-sm'
                            : 'border-[#EFE8DA] bg-white hover:border-brand-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-800">
                            {tierLabel}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-brand-100 text-brand-800">
                            {p.savingsPercent}% OFF
                          </span>
                        </div>
                        <h4 className="font-extrabold text-xs sm:text-sm text-stone-900 leading-snug">
                          {p.title}
                        </h4>
                        <div className="flex items-baseline gap-1 mt-1.5">
                          <span className="text-base font-black text-stone-900">₹{p.pricePerMeal}</span>
                          <span className="text-[10px] text-stone-400 line-through">₹{p.originalPricePerMeal}</span>
                          <span className="text-[10px] text-stone-500">/meal</span>
                        </div>
                        <span className="text-[10px] text-stone-500 block mt-0.5">
                          {p.durationDays} days duration
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Meal Slot Selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
                  2. Daily Meal Window
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMealSlot('lunch')}
                    className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all text-center ${
                      mealSlot === 'lunch'
                        ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-sm'
                        : 'border-[#EFE8DA] bg-white text-stone-700 hover:bg-cream-100'
                    }`}
                  >
                    ☀️ Lunch Only
                  </button>
                  <button
                    type="button"
                    onClick={() => setMealSlot('dinner')}
                    className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all text-center ${
                      mealSlot === 'dinner'
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-900 shadow-sm'
                        : 'border-[#EFE8DA] bg-white text-stone-700 hover:bg-cream-100'
                    }`}
                  >
                    🌙 Dinner Only
                  </button>
                  <button
                    type="button"
                    onClick={() => setMealSlot('both')}
                    className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all text-center ${
                      mealSlot === 'both'
                        ? 'border-brand-600 bg-brand-50 text-brand-900 shadow-sm ring-1 ring-brand-500'
                        : 'border-[#EFE8DA] bg-white text-stone-700 hover:bg-cream-100'
                    }`}
                  >
                    ✨ Lunch + Dinner
                  </button>
                </div>
                <p className="text-[11px] text-stone-500 mt-1.5">
                  Lunch delivered: {provider.deliverySlots.lunch} • Dinner delivered: {provider.deliverySlots.dinner}
                </p>
              </div>

              {/* Selectable Days for Subscription */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    3. Delivery Days (Selectable Calendar)
                  </label>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <button
                      type="button"
                      onClick={setWeekdayPreset}
                      className="text-brand-700 font-bold hover:underline"
                    >
                      Mon-Fri Only
                    </button>
                    <span className="text-stone-300">•</span>
                    <button
                      type="button"
                      onClick={setAllDaysPreset}
                      className="text-brand-700 font-bold hover:underline"
                    >
                      All 7 Days
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 sm:gap-1.5 bg-cream-100 p-2 rounded-2xl border border-[#E3D7C1]">
                  {ALL_DAYS.map((day) => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`py-2 rounded-xl text-center flex flex-col items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-brand-700 text-white font-bold shadow-sm'
                            : 'bg-white/80 text-stone-400 hover:text-stone-700 hover:bg-white font-medium border border-transparent'
                        }`}
                      >
                        <span className="text-[11px] uppercase">{day.slice(0, 3)}</span>
                        {isSelected ? (
                          <Check className="w-3 h-3 text-white mt-0.5" />
                        ) : (
                          <span className="text-[10px] text-stone-400 mt-0.5">-</span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Active days: {selectedDays.length} days/week. Unselected days will automatically pause delivery.
                </p>
              </div>

              {/* Meal-Level Delivery Address Assignment (PG vs Office) */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    4. Meal Address Allocation (PG vs Office)
                  </label>
                  <span className="text-[10px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                    Customizable per meal
                  </span>
                </div>

                {/* Lunch Address Selector (if lunch or both is selected) */}
                {(mealSlot === 'lunch' || mealSlot === 'both') && (
                  <div className="p-3.5 bg-amber-50/50 rounded-2xl border border-amber-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-amber-700" />
                        <span>☀️ Lunch Delivery Address</span>
                      </span>
                      <span className="text-[10px] text-amber-700 font-medium">Delivered ~12:30 PM</span>
                    </div>

                    <select
                      value={lunchAddressId}
                      onChange={(e) => setLunchAddressId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    >
                      {addresses.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.type}: {a.title} ({a.roomFlat}, {a.area})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Dinner Address Selector (if dinner or both is selected) */}
                {(mealSlot === 'dinner' || mealSlot === 'both') && (
                  <div className="p-3.5 bg-indigo-50/50 rounded-2xl border border-indigo-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-indigo-700" />
                        <span>🌙 Dinner Delivery Address</span>
                      </span>
                      <span className="text-[10px] text-indigo-700 font-medium">Delivered ~7:45 PM</span>
                    </div>

                    <select
                      value={dinnerAddressId}
                      onChange={(e) => setDinnerAddressId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-indigo-300 bg-white text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      {addresses.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.type}: {a.title} ({a.roomFlat}, {a.area})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </>
          )}

          {/* STEP 2: Booking Summary & Breakdown */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-brand-50/70 p-4 rounded-2xl border border-brand-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-800 block">
                    Reviewing Subscription
                  </span>
                  <h4 className="text-base font-extrabold text-stone-900">{activePlan.title}</h4>
                  <p className="text-xs text-stone-600 mt-0.5">
                    {activePlan.durationDays} Days • {mealSlot === 'both' ? 'Lunch & Dinner' : mealSlot.toUpperCase()} ({totalMeals} Meals Total)
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-brand-900">₹{totalPrice}</span>
                  <span className="text-xs text-brand-700 font-bold block">Save ₹{totalSavings}</span>
                </div>
              </div>

              {/* Schedule and dates summary */}
              <div className="bg-white p-4 rounded-2xl border border-[#EFE8DA] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500 font-medium">Service Start Date:</span>
                  <span className="font-bold text-stone-900">{startDateStr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 font-medium">Validity Ends:</span>
                  <span className="font-bold text-stone-900">{endDateStr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 font-medium">Weekly Delivery Days:</span>
                  <span className="font-bold text-stone-900">
                    {selectedDays.length === 7 ? 'All 7 Days' : selectedDays.join(', ')}
                  </span>
                </div>
              </div>

              {/* Delivery addresses snapshot */}
              <div className="bg-white p-4 rounded-2xl border border-[#EFE8DA] space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                  Delivery Destination Snapshot
                </span>

                {(mealSlot === 'lunch' || mealSlot === 'both') && (
                  <div className="flex items-start gap-2.5 text-xs">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[10px] mt-0.5">
                      ☀️
                    </span>
                    <div>
                      <span className="font-bold text-stone-900">Lunch to: {lunchAddrObj?.title}</span>
                      <span className="text-[10px] text-amber-800 ml-1.5 font-semibold bg-amber-100 px-1.5 py-0.2 rounded">
                        {lunchAddrObj?.type}
                      </span>
                      <p className="text-stone-500 text-[11px] mt-0.5">
                        {lunchAddrObj?.roomFlat}, {lunchAddrObj?.buildingName}, {lunchAddrObj?.area}
                      </p>
                    </div>
                  </div>
                )}

                {(mealSlot === 'dinner' || mealSlot === 'both') && (
                  <div className="flex items-start gap-2.5 text-xs">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-[10px] mt-0.5">
                      🌙
                    </span>
                    <div>
                      <span className="font-bold text-stone-900">Dinner to: {dinnerAddrObj?.title}</span>
                      <span className="text-[10px] text-indigo-800 ml-1.5 font-semibold bg-indigo-100 px-1.5 py-0.2 rounded">
                        {dinnerAddrObj?.type}
                      </span>
                      <p className="text-stone-500 text-[11px] mt-0.5">
                        {dinnerAddrObj?.roomFlat}, {dinnerAddrObj?.buildingName}, {dinnerAddrObj?.area}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Itemized Price Summary */}
              <div className="bg-cream-100 p-4 rounded-2xl border border-[#E3D7C1] space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Meal Price ({totalMeals} meals × ₹{activePlan.pricePerMeal})</span>
                  <span className="font-semibold text-stone-900">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-brand-700 font-semibold">
                  <span>Plan Subscription Discount</span>
                  <span>-₹{totalSavings}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Doorstep Delivery & Hot Packaging</span>
                  <span className="text-brand-700 font-bold uppercase">FREE</span>
                </div>
                <div className="pt-2 border-t border-[#E3D7C1] flex justify-between items-baseline">
                  <span className="text-sm font-bold text-stone-900">Total Price</span>
                  <span className="text-xl font-black text-stone-900">₹{totalPrice}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Order Confirmation Screen */}
          {step === 3 && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-black text-stone-900">Tiffin Subscription Activated!</h4>
                <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto mt-1">
                  Your first meal delivery from <strong>{provider.name}</strong> will arrive tomorrow.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#EFE8DA] max-w-sm mx-auto text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500">Plan:</span>
                  <span className="font-bold text-stone-900">{activePlan.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">First Delivery:</span>
                  <span className="font-bold text-stone-900">Tomorrow ({mealSlot === 'dinner' ? 'Dinner' : 'Lunch'})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Lunch Destination:</span>
                  <span className="font-bold text-stone-900">{lunchAddrObj?.type} ({lunchAddrObj?.title})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Dinner Destination:</span>
                  <span className="font-bold text-stone-900">{dinnerAddrObj?.type} ({dinnerAddrObj?.title})</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <a
                  href="/plans"
                  className="px-5 py-2.5 rounded-2xl bg-brand-700 text-white font-bold text-xs sm:text-sm hover:bg-brand-800 transition-colors shadow-sm"
                >
                  View In My Plans
                </a>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-2xl bg-cream-200 text-stone-700 font-bold text-xs sm:text-sm hover:bg-cream-300 transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {step !== 3 && (
          <div className="p-4 sm:p-5 border-t border-[#EFE8DA] bg-white/70 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Payable</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-stone-900">₹{totalPrice}</span>
                <span className="text-[11px] text-stone-400 line-through">₹{originalTotalPrice}</span>
              </div>
            </div>

            {step === 1 ? (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-3 px-6 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs sm:text-sm shadow-floating flex items-center gap-1.5 transition-all transform active:scale-95"
              >
                <span>Proceed to Summary</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirmOrder}
                className="py-3 px-6 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs sm:text-sm shadow-floating flex items-center gap-1.5 transition-all transform active:scale-95"
              >
                <span>Confirm & Start Plan</span>
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
