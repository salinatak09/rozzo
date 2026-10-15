'use client';

import React, { useState } from 'react';
import { DayMenuSchedule } from '../types';
import { Sun, Moon, Sparkles, Flame, Check, Info, Calendar, ArrowRight } from 'lucide-react';

interface WeeklyMenuCalendarProps {
  schedule: DayMenuSchedule[];
  deliverySlots: {
    lunch: string;
    dinner: string;
  };
  onSelectSubscribe?: () => void;
}

export default function WeeklyMenuCalendar({
  schedule,
  deliverySlots,
  onSelectSubscribe,
}: WeeklyMenuCalendarProps) {
  // Default to today or Monday
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const activeDay = schedule[selectedDayIndex] || schedule[0];

  return (
    <div className="bg-white rounded-3xl border border-[#EFE8DA] p-5 sm:p-7 shadow-soft space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EFE8DA]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-brand-100 text-brand-800">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 tracking-tight">
              7-Day Rotating Menu Calendar
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Carefully curated so you never get bored of repeating dishes. Rotis baked fresh 30 mins before dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-[11px] font-semibold text-brand-800 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            🌱 100% Whole Wheat Phulkas
          </span>
        </div>
      </div>

      {/* Day Selector Pills */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 bg-cream-100 p-1.5 rounded-2xl border border-[#E3D7C1]">
        {schedule.map((dayItem, idx) => {
          const isSelected = idx === selectedDayIndex;
          const shortName = dayItem.day.slice(0, 3);

          return (
            <button
              key={dayItem.day}
              onClick={() => setSelectedDayIndex(idx)}
              className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center transition-all ${
                isSelected
                  ? 'bg-brand-700 text-white shadow-md font-bold scale-[1.02]'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-cream-200/80 font-medium'
              }`}
            >
              <span className="text-[11px] sm:text-xs uppercase">{shortName}</span>
              <span className={`text-[10px] hidden sm:block ${isSelected ? 'text-brand-100' : 'text-stone-400'}`}>
                {idx === 0 ? 'Today' : `Day ${idx + 1}`}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Day Name Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
          <span>{activeDay.day}’s Menu</span>
          {selectedDayIndex === 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
              Cooking Today
            </span>
          )}
        </h4>
        <span className="text-xs text-stone-500">
          Pause or skip any day via app
        </span>
      </div>

      {/* Lunch & Dinner Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lunch Card */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 space-y-4 hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-bold text-stone-900 text-sm">Afternoon Lunch</h5>
                <span className="text-[11px] text-stone-500">{deliverySlots.lunch}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-lg">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>~{activeDay.lunch.calories} kcal</span>
            </div>
          </div>

          {activeDay.lunch.specialHighlight && (
            <div className="p-2.5 rounded-xl bg-amber-100/70 border border-amber-200 text-xs text-amber-900 font-medium flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span>{activeDay.lunch.specialHighlight}</span>
            </div>
          )}

          <div className="space-y-2.5 text-xs sm:text-sm">
            <div className="flex items-start gap-2">
              <span className="w-16 text-stone-500 text-[11px] font-medium flex-shrink-0 pt-0.5">Dal / Curry</span>
              <span className="font-semibold text-stone-900">{activeDay.lunch.mainCurry}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-16 text-stone-500 text-[11px] font-medium flex-shrink-0 pt-0.5">Dry Sabzi</span>
              <span className="font-medium text-stone-800">{activeDay.lunch.drySabzi}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-16 text-stone-500 text-[11px] font-medium flex-shrink-0 pt-0.5">Breads</span>
              <span className="font-medium text-stone-800">{activeDay.lunch.breads}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-16 text-stone-500 text-[11px] font-medium flex-shrink-0 pt-0.5">Rice</span>
              <span className="font-medium text-stone-800">{activeDay.lunch.rice}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-16 text-stone-500 text-[11px] font-medium flex-shrink-0 pt-0.5">Sides</span>
              <span className="text-stone-600">{activeDay.lunch.accompaniments}</span>
            </div>
          </div>
        </div>

        {/* Dinner Card */}
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5 space-y-4 hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-bold text-stone-900 text-sm">Night Dinner</h5>
                <span className="text-[11px] text-stone-500">{deliverySlots.dinner}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-semibold text-indigo-900 bg-indigo-100/80 px-2 py-0.5 rounded-lg">
              <Flame className="w-3.5 h-3.5 text-indigo-600" />
              <span>~{activeDay.dinner.calories} kcal</span>
            </div>
          </div>

          {activeDay.dinner.specialHighlight && (
            <div className="p-2.5 rounded-xl bg-indigo-100/70 border border-indigo-200 text-xs text-indigo-900 font-medium flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
              <span>{activeDay.dinner.specialHighlight}</span>
            </div>
          )}

          <div className="space-y-2.5 text-xs sm:text-sm">
            <div className="flex items-start gap-2">
              <span className="w-16 text-stone-500 text-[11px] font-medium flex-shrink-0 pt-0.5">Main Curry</span>
              <span className="font-semibold text-stone-900">{activeDay.dinner.mainCurry}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-16 text-stone-500 text-[11px] font-medium flex-shrink-0 pt-0.5">Dry Sabzi</span>
              <span className="font-medium text-stone-800">{activeDay.dinner.drySabzi}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-16 text-stone-500 text-[11px] font-medium flex-shrink-0 pt-0.5">Breads</span>
              <span className="font-medium text-stone-800">{activeDay.dinner.breads}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-16 text-stone-500 text-[11px] font-medium flex-shrink-0 pt-0.5">Rice</span>
              <span className="font-medium text-stone-800">{activeDay.dinner.rice}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-16 text-stone-500 text-[11px] font-medium flex-shrink-0 pt-0.5">Sides</span>
              <span className="text-stone-600">{activeDay.dinner.accompaniments}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Homestyle pledge & Action Bar */}
      <div className="p-4 bg-cream-50 rounded-2xl border border-[#EFE8DA] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-stone-600">
          <Info className="w-4 h-4 text-brand-600 flex-shrink-0" />
          <span>
            Seasonal rotating menu. Choose between Trial, Weekly, or Monthly plans with flexible delivery days.
          </span>
        </div>

        {onSelectSubscribe && (
          <button
            type="button"
            onClick={onSelectSubscribe}
            className="self-stretch sm:self-auto px-4 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all flex-shrink-0"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Subscribe to this Schedule</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
