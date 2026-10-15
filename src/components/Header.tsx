'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MapPin,
  Search,
  Calendar,
  PackageCheck,
  User,
  ChevronDown,
  Utensils,
  Bell,
  ChefHat,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const pathname = usePathname();
  const {
    selectedLocation,
    setIsLocationModalOpen,
    searchQuery,
    setSearchQuery,
    userPlans,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const activePlansCount = userPlans.filter((p) => p.status === 'Active').length;

  return (
    <header className="sticky top-0 z-40 bg-[#FCFAF6]/95 backdrop-blur-md border-b border-[#EFE8DA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo & Location */}
          <div className="flex items-center gap-3 md:gap-5 min-w-0">
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Utensils className="w-5 h-5 text-cream-100" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-stone-900 leading-tight">
                  Rozzo<span className="text-brand-600">.</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-terracotta-500 hidden sm:block">
                  Everyday Tiffin
                </span>
              </div>
            </Link>

            {/* Location Pill */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cream-100 hover:bg-cream-200 border border-[#E3D7C1] transition-colors text-left max-w-[170px] sm:max-w-[260px]"
              title="Change Delivery Location"
            >
              <MapPin className="w-4 h-4 text-brand-600 flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-stone-500 font-medium leading-none">Deliver to</span>
                <span className="text-xs font-semibold text-stone-800 truncate">
                  {selectedLocation.name}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 flex-shrink-0 ml-1" />
            </button>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-xs mx-2">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search kitchens, dals, thalis..."
                className="w-full pl-9 pr-4 py-2 bg-white/80 rounded-full border border-[#E3D7C1] text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 placeholder:text-stone-400 shadow-inner"
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
          </div>

          {/* Right Section: Notification Bell + Navigation + Partner Portal CTA */}
          <div className="flex items-center gap-2">
            {/* Customer Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 rounded-2xl bg-cream-100 hover:bg-cream-200 text-stone-700 transition-colors border border-[#E3D7C1]"
                title="Customer Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#FCFAF6] rounded-3xl border border-[#E3D7C1] shadow-2xl z-50 p-4 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-[#EFE8DA]">
                    <div className="flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-brand-700" />
                      <span className="font-extrabold text-sm text-stone-900">Notifications</span>
                      {unreadNotificationsCount > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-brand-100 text-brand-800">
                          {unreadNotificationsCount} new
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {unreadNotificationsCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-[11px] font-bold text-brand-700 hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                      <button
                        onClick={() => setIsNotifOpen(false)}
                        className="p-1 rounded-full text-stone-400 hover:text-stone-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                            !n.read
                              ? 'bg-brand-50/70 border-brand-200'
                              : 'bg-white border-[#EFE8DA] opacity-80'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-stone-900 flex items-center gap-1">
                              {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />}
                              {n.title}
                            </span>
                            <span className="text-[10px] text-stone-400">{n.timestamp}</span>
                          </div>
                          <p className="text-stone-600 text-[11px] leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-stone-400 text-center py-4">No notifications yet.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Nav Items */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  pathname === '/'
                    ? 'bg-brand-50 text-brand-700 font-bold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-cream-100'
                }`}
              >
                Home
              </Link>
              <Link
                href="/plans"
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                  pathname === '/plans'
                    ? 'bg-brand-50 text-brand-700 font-bold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-cream-100'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-brand-600" />
                <span>My Plans</span>
                {activePlansCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-brand-600 text-white leading-none">
                    {activePlansCount}
                  </span>
                )}
              </Link>
              <Link
                href="/orders"
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                  pathname === '/orders'
                    ? 'bg-brand-50 text-brand-700 font-bold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-cream-100'
                }`}
              >
                <PackageCheck className="w-3.5 h-3.5" />
                <span>Orders</span>
              </Link>
              <Link
                href="/profile"
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                  pathname === '/profile'
                    ? 'bg-brand-50 text-brand-700 font-bold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-cream-100'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-cream-300 flex items-center justify-center text-[11px] font-bold text-stone-700">
                  S
                </div>
                <span>Profile</span>
              </Link>
            </nav>

            {/* Provider Portal Button */}
            <Link
              href="/partner"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold transition-all border shadow-sm ${
                pathname === '/partner'
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
              }`}
              title="Provider Kitchen Dashboard"
            >
              <ChefHat className="w-3.5 h-3.5 text-amber-800" />
              <span className="hidden sm:inline">Provider Dashboard</span>
              <span className="sm:hidden">Partner</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
