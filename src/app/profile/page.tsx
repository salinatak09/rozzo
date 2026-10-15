'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Address } from '@/types';
import {
  User,
  MapPin,
  Plus,
  Trash2,
  Edit2,
  Check,
  Building,
  Home as HomeIcon,
  Briefcase,
  Phone,
  Mail,
  ShieldCheck,
  Sparkles,
  Heart,
  X,
} from 'lucide-react';

export default function ProfilePage() {
  const { addresses, addAddress, updateAddress, deleteAddress, showToast } = useApp();

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Address form fields
  const [addrType, setAddrType] = useState<'PG / Hostel' | 'Office' | 'Home' | 'Other'>('PG / Hostel');
  const [addrTitle, setAddrTitle] = useState('');
  const [addrRoomFlat, setAddrRoomFlat] = useState('');
  const [addrBuilding, setAddrBuilding] = useState('');
  const [addrLandmark, setAddrLandmark] = useState('');
  const [addrArea, setAddrArea] = useState('');
  const [addrCity, setAddrCity] = useState('Bengaluru');
  const [addrInstructions, setAddrInstructions] = useState('');

  // Preference state
  const [spicePreference, setSpicePreference] = useState<'Mild' | 'Medium' | 'Spicy'>('Medium');
  const [rotisGhee, setRotisGhee] = useState(true);
  const [extraSalad, setExtraSalad] = useState(true);

  const openAddModal = () => {
    setEditingAddress(null);
    setAddrType('PG / Hostel');
    setAddrTitle('');
    setAddrRoomFlat('');
    setAddrBuilding('');
    setAddrLandmark('');
    setAddrArea('Koramangala, 5th Block');
    setAddrCity('Bengaluru');
    setAddrInstructions('Leave with warden or security guard if room is locked.');
    setIsAddressModalOpen(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingAddress(addr);
    setAddrType(addr.type);
    setAddrTitle(addr.title);
    setAddrRoomFlat(addr.roomFlat);
    setAddrBuilding(addr.buildingName);
    setAddrLandmark(addr.landmark);
    setAddrArea(addr.area);
    setAddrCity(addr.city);
    setAddrInstructions(addr.deliveryInstructions);
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrTitle.trim() || !addrRoomFlat.trim() || !addrBuilding.trim()) {
      showToast('⚠️ Please fill in all required address fields.');
      return;
    }

    if (editingAddress) {
      updateAddress({
        ...editingAddress,
        type: addrType,
        title: addrTitle,
        roomFlat: addrRoomFlat,
        buildingName: addrBuilding,
        landmark: addrLandmark,
        area: addrArea,
        city: addrCity,
        deliveryInstructions: addrInstructions,
      });
    } else {
      addAddress({
        type: addrType,
        title: addrTitle,
        roomFlat: addrRoomFlat,
        buildingName: addrBuilding,
        landmark: addrLandmark,
        area: addrArea,
        city: addrCity,
        deliveryInstructions: addrInstructions,
        isDefault: addresses.length === 0,
      });
    }

    setIsAddressModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-[#EFE8DA]">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-2xl bg-brand-100 text-brand-800">
            <User className="w-5 h-5" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Customer Profile
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Manage your saved PG and Office addresses for seamless daily tiffin deliveries.
        </p>
      </div>

      {/* Customer Info Card */}
      <div className="bg-white rounded-3xl border border-[#EFE8DA] p-5 sm:p-7 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-700 to-brand-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-stone-900 tracking-tight">
                Saurabh Sharma
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-800 uppercase tracking-wide">
                Daily Subscriber
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-1">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-stone-400" /> +91 98765 43210
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-stone-400" /> saurabh.dev@example.com
              </span>
            </div>
          </div>
        </div>

        <div className="bg-cream-50 p-3 rounded-2xl border border-[#EFE8DA] text-xs text-stone-600 flex items-center gap-2 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-brand-600 flex-shrink-0" />
          <span>Rozzo Verified Foodie • Active in Bengaluru</span>
        </div>
      </div>

      {/* Saved Addresses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-700" />
              <span>Saved Delivery Addresses</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Easily toggle between your PG hostel and Office tech park desk
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Address</span>
          </button>
        </div>

        {/* Addresses List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => {
            const isPG = addr.type === 'PG / Hostel';
            const isOffice = addr.type === 'Office';

            return (
              <div
                key={addr.id}
                className="bg-white rounded-3xl border border-[#EFE8DA] p-5 shadow-soft space-y-3 flex flex-col justify-between hover:shadow-warm transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-cream-100 text-stone-700 border border-[#E3D7C1]">
                        {isPG ? (
                          <Building className="w-4 h-4 text-terracotta-600" />
                        ) : isOffice ? (
                          <Briefcase className="w-4 h-4 text-brand-700" />
                        ) : (
                          <HomeIcon className="w-4 h-4 text-indigo-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-stone-900 text-sm">{addr.title}</h4>
                          {addr.isDefault && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-100 text-brand-800">
                              Default
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-semibold text-stone-500">
                          {addr.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(addr)}
                        className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-cream-100 rounded-lg transition-colors"
                        title="Edit address"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {addresses.length > 1 && (
                        <button
                          onClick={() => deleteAddress(addr.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete address"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 space-y-1 text-xs text-stone-600 leading-relaxed">
                    <p className="font-medium text-stone-800">
                      {addr.roomFlat}, {addr.buildingName}
                    </p>
                    <p>
                      {addr.area}, {addr.city}
                    </p>
                    {addr.landmark && (
                      <p className="text-stone-400 text-[11px]">Landmark: {addr.landmark}</p>
                    )}
                  </div>
                </div>

                {addr.deliveryInstructions && (
                  <div className="pt-2 border-t border-[#EFE8DA]">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block mb-0.5">
                      Delivery Note
                    </span>
                    <p className="text-[11px] text-stone-600 italic bg-cream-50 p-2 rounded-xl border border-[#EFE8DA]">
                      &quot;{addr.deliveryInstructions}&quot;
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Food & Cooking Preferences */}
      <div className="bg-white rounded-3xl border border-[#EFE8DA] p-5 sm:p-7 shadow-soft space-y-5">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Tiffin Taste & Cooking Preferences</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            These notes are automatically passed to home kitchens when preparing your food
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-cream-50 rounded-2xl border border-[#EFE8DA] space-y-2">
            <span className="text-xs font-bold text-stone-800 block">Spice Level</span>
            <div className="grid grid-cols-3 gap-1">
              {(['Mild', 'Medium', 'Spicy'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    setSpicePreference(lvl);
                    showToast(`🌶️ Spice preference updated to ${lvl}`);
                  }}
                  className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                    spicePreference === lvl
                      ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                      : 'bg-white text-stone-700 border-[#E3D7C1] hover:bg-cream-100'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-cream-50 rounded-2xl border border-[#EFE8DA] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-stone-800 block">A2 Desi Ghee on Phulkas</span>
              <span className="text-[11px] text-stone-500">Lightly brushed</span>
            </div>
            <button
              onClick={() => {
                setRotisGhee(!rotisGhee);
                showToast(rotisGhee ? 'Plain dry phulkas selected' : 'Desi ghee phulkas selected');
              }}
              className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                rotisGhee ? 'bg-brand-600 justify-end' : 'bg-stone-300 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          <div className="p-4 bg-cream-50 rounded-2xl border border-[#EFE8DA] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-stone-800 block">Fresh Cucumber/Kachumber</span>
              <span className="text-[11px] text-stone-500">With daily meal</span>
            </div>
            <button
              onClick={() => {
                setExtraSalad(!extraSalad);
                showToast(extraSalad ? 'Salad removed' : 'Salad included');
              }}
              className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                extraSalad ? 'bg-brand-600 justify-end' : 'bg-stone-300 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Address Edit/Add Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FCFAF6] rounded-3xl max-w-lg w-full border border-[#E3D7C1] shadow-2xl p-5 sm:p-7 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE8DA]">
              <h3 className="text-lg font-black text-stone-900">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="w-8 h-8 rounded-full bg-cream-200 hover:bg-cream-300 flex items-center justify-center text-stone-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4 pt-4">
              {/* Type selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1.5">
                  Address Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['PG / Hostel', 'Office', 'Home'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setAddrType(t);
                        if (!addrTitle || addrTitle.includes('PG') || addrTitle.includes('Desk') || addrTitle.includes('Apartment')) {
                          if (t === 'PG / Hostel') setAddrTitle('Stanza PG Orchid');
                          if (t === 'Office') setAddrTitle('EcoSpace Desk 42');
                          if (t === 'Home') setAddrTitle('Green Glen Flat');
                        }
                      }}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        addrType === t
                          ? 'bg-brand-700 text-white border-brand-700 shadow-sm'
                          : 'bg-white text-stone-700 border-[#E3D7C1] hover:bg-cream-100'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title / Nickname */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1">
                  Address Label / Nickname *
                </label>
                <input
                  type="text"
                  required
                  value={addrTitle}
                  onChange={(e) => setAddrTitle(e.target.value)}
                  placeholder="e.g. Stanza Living PG or Prestige Tech Park Desk"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3D7C1] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
                />
              </div>

              {/* Room / Flat & Floor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    Room / Flat / Desk No. *
                  </label>
                  <input
                    type="text"
                    required
                    value={addrRoomFlat}
                    onChange={(e) => setAddrRoomFlat(e.target.value)}
                    placeholder="e.g. Room 304, 3rd Floor"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3D7C1] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    Building / PG Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={addrBuilding}
                    onChange={(e) => setAddrBuilding(e.target.value)}
                    placeholder="e.g. Orchid House / Tower B"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3D7C1] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
                  />
                </div>
              </div>

              {/* Area & Landmark */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    Area / Locality *
                  </label>
                  <input
                    type="text"
                    required
                    value={addrArea}
                    onChange={(e) => setAddrArea(e.target.value)}
                    placeholder="e.g. Koramangala 5th Block"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3D7C1] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    Landmark
                  </label>
                  <input
                    type="text"
                    value={addrLandmark}
                    onChange={(e) => setAddrLandmark(e.target.value)}
                    placeholder="e.g. Near Sony Signal / JNC"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3D7C1] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
                  />
                </div>
              </div>

              {/* Delivery Instructions */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1">
                  Delivery Partner Instructions
                </label>
                <textarea
                  rows={2}
                  value={addrInstructions}
                  onChange={(e) => setAddrInstructions(e.target.value)}
                  placeholder="e.g. Hand over to PG security guard / leave on delivery shelf at reception"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E3D7C1] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-md transition-all"
                >
                  {editingAddress ? 'Update Saved Address' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
