'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Clock, ArrowRight, Sparkles, CheckCircle2, CalendarPlus } from 'lucide-react';
import { TiffinProvider } from '../types';
import { useApp } from '../context/AppContext';

interface ProviderCardProps {
  provider: TiffinProvider;
}

export default function ProviderCard({ provider }: ProviderCardProps) {
  const { openBookingModal } = useApp();

  return (
    <div className="bg-white rounded-3xl border border-[#EFE8DA] overflow-hidden shadow-soft hover:shadow-warm transition-all duration-300 flex flex-col group">
      {/* Image Banner Container */}
      <Link href={`/provider/${provider.id}`} className="relative h-48 sm:h-52 w-full overflow-hidden bg-cream-200 block">
        <Image
          src={provider.imageUrl}
          alt={provider.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/85 via-stone-900/25 to-transparent" />

        {/* Rating & Distance Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-stone-900 font-bold text-xs shadow-md">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{provider.rating}</span>
            <span className="text-[10px] text-stone-500 font-medium">({provider.reviewCount})</span>
          </div>

          <div className="px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-cream-100 font-medium text-xs">
            {provider.distance}
          </div>
        </div>

        {/* Dietary / Pure Veg Badge */}
        <div className="absolute top-3 right-3">
          {provider.isPureVeg ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-800/90 text-white text-[11px] font-bold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-green-400" /> Pure Veg
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-900/80 text-white text-[11px] font-bold backdrop-blur-md">
              Veg & Non-Veg
            </span>
          )}
        </div>

        {/* Kitchen Name & Area inside the banner */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="text-[11px] font-semibold text-brand-200 uppercase tracking-wider mb-0.5">
            {provider.kitchenType}
          </p>
          <h3 className="font-extrabold text-lg sm:text-xl text-white tracking-tight leading-snug drop-shadow-sm">
            {provider.name}
          </h3>
          <p className="text-xs text-cream-200 line-clamp-1 mt-0.5">
            {provider.locationArea} • {provider.hygieneBadge}
          </p>
        </div>
      </Link>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Sample Daily Menus (Today's Highlights) */}
        <div className="space-y-2 bg-cream-50/80 p-3.5 rounded-2xl border border-[#EFE8DA]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Today’s Menu Sample
            </span>
            <span className="text-[10px] font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
              Freshly Cooked
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-stone-700">
            <div className="flex items-start gap-2">
              <span className="font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[10px] uppercase flex-shrink-0 mt-0.5">
                Lunch
              </span>
              <p className="line-clamp-1 text-stone-800">
                {provider.todayHighlight.lunchSpecial}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-[10px] uppercase flex-shrink-0 mt-0.5">
                Dinner
              </span>
              <p className="line-clamp-1 text-stone-800">
                {provider.todayHighlight.dinnerSpecial}
              </p>
            </div>
          </div>
        </div>

        {/* Subscription Plans: Trial, Weekly, Monthly */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
            Plans (Trial, Weekly, Monthly)
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {provider.plans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => openBookingModal(provider, plan)}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-cream-100 hover:bg-brand-50 text-stone-800 text-xs border border-[#E3D7C1] hover:border-brand-300 transition-colors text-center group/btn"
                title={`Subscribe to ${plan.title}`}
              >
                <span className="text-[10px] uppercase font-bold text-stone-500 group-hover/btn:text-brand-800">
                  {plan.type}
                </span>
                <span className="text-brand-800 font-extrabold text-xs">₹{plan.pricePerMeal}</span>
                <span className="text-[9px] text-stone-400">{plan.durationDays}d</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pricing & Dual CTA */}
        <div className="pt-3 border-t border-[#EFE8DA] flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block">
              Starting from
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-lg sm:text-xl font-extrabold text-stone-900">
                ₹{provider.sampleMealPrice}
              </span>
              <span className="text-[11px] text-stone-500 font-medium">/meal</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => openBookingModal(provider)}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-brand-100 hover:bg-brand-200 text-brand-900 text-xs font-bold transition-all"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>Subscribe</span>
            </button>

            <Link
              href={`/provider/${provider.id}`}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold shadow-sm transition-all transform active:scale-95"
            >
              <span>Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
