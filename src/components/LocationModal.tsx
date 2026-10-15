'use client';

import React from 'react';
import { X, MapPin, CheckCircle2, Navigation } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LOCATIONS } from '../data/mockData';

export default function LocationModal() {
  const { selectedLocation, setSelectedLocation, isLocationModalOpen, setIsLocationModalOpen, showToast } = useApp();

  if (!isLocationModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FCFAF6] rounded-3xl max-w-md w-full border border-[#E3D7C1] shadow-2xl overflow-hidden p-6 relative">
        <div className="flex items-center justify-between pb-4 border-b border-[#EFE8DA]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-stone-900">Choose Your Locality</h3>
              <p className="text-xs text-stone-500">Find home kitchens delivering to your doorstep</p>
            </div>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="w-8 h-8 rounded-full bg-cream-200 hover:bg-cream-300 flex items-center justify-center text-stone-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick GPS simulation notice */}
        <div className="mt-4 p-3 bg-brand-50/80 rounded-2xl border border-brand-100 flex items-center gap-2.5 text-xs text-brand-800">
          <Navigation className="w-4 h-4 text-brand-600 flex-shrink-0 animate-pulse" />
          <span>Showing available kitchens delivering fresh within 30-45 mins</span>
        </div>

        {/* Locations List */}
        <div className="mt-4 space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {LOCATIONS.map((loc) => {
            const isSelected = selectedLocation.id === loc.id;
            return (
              <button
                key={loc.id}
                onClick={() => {
                  setSelectedLocation(loc);
                  setIsLocationModalOpen(false);
                  showToast(`📍 Location updated to ${loc.name}`);
                }}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between group ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/70 shadow-sm'
                    : 'border-[#EFE8DA] hover:border-brand-300 hover:bg-cream-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-brand-600 text-white' : 'bg-cream-200 text-stone-600 group-hover:bg-cream-300'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-semibold ${isSelected ? 'text-brand-900' : 'text-stone-900'}`}>
                      {loc.name}
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">{loc.landmark} • {loc.city}</p>
                  </div>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-brand-600 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
