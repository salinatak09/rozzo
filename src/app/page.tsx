'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '../context/AppContext';
import FilterBar from '../components/FilterBar';
import ProviderCard from '../components/ProviderCard';
import BookingSummaryModal from '../components/BookingSummaryModal';
import { Sparkles, ShieldCheck, HeartHandshake, Utensils, RotateCcw, ArrowRight, MapPin, IndianRupee } from 'lucide-react';

export default function HomePage() {
  const {
    providers,
    selectedLocation,
    setIsLocationModalOpen,
    mealTimeFilter,
    dietaryFilter,
    maxPriceFilter,
    locationFilter,
    sortBy,
    searchQuery,
    setSearchQuery,
    setMealTimeFilter,
    setDietaryFilter,
    setMaxPriceFilter,
    setLocationFilter,
    setSortBy,
    bookingModalData,
    closeBookingModal,
  } = useApp();

  // Filter & sort providers based on search, location, meal window, price, dietary options and sorting
  const filteredProviders = useMemo(() => {
    let result = providers.filter((provider) => {
      // 1. Search query matching
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = provider.name.toLowerCase().includes(query);
        const matchesTagline = provider.tagline.toLowerCase().includes(query);
        const matchesCuisine = provider.dietaryTags.some((tag) => tag.toLowerCase().includes(query));
        const matchesArea = provider.locationArea.toLowerCase().includes(query);
        const matchesMenu =
          provider.todayHighlight.lunchSpecial.toLowerCase().includes(query) ||
          provider.todayHighlight.dinnerSpecial.toLowerCase().includes(query);

        if (!matchesName && !matchesTagline && !matchesCuisine && !matchesArea && !matchesMenu) {
          return false;
        }
      }

      // 2. Location filter
      if (locationFilter !== 'all') {
        const targetArea = locationFilter.toLowerCase().split(',')[0].trim();
        const matchesLocation = provider.locationArea.toLowerCase().includes(targetArea);
        if (!matchesLocation) {
          return false;
        }
      }

      // 3. Price filter
      if (maxPriceFilter < 150) {
        if (provider.sampleMealPrice > maxPriceFilter) {
          return false;
        }
      }

      // 4. Dietary filter
      if (dietaryFilter === 'pure-veg' && !provider.isPureVeg) {
        return false;
      }
      if (dietaryFilter === 'jain' && !provider.hasJainOption) {
        return false;
      }
      if (dietaryFilter === 'high-protein' && !provider.dietaryTags.includes('High Protein')) {
        return false;
      }
      if (dietaryFilter === 'budget' && provider.sampleMealPrice > 89) {
        return false;
      }

      return true;
    });

    // 5. Sorting
    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.sampleMealPrice - b.sampleMealPrice);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.sampleMealPrice - a.sampleMealPrice);
    } else if (sortBy === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [providers, searchQuery, locationFilter, maxPriceFilter, dietaryFilter, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    locationFilter !== 'all' ||
    mealTimeFilter !== 'all' ||
    dietaryFilter !== 'all' ||
    maxPriceFilter < 150 ||
    sortBy !== 'featured';

  const resetAllFilters = () => {
    setSearchQuery('');
    setLocationFilter('all');
    setMealTimeFilter('all');
    setDietaryFilter('all');
    setMaxPriceFilter(150);
    setSortBy('featured');
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Banner Section */}
      <section className="bg-gradient-to-b from-[#FAF4E8] to-[#FCFAF6] border-b border-[#EFE8DA] pt-4 pb-6 sm:pb-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100/80 border border-brand-200 text-brand-900 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Zero Soda • Pure Desi Ghee Phulkas • Zero Refined Oil</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight leading-[1.15]">
                Missing mom’s food? <br />
                <span className="text-brand-700">Healthy daily dabbas</span> delivered to your doorstep.
              </h1>

              <p className="text-stone-600 text-sm sm:text-base max-w-xl leading-relaxed">
                Affordable home-style lunch and dinner subscriptions designed for PG residents, students, and busy professionals in{' '}
                <button
                  onClick={() => setIsLocationModalOpen(true)}
                  className="font-bold text-stone-900 underline underline-offset-4 hover:text-brand-700"
                >
                  {selectedLocation.name}
                </button>
                . Pause meals anytime or switch delivery between PG and office!
              </p>

              {/* Value props */}
              <div className="grid grid-cols-3 gap-2 pt-2 max-w-md">
                <div className="bg-white/80 border border-[#E3D7C1] p-2.5 rounded-2xl text-center">
                  <span className="block text-base sm:text-lg font-black text-brand-700">₹72 - ₹99</span>
                  <span className="text-[11px] text-stone-500 font-medium">Per full meal</span>
                </div>
                <div className="bg-white/80 border border-[#E3D7C1] p-2.5 rounded-2xl text-center">
                  <span className="block text-base sm:text-lg font-black text-stone-900">PG / Office</span>
                  <span className="text-[11px] text-stone-500 font-medium">Split delivery</span>
                </div>
                <div className="bg-white/80 border border-[#E3D7C1] p-2.5 rounded-2xl text-center">
                  <span className="block text-base sm:text-lg font-black text-terracotta-500">Free</span>
                  <span className="text-[11px] text-stone-500 font-medium">Doorstep drop</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-[#E3D7C1] shadow-warm bg-white p-3">
                <div className="relative h-56 sm:h-64 w-full rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80"
                    alt="Authentic Indian Homestyle Tiffin Thali"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="px-2 py-0.5 rounded-md bg-brand-600 text-white text-[10px] font-bold uppercase">
                      Today&apos;s Lunch Special
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">
                      Maa Ki Rasoi Amritsari Thali
                    </h4>
                    <p className="text-xs text-cream-200">
                      Slow-cooked Dal Tadka, 4 Ghee Phulkas, Bhindi & Jeera Rice
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-cream-50 rounded-xl mt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-stone-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-semibold">Next dispatch: 12:30 PM Lunch</span>
                  </div>
                  <Link
                    href="/provider/maa-ki-rasoi"
                    className="text-brand-700 font-bold hover:underline inline-flex items-center gap-0.5"
                  >
                    View menu <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Working Search & Filters Bar */}
        <div className="bg-[#FAF6ED] p-4 rounded-3xl border border-[#E3D7C1] shadow-soft">
          <FilterBar />
        </div>

        {/* Results Header with Live Criteria */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                Nearby Home Kitchens
              </h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cream-200 text-stone-800">
                {filteredProviders.length} kitchens found
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5 flex items-center gap-1.5">
              <span>
                {locationFilter === 'all'
                  ? `Showing all verified kitchens delivering across Bengaluru`
                  : `Filtering kitchens in ${locationFilter}`}
              </span>
              {maxPriceFilter < 150 && (
                <span className="font-bold text-brand-700">• Max ₹{maxPriceFilter}/meal</span>
              )}
            </p>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-bold text-terracotta-600 hover:text-terracotta-700 bg-terracotta-50 px-3.5 py-1.5 rounded-full border border-terracotta-200 transition-colors shadow-sm"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset all filters</span>
            </button>
          )}
        </div>

        {/* Providers Grid */}
        {filteredProviders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-[#EFE8DA] space-y-3">
            <div className="w-16 h-16 rounded-full bg-cream-200 text-stone-500 flex items-center justify-center mx-auto">
              <Utensils className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-stone-800">No tiffin providers matched your search</h3>
            <p className="text-sm text-stone-500 max-w-sm mx-auto">
              No kitchens found matching your price or location criteria. Try expanding the price limit or switching area.
            </p>
            <button
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-brand-700 text-white text-xs font-bold hover:bg-brand-800 shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Show All 6 Kitchens</span>
            </button>
          </div>
        )}

        {/* Rozzo Assurance Section */}
        <div className="mt-12 bg-gradient-to-r from-cream-100 via-white to-cream-100 rounded-3xl border border-[#E3D7C1] p-6 sm:p-8">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
            <span className="text-xs uppercase font-extrabold text-brand-700 tracking-wider">
              The Rozzo Promise
            </span>
            <h3 className="text-2xl font-extrabold text-stone-900 tracking-tight">
              Why 2,400+ PG Residents & Engineers Trust Rozzo
            </h3>
            <p className="text-xs sm:text-sm text-stone-600">
              Not commercial restaurant food loaded with butter & colors. Genuine homestyle cooking prepared with care.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-[#EFE8DA] shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-stone-900 text-sm">FSSAI Certified Home Kitchens</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Every mom-led kitchen undergoes 24-point hygienic checks, clean water audits and temperature tests before onboarding.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EFE8DA] shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-stone-900 text-sm">Flexible PG & Office Switch</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Work from office 3 days a week? Switch between your PG address and tech park reception with a simple toggle before 10 AM.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EFE8DA] shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-stone-900 text-sm">Pause & Unused Days Rollover</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Heading home for a long weekend? Pause your subscription anytime without losing money. Your meals rollover automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Booking Summary Modal */}
      {bookingModalData && (
        <BookingSummaryModal
          provider={bookingModalData.provider}
          initialPlan={bookingModalData.initialPlan}
          isOpen={true}
          onClose={closeBookingModal}
        />
      )}
    </div>
  );
}
