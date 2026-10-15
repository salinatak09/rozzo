'use client';

import React, { useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import NextLink from 'next/link';
import { useApp } from '@/context/AppContext';
import WeeklyMenuCalendar from '@/components/WeeklyMenuCalendar';
import BookingSummaryModal from '@/components/BookingSummaryModal';
import { SubscriptionPlan } from '@/types';
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Calendar,
  Utensils,
  Share2,
  Heart,
  ChevronRight,
  Info,
} from 'lucide-react';

export default function ProviderDetailPage() {
  const params = useParams();
  const providerId = params?.id as string;
  const { providers, showToast } = useApp();

  const provider = providers.find((p) => p.id === providerId);

  const [selectedPlanForModal, setSelectedPlanForModal] = useState<SubscriptionPlan | null>(null);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  if (!provider) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-800">Kitchen Not Found</h2>
        <p className="text-stone-500">The tiffin provider you are looking for does not exist or has closed.</p>
        <NextLink
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-700 text-white font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Explore
        </NextLink>
      </div>
    );
  }

  const handleOpenSubscribe = (plan: SubscriptionPlan) => {
    setSelectedPlanForModal(plan);
    setIsSubscribeModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 py-4">
      {/* Top Navigation breadcrumb */}
      <div className="flex items-center justify-between">
        <NextLink
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-600 hover:text-stone-900 bg-white px-3 py-1.5 rounded-full border border-[#E3D7C1] transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Kitchens</span>
        </NextLink>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsLiked(!isLiked);
              showToast(!isLiked ? '❤️ Added to favorite kitchens' : 'Removed from favorites');
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
              isLiked
                ? 'bg-rose-50 border-rose-300 text-rose-600'
                : 'bg-white border-[#E3D7C1] text-stone-600 hover:bg-cream-100'
            }`}
            title="Save Kitchen"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
          </button>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              showToast('🔗 Kitchen link copied to clipboard!');
            }}
            className="w-9 h-9 rounded-full bg-white border border-[#E3D7C1] text-stone-600 hover:bg-cream-100 flex items-center justify-center transition-all"
            title="Share Kitchen"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-3xl border border-[#EFE8DA] overflow-hidden shadow-soft">
        <div className="relative h-60 sm:h-72 w-full">
          <Image
            src={provider.coverUrl}
            alt={provider.name}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent" />

          {/* Badges on image */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-brand-700/90 backdrop-blur-md text-white text-xs font-bold shadow-md">
              {provider.hygieneBadge}
            </span>
            <span className="px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-cream-100 text-xs font-medium">
              {provider.kitchenType}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400 text-stone-950 font-black text-xs">
                <Star className="w-3.5 h-3.5 fill-stone-950 text-stone-950" />
                <span>{provider.rating}</span>
              </div>
              <span className="text-xs text-cream-200 font-medium">
                ({provider.reviewCount} happy subscriber reviews)
              </span>
              <span className="text-xs text-cream-300">•</span>
              <span className="text-xs text-cream-200 font-medium">{provider.distance} away</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {provider.name}
            </h1>
            <p className="text-xs sm:text-sm text-cream-100 mt-1 line-clamp-2 max-w-2xl">
              {provider.tagline}
            </p>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="p-4 sm:p-6 bg-cream-50/60 border-t border-[#EFE8DA] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-stone-400 font-semibold block text-[10px] uppercase">Service Area</span>
            <span className="font-bold text-stone-900 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
              <span className="truncate">{provider.locationArea}</span>
            </span>
          </div>
          <div>
            <span className="text-stone-400 font-semibold block text-[10px] uppercase">Lunch Slot</span>
            <span className="font-bold text-stone-900 flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span>{provider.deliverySlots.lunch}</span>
            </span>
          </div>
          <div>
            <span className="text-stone-400 font-semibold block text-[10px] uppercase">Dinner Slot</span>
            <span className="font-bold text-stone-900 flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
              <span>{provider.deliverySlots.dinner}</span>
            </span>
          </div>
          <div>
            <span className="text-stone-400 font-semibold block text-[10px] uppercase">Dietary Standard</span>
            <span className="font-bold text-stone-900 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
              <span>{provider.isPureVeg ? '100% Pure Veg' : 'Veg & Non-Veg'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* About The Kitchen Story */}
      <div className="bg-white rounded-3xl border border-[#EFE8DA] p-5 sm:p-7 shadow-soft space-y-3">
        <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
          <Utensils className="w-4 h-4 text-brand-600" />
          <span>About This Home Kitchen</span>
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          {provider.description}
        </p>
        <div className="p-3 bg-brand-50/70 rounded-2xl border border-brand-100 flex items-center gap-2 text-xs text-brand-900">
          <span className="font-bold">Eco Packaging:</span>
          <span>{provider.packagingNote}</span>
        </div>
      </div>

      {/* Today's Menu Highlight Card */}
      <div className="bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-cream-100 rounded-3xl border border-amber-200/80 p-5 sm:p-7 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-amber-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Today’s Menu
            </span>
            <span className="text-xs font-medium text-stone-600 hidden sm:inline">
              Cooked fresh this morning
            </span>
          </div>
          <span className="text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Dispatched hot
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/90 p-4 rounded-2xl border border-amber-200 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-amber-800 tracking-wider">
                ☀️ Afternoon Lunch Special
              </span>
              <span className="text-[11px] text-stone-500">{provider.deliverySlots.lunch}</span>
            </div>
            <p className="text-sm font-bold text-stone-900">
              {provider.todayHighlight.lunchSpecial}
            </p>
          </div>

          <div className="bg-white/90 p-4 rounded-2xl border border-indigo-200 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-indigo-800 tracking-wider">
                🌙 Night Dinner Special
              </span>
              <span className="text-[11px] text-stone-500">{provider.deliverySlots.dinner}</span>
            </div>
            <p className="text-sm font-bold text-stone-900">
              {provider.todayHighlight.dinnerSpecial}
            </p>
          </div>
        </div>
      </div>

      {/* 7-Day Weekly Menu Calendar */}
      <WeeklyMenuCalendar
        schedule={provider.weeklySchedule}
        deliverySlots={provider.deliverySlots}
        onSelectSubscribe={() => handleOpenSubscribe(provider.plans[0])}
      />

      {/* Available Subscription Plans Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-700" />
              <span>Available Subscription Plans</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Choose the package that suits your schedule. Cancel or pause anytime.
            </p>
          </div>
          <span className="text-xs font-semibold text-brand-800 bg-brand-50 px-3 py-1 rounded-full self-start sm:self-auto border border-brand-200">
            🚚 Free doorstep delivery included
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {provider.plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-3xl border p-5 sm:p-6 shadow-soft flex flex-col justify-between transition-all hover:shadow-warm relative ${
                plan.badge?.includes('Best') || plan.badge?.includes('Popular')
                  ? 'border-brand-500 ring-2 ring-brand-500/20'
                  : 'border-[#EFE8DA]'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-6">
                  <span className="px-3 py-0.5 rounded-full bg-brand-700 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="space-y-4 pt-1">
                <div>
                  <h4 className="text-lg font-black text-stone-900 tracking-tight">{plan.title}</h4>
                  <p className="text-xs text-stone-500 mt-0.5">{plan.idealFor}</p>
                </div>

                {/* Price block */}
                <div className="p-3.5 bg-cream-50 rounded-2xl border border-[#EFE8DA]">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-stone-900">
                      ₹{plan.pricePerMeal}
                    </span>
                    <span className="text-xs text-stone-400 line-through">
                      ₹{plan.originalPricePerMeal}
                    </span>
                    <span className="text-xs text-stone-600 font-medium">/ meal</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-brand-700 font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Save {plan.savingsPercent}% compared to single orders</span>
                  </div>
                </div>

                {/* Features list */}
                <ul className="space-y-2 text-xs text-stone-600">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                    <span>Valid for {plan.durationDays} meal days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                    <span>Switch delivery address between PG & Office</span>
                  </li>
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-5 mt-5 border-t border-[#EFE8DA]">
                <button
                  onClick={() => handleOpenSubscribe(plan)}
                  className="w-full py-3 px-4 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <span>Select Plan</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Summary Modal */}
      <BookingSummaryModal
        provider={provider}
        initialPlan={selectedPlanForModal || undefined}
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
      />
    </div>
  );
}
