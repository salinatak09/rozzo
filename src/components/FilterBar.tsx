'use client';

import React from 'react';
import {
  Sun,
  Moon,
  Sparkles,
  Leaf,
  Dumbbell,
  IndianRupee,
  Search,
  MapPin,
  SlidersHorizontal,
  ArrowUpDown,
} from 'lucide-react';
import { useApp, SortOption } from '../context/AppContext';
import { LOCATIONS } from '../data/mockData';

export default function FilterBar() {
  const {
    mealTimeFilter,
    setMealTimeFilter,
    dietaryFilter,
    setDietaryFilter,
    maxPriceFilter,
    setMaxPriceFilter,
    locationFilter,
    setLocationFilter,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
  } = useApp();

  return (
    <div className="space-y-3.5">
      {/* Top Search & Location Row */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
        {/* Search input */}
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search kitchen name, dish, Dal Tadka, Rajma, Sambar, Fish Curry..."
            className="w-full pl-10 pr-8 py-2.5 bg-white/95 rounded-2xl border border-[#E3D7C1] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 placeholder:text-stone-400 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Location Dropdown Filter */}
        <div className="sm:col-span-4 relative">
          <MapPin className="w-3.5 h-3.5 text-brand-700 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full pl-8 pr-7 py-2.5 bg-white/95 rounded-2xl border border-[#E3D7C1] text-xs sm:text-sm font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 shadow-sm cursor-pointer appearance-none truncate"
          >
            <option value="all">📍 All Bengaluru Areas</option>
            {LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.name}>
                📍 {loc.name}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 text-xs">
            ▼
          </div>
        </div>
      </div>

      {/* Middle Row: Meal Window & Price Filter */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Lunch / Dinner Meal Toggle */}
        <div className="flex items-center p-1 bg-cream-200/70 rounded-2xl border border-[#E3D7C1] flex-shrink-0">
          <button
            onClick={() => setMealTimeFilter('all')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              mealTimeFilter === 'all'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-curry-500" />
            <span>All Day</span>
          </button>

          <button
            onClick={() => setMealTimeFilter('lunch')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              mealTimeFilter === 'lunch'
                ? 'bg-white text-brand-800 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>Lunch</span>
            <span className="text-[10px] hidden md:inline text-stone-400 font-normal">12:30 PM</span>
          </button>

          <button
            onClick={() => setMealTimeFilter('dinner')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              mealTimeFilter === 'dinner'
                ? 'bg-white text-indigo-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-indigo-500" />
            <span>Dinner</span>
            <span className="text-[10px] hidden md:inline text-stone-400 font-normal">7:30 PM</span>
          </button>
        </div>

        {/* Price Filter Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <IndianRupee className="w-3 h-3 text-stone-500" /> Max:
          </span>

          {[
            { label: 'All', value: 150 },
            { label: '≤ ₹80', value: 80 },
            { label: '≤ ₹95', value: 95 },
            { label: '≤ ₹110', value: 110 },
          ].map((pill) => (
            <button
              key={pill.value}
              onClick={() => setMaxPriceFilter(pill.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                maxPriceFilter === pill.value
                  ? 'bg-brand-700 text-white border-brand-700 shadow-sm'
                  : 'bg-white/80 text-stone-700 border-[#E3D7C1] hover:bg-cream-100'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-1.5 ml-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="py-1.5 pl-2 pr-6 rounded-xl border border-[#E3D7C1] bg-white text-xs font-semibold text-stone-800 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer shadow-sm"
          >
            <option value="featured">✨ Featured</option>
            <option value="price-asc">₹ Price: Low to High</option>
            <option value="price-desc">₹ Price: High to Low</option>
            <option value="rating">⭐ Top Rated</option>
          </select>
        </div>
      </div>

      {/* Bottom Row: Dietary Badges */}
      <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 scrollbar-none border-t border-[#EFE8DA]">
        <button
          onClick={() => setDietaryFilter('all')}
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
            dietaryFilter === 'all'
              ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
              : 'bg-white/70 text-stone-600 border-[#E3D7C1] hover:bg-cream-100'
          }`}
        >
          All Cuisines
        </button>

        <button
          onClick={() => setDietaryFilter(dietaryFilter === 'pure-veg' ? 'all' : 'pure-veg')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
            dietaryFilter === 'pure-veg'
              ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
              : 'bg-white/70 text-stone-700 border-[#E3D7C1] hover:bg-cream-100'
          }`}
        >
          <div className="w-2.5 h-2.5 rounded-full border border-green-600 flex items-center justify-center p-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
          </div>
          <span>Pure Veg</span>
        </button>

        <button
          onClick={() => setDietaryFilter(dietaryFilter === 'jain' ? 'all' : 'jain')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
            dietaryFilter === 'jain'
              ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
              : 'bg-white/70 text-stone-700 border-[#E3D7C1] hover:bg-cream-100'
          }`}
        >
          <Leaf className="w-3.5 h-3.5 text-amber-500" />
          <span>Jain Friendly</span>
        </button>

        <button
          onClick={() => setDietaryFilter(dietaryFilter === 'high-protein' ? 'all' : 'high-protein')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
            dietaryFilter === 'high-protein'
              ? 'bg-stone-800 text-white border-stone-800 shadow-sm'
              : 'bg-white/70 text-stone-700 border-[#E3D7C1] hover:bg-cream-100'
          }`}
        >
          <Dumbbell className="w-3.5 h-3.5 text-rose-500" />
          <span>High Protein</span>
        </button>

        {maxPriceFilter < 150 && (
          <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200 ml-auto whitespace-nowrap">
            Showing meals ≤ ₹{maxPriceFilter}
          </span>
        )}
      </div>
    </div>
  );
}
