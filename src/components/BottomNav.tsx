'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CalendarHeart, ShoppingBag, User, ChefHat } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function BottomNav() {
  const pathname = usePathname();
  const { userPlans } = useApp();
  const activePlansCount = userPlans.filter((p) => p.status === 'Active').length;

  const navItems = [
    { label: 'Explore', href: '/', icon: Home },
    {
      label: 'My Plans',
      href: '/plans',
      icon: CalendarHeart,
      badge: activePlansCount > 0 ? activePlansCount : undefined,
    },
    { label: 'Orders', href: '/orders', icon: ShoppingBag },
    { label: 'Partner', href: '/partner', icon: ChefHat },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FCFAF6]/95 backdrop-blur-md border-t border-[#EFE8DA] px-1 py-1 safe-area-pb shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 px-0.5 relative transition-colors ${
                isActive ? 'text-brand-700 font-semibold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px] scale-105' : 'stroke-[1.75px]'}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-brand-600 absolute bottom-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
