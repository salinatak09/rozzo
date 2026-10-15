'use client';

import React, { useState } from 'react';
import { X, Check, ShieldCheck, MapPin, Calendar, Clock, IndianRupee, Sparkles } from 'lucide-react';
import { TiffinProvider, SubscriptionPlan, MealSlot } from '../types';
import { useApp } from '../context/AppContext';

interface SubscribeModalProps {
  provider: TiffinProvider;
  selectedPlan: SubscriptionPlan | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscribeModal({ provider, selectedPlan, isOpen, onClose }: SubscribeModalProps) {
  const { addresses, addPlan } = useApp();

  const [mealSlot, setMealSlot] = useState<MealSlot>('lunch');
  const [selectedAddressId, setSelectedAddressId] = useState<string>(addresses[0]?.id || '');
  const [activePlan, setActivePlan] = useState<SubscriptionPlan | null>(selectedPlan || provider.plans[0]);

  // Keep activePlan updated if prop changes
  React.useEffect(() => {
    if (selectedPlan) {
      setActivePlan(selectedPlan);
    }
  }, [selectedPlan]);

  if (!isOpen || !activePlan) return null;

  const multiplier = mealSlot === 'both' ? 2 : 1;
  const totalMeals = activePlan.durationDays * multiplier;
  const totalPrice = activePlan.pricePerMeal * totalMeals;
  const originalTotalPrice = activePlan.originalPricePerMeal * totalMeals;
  const totalSavings = originalTotalPrice - totalPrice;

  const handleConfirm = () => {
    addPlan(provider, activePlan.id, mealSlot, selectedAddressId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FCFAF6] rounded-3xl max-w-lg w-full border border-[#E3D7C1] shadow-2xl overflow-hidden p-5 sm:p-7 relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EFE8DA]">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-brand-700 font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Subscribe to Homestyle Tiffin</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 leading-tight mt-0.5">
              {provider.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream-200 hover:bg-cream-300 flex items-center justify-center text-stone-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto space-y-5 py-4 pr-1 flex-1">
          {/* Step 1: Pick Plan Pack */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
              1. Select Duration Plan
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {provider.plans.map((p) => {
                const isCurrent = activePlan.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActivePlan(p)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isCurrent
                        ? 'border-brand-600 bg-brand-50/80 shadow-sm ring-1 ring-brand-600'
                        : 'border-[#EFE8DA] bg-white hover:border-brand-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-stone-900">{p.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-800">
                        {p.savingsPercent}% OFF
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-base font-extrabold text-stone-900">₹{p.pricePerMeal}</span>
                      <span className="text-xs text-stone-400 line-through">₹{p.originalPricePerMeal}</span>
                      <span className="text-[11px] text-stone-500">/meal</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Meal Slot (Lunch / Dinner / Both) */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
              2. Choose Daily Meal Window
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMealSlot('lunch')}
                className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
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
                className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
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
                className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                  mealSlot === 'both'
                    ? 'border-brand-600 bg-brand-50 text-brand-900 shadow-sm'
                    : 'border-[#EFE8DA] bg-white text-stone-700 hover:bg-cream-100'
                }`}
              >
                ✨ Both Meals
              </button>
            </div>
            <p className="text-[11px] text-stone-500 mt-1.5 flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" />
              <span>
                {mealSlot === 'lunch'
                  ? `Delivered ${provider.deliverySlots.lunch}`
                  : mealSlot === 'dinner'
                  ? `Delivered ${provider.deliverySlots.dinner}`
                  : `Lunch: ${provider.deliverySlots.lunch} • Dinner: ${provider.deliverySlots.dinner}`}
              </span>
            </p>
          </div>

          {/* Step 3: Delivery Address (PG / Office / Home) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                3. Deliver To Saved Address
              </label>
              <span className="text-[11px] text-brand-700 font-semibold">Switchable daily</span>
            </div>
            <div className="space-y-2">
              {addresses.map((addr) => {
                const isSelected = selectedAddressId === addr.id;
                return (
                  <button
                    key={addr.id}
                    type="button"
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-start justify-between transition-all ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50/70 shadow-sm'
                        : 'border-[#EFE8DA] bg-white hover:border-brand-200'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 p-1 rounded-full bg-cream-200 text-stone-700">
                        <MapPin className="w-3.5 h-3.5 text-brand-700" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-900">{addr.title}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cream-200 font-semibold text-stone-600">
                            {addr.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                          {addr.roomFlat}, {addr.buildingName}, {addr.area}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transparent Cost Breakdown */}
          <div className="bg-cream-100 p-4 rounded-2xl border border-[#E3D7C1] space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-600">
              <span>
                Plan ({totalMeals} meals @ ₹{activePlan.pricePerMeal})
              </span>
              <span className="font-semibold text-stone-800">₹{totalPrice}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-brand-700 font-medium">
              <span>Subscription Savings</span>
              <span>-₹{totalSavings}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-stone-600">
              <span>Zero Delivery Fee (Rozzo Pass)</span>
              <span className="text-brand-700 font-bold uppercase">FREE</span>
            </div>
            <div className="pt-2 border-t border-[#E3D7C1] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-900 block">Total Payable</span>
                <span className="text-[10px] text-stone-500">Includes all taxes & packaging</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-stone-900">₹{totalPrice}</span>
                <span className="text-xs text-stone-400 line-through block -mt-1">₹{originalTotalPrice}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="pt-3 border-t border-[#EFE8DA]">
          <button
            onClick={handleConfirm}
            className="w-full py-3.5 px-4 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm sm:text-base shadow-floating flex items-center justify-center gap-2 active:scale-[0.99] transition-transform"
          >
            <span>Confirm & Start Tiffin Service</span>
            <span className="bg-brand-900/60 px-2 py-0.5 rounded-lg text-xs font-bold">₹{totalPrice}</span>
          </button>
          <p className="text-[11px] text-center text-stone-400 mt-2">
            No long term lock-in • Pause or cancel with 1-click anytime
          </p>
        </div>
      </div>
    </div>
  );
}
