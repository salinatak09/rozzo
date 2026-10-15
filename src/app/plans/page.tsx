'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import {
  CalendarHeart,
  Clock,
  MapPin,
  PauseCircle,
  PlayCircle,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Briefcase,
  Building,
  Calendar,
  FastForward,
  AlertTriangle,
  Bike,
} from 'lucide-react';

export default function PlansPage() {
  const {
    userPlans,
    addresses,
    providers,
    pastOrders,
    togglePausePlan,
    validateAndSwitchAddress,
    skipMeal,
  } = useApp();

  const [skipSlotChoice, setSkipSlotChoice] = useState<'Lunch' | 'Dinner'>('Lunch');
  const [skipModalPlanId, setSkipModalPlanId] = useState<string | null>(null);

  const handleOpenSkip = (planId: string, defaultSlot: 'Lunch' | 'Dinner') => {
    setSkipModalPlanId(planId);
    setSkipSlotChoice(defaultSlot);
  };

  const handleConfirmSkip = () => {
    if (skipModalPlanId) {
      skipMeal(skipModalPlanId, skipSlotChoice);
      setSkipModalPlanId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EFE8DA]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-brand-100 text-brand-800">
              <CalendarHeart className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              My Tiffin Subscriptions
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Manage your daily home meals, allocate Lunch to Office and Dinner to PG, or pause anytime.
          </p>
        </div>

        <Link
          href="/"
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
        >
          <span>Explore New Plans</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Active Plans List */}
      {userPlans.length > 0 ? (
        <div className="space-y-6">
          {userPlans.map((plan) => {
            const isPaused = plan.status === 'Paused';
            const progressPercent = Math.round((plan.consumedMeals / plan.totalMeals) * 100);
            const remainingMeals = plan.totalMeals - plan.consumedMeals;
            const provider = providers.find((p) => p.id === plan.providerId);

            const lunchAddress =
              addresses.find((a) => a.id === (plan.lunchAddressId || plan.addressId)) || addresses[0];
            const dinnerAddress =
              addresses.find((a) => a.id === (plan.dinnerAddressId || plan.addressId)) || addresses[0];

            const activeOrder = pastOrders.find(
              (o) =>
                o.providerId === plan.providerId &&
                (o.status === 'Preparing' ||
                  o.status === 'Ready' ||
                  o.status === 'Assigned' ||
                  o.status === 'Picked Up' ||
                  o.status === 'Out for Delivery')
            );

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-3xl border overflow-hidden shadow-soft transition-all duration-300 ${
                  isPaused ? 'border-amber-200 bg-amber-50/20' : 'border-[#EFE8DA]'
                }`}
              >
                {/* Status Bar */}
                <div
                  className={`px-5 py-2.5 text-xs font-bold flex items-center justify-between ${
                    isPaused
                      ? 'bg-amber-100/80 text-amber-900 border-b border-amber-200'
                      : 'bg-brand-50 text-brand-900 border-b border-brand-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isPaused ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'
                      }`}
                    />
                    <span>
                      {isPaused
                        ? 'Subscription Paused • No deductions made'
                        : plan.isSkippedToday
                        ? "Today's meal skipped (Credit preserved) • Resumes tomorrow"
                        : `Next Delivery: ${plan.nextMealDelivery}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="uppercase text-[10px] tracking-wider font-extrabold px-2 py-0.5 rounded bg-brand-200/60 text-brand-900">
                      {plan.planType ? `${plan.planType.toUpperCase()} PLAN` : 'ACTIVE PLAN'}
                    </span>
                    <span className="uppercase text-[10px] tracking-wider font-extrabold px-2 py-0.5 rounded bg-stone-200 text-stone-700">
                      {plan.mealSlot.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-7 space-y-6">
                  {/* Provider Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-cream-200 flex-shrink-0 border border-[#E3D7C1]">
                        <Image
                          src={plan.providerImage}
                          alt={plan.providerName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                          {plan.planName}
                        </span>
                        <h3 className="text-lg font-black text-stone-900 tracking-tight">
                          {plan.providerName}
                        </h3>
                        <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span>Delivery Window: {plan.deliveryTimeSlot}</span>
                        </p>
                      </div>
                    </div>

                    {/* Subscription Quick Stats */}
                    <div className="flex items-center gap-3 self-start sm:self-auto bg-cream-50 p-2.5 rounded-2xl border border-[#EFE8DA] text-center">
                      <div className="px-2">
                        <span className="block text-base font-extrabold text-stone-900">
                          {plan.consumedMeals}/{plan.totalMeals}
                        </span>
                        <span className="text-[10px] text-stone-500 font-medium">Meals Done</span>
                      </div>
                      <div className="w-px h-6 bg-stone-200" />
                      <div className="px-2">
                        <span className="block text-base font-extrabold text-brand-700">
                          {remainingMeals}
                        </span>
                        <span className="text-[10px] text-stone-500 font-medium">Meals Left</span>
                      </div>
                    </div>
                  </div>

                  {/* Active In-Flight Delivery Banner */}
                  {activeOrder && (
                    <div className="p-3.5 rounded-2xl bg-brand-50 border border-brand-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center flex-shrink-0 animate-pulse">
                          <Bike className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 font-extrabold text-brand-900">
                            <span>Today's {activeOrder.mealType} is {activeOrder.status}!</span>
                            {activeOrder.estimatedMinutesAway !== undefined && activeOrder.estimatedMinutesAway > 0 && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-brand-200 text-brand-800">
                                ~{activeOrder.estimatedMinutesAway} mins away
                              </span>
                            )}
                          </div>
                          <span className="text-brand-700 text-[11px] block">
                            Delivering to: {activeOrder.addressSnapshot}
                          </span>
                        </div>
                      </div>

                      <Link
                        href="/orders"
                        className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-xs transition-colors self-start sm:self-auto"
                      >
                        <span>Track Live Run</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}

                  {/* Meal Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-stone-600 font-medium">
                      <span>Subscription Progress</span>
                      <span>
                        {progressPercent}% completed ({remainingMeals} meals remaining)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-cream-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-600 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Per-Meal Delivery Address Chooser (PG vs Office) */}
                  <div className="space-y-2.5 bg-cream-50/70 p-4 rounded-2xl border border-[#EFE8DA]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        Assigned Delivery Destinations (PG vs Office)
                      </span>
                      <span className="text-[10px] text-brand-700 font-semibold bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                        Service area validated
                      </span>
                    </div>

                    {/* Lunch destination row */}
                    {(plan.mealSlot === 'lunch' || plan.mealSlot === 'both') && (
                      <div className="p-3 bg-white rounded-xl border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="flex items-start gap-2.5">
                          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 mt-0.5">
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-stone-900">
                                ☀️ Lunch Delivery: {lunchAddress.title}
                              </span>
                              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900">
                                {lunchAddress.type}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-500 mt-0.5">
                              {lunchAddress.roomFlat}, {lunchAddress.buildingName}, {lunchAddress.area}
                            </p>
                          </div>
                        </div>

                        <select
                          value={lunchAddress.id}
                          onChange={(e) => validateAndSwitchAddress(plan.id, 'lunch', e.target.value)}
                          className="text-xs font-bold bg-cream-50 text-stone-800 border border-[#E3D7C1] rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer self-end sm:self-auto"
                        >
                          {addresses.map((a) => (
                            <option key={a.id} value={a.id}>
                              Switch Lunch to: {a.type} ({a.title})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Dinner destination row */}
                    {(plan.mealSlot === 'dinner' || plan.mealSlot === 'both') && (
                      <div className="p-3 bg-white rounded-xl border border-indigo-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="flex items-start gap-2.5">
                          <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-800 mt-0.5">
                            <Building className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-stone-900">
                                🌙 Dinner Delivery: {dinnerAddress.title}
                              </span>
                              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-900">
                                {dinnerAddress.type}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-500 mt-0.5">
                              {dinnerAddress.roomFlat}, {dinnerAddress.buildingName}, {dinnerAddress.area}
                            </p>
                          </div>
                        </div>

                        <select
                          value={dinnerAddress.id}
                          onChange={(e) => validateAndSwitchAddress(plan.id, 'dinner', e.target.value)}
                          className="text-xs font-bold bg-cream-50 text-stone-800 border border-[#E3D7C1] rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer self-end sm:self-auto"
                        >
                          {addresses.map((a) => (
                            <option key={a.id} value={a.id}>
                              Switch Dinner to: {a.type} ({a.title})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Cutoff Rules & Skip Alert */}
                  <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-700 flex-shrink-0" />
                      <span>
                        Cutoff Rules: Lunch changes before <strong>{provider?.lunchCutoffTime || '10:30 AM'}</strong> • Dinner before <strong>{provider?.dinnerCutoffTime || '05:30 PM'}</strong>.
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenSkip(plan.id, plan.mealSlot === 'dinner' ? 'Dinner' : 'Lunch')}
                      className="px-3 py-1 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-xs self-start sm:self-auto transition-colors flex items-center gap-1"
                    >
                      <FastForward className="w-3.5 h-3.5" />
                      <span>Skip Upcoming Meal</span>
                    </button>
                  </div>

                  {/* Action Controls */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-stone-500">
                      Validity: <span className="font-semibold text-stone-800">{plan.startDate} – {plan.expiryDate}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => togglePausePlan(plan.id)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                          isPaused
                            ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm'
                            : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {isPaused ? (
                          <>
                            <PlayCircle className="w-4 h-4" />
                            <span>Resume Plan</span>
                          </>
                        ) : (
                          <>
                            <PauseCircle className="w-4 h-4" />
                            <span>Pause Subscription</span>
                          </>
                        )}
                      </button>

                      <Link
                        href={`/provider/${plan.providerId}`}
                        className="px-4 py-2 rounded-2xl bg-cream-100 hover:bg-cream-200 text-stone-700 text-xs sm:text-sm font-bold border border-[#E3D7C1] transition-colors"
                      >
                        View Weekly Menu
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-[#EFE8DA] space-y-4">
          <div className="w-16 h-16 rounded-full bg-cream-200 text-stone-400 flex items-center justify-center mx-auto">
            <CalendarHeart className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-stone-800">No active meal subscriptions</h3>
          <p className="text-sm text-stone-500 max-w-md mx-auto">
            Subscribe to fresh home-style meals with split PG & Office delivery starting at ₹72/meal.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-700 text-white font-bold text-sm shadow-md hover:bg-brand-800"
          >
            <span>Browse Kitchens & Plans</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Skip Meal Modal */}
      {skipModalPlanId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FCFAF6] rounded-3xl max-w-md w-full border border-[#E3D7C1] shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE8DA]">
              <div className="flex items-center gap-2">
                <FastForward className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-black text-stone-900">Skip Eligible Meal</h3>
              </div>
              <button
                onClick={() => setSkipModalPlanId(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Eating out or traveling? Skip today&apos;s meal before the cutoff. No meal credit will be deducted and your subscription expiry will be extended by 1 day.
            </p>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1.5">
                Select Meal to Skip:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSkipSlotChoice('Lunch')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    skipSlotChoice === 'Lunch'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                      : 'bg-white text-stone-700 border-[#E3D7C1]'
                  }`}
                >
                  ☀️ Lunch (Cutoff 10:30 AM)
                </button>
                <button
                  type="button"
                  onClick={() => setSkipSlotChoice('Dinner')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    skipSlotChoice === 'Dinner'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white text-stone-700 border-[#E3D7C1]'
                  }`}
                >
                  🌙 Dinner (Cutoff 05:30 PM)
                </button>
              </div>
            </div>

            <div className="pt-2 flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setSkipModalPlanId(null)}
                className="px-4 py-2 rounded-xl bg-cream-200 text-stone-700 text-xs font-bold hover:bg-cream-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSkip}
                className="px-4 py-2 rounded-xl bg-brand-700 text-white text-xs font-bold hover:bg-brand-800"
              >
                Confirm Skip ({skipSlotChoice})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Helpful Tips Section */}
      <div className="bg-cream-100/70 rounded-3xl border border-[#E3D7C1] p-5 sm:p-6 space-y-3">
        <h4 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-700" />
          <span>Subscriber Perks & Quick Tips</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-600">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>PG & Office Split:</strong> Have Lunch delivered to your work reception and Dinner sent to your PG hostel room seamlessly.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Cutoff Validation:</strong> Address changes and meal skips are accepted until 10:30 AM for Lunch and 5:30 PM for Dinner.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
