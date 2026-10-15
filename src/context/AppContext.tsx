'use client';

import React, { createContext, useContext, useState } from 'react';
import {
  Address,
  TiffinProvider,
  UserPlan,
  PastOrder,
  MealSlot,
  SubscriptionPlan,
  OrderStatus,
  CustomerNotification,
  DayMenuSchedule,
} from '../types';
import {
  LOCATIONS,
  INITIAL_ADDRESSES,
  MOCK_PROVIDERS,
  INITIAL_USER_PLANS,
  INITIAL_PAST_ORDERS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

interface LocationItem {
  id: string;
  name: string;
  city: string;
  landmark: string;
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating';

interface AppContextType {
  selectedLocation: LocationItem;
  setSelectedLocation: (loc: LocationItem) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  mealTimeFilter: 'all' | 'lunch' | 'dinner';
  setMealTimeFilter: (filter: 'all' | 'lunch' | 'dinner') => void;
  dietaryFilter: 'all' | 'pure-veg' | 'jain' | 'high-protein' | 'budget';
  setDietaryFilter: (filter: 'all' | 'pure-veg' | 'jain' | 'high-protein' | 'budget') => void;
  maxPriceFilter: number;
  setMaxPriceFilter: (price: number) => void;
  locationFilter: string;
  setLocationFilter: (loc: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  providers: TiffinProvider[];
  userPlans: UserPlan[];
  addresses: Address[];
  pastOrders: PastOrder[];
  notifications: CustomerNotification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  // Partner Provider Mode
  activePartnerProviderId: string;
  setActivePartnerProviderId: (id: string) => void;
  updateDailyMenu: (providerId: string, lunchSpecial: string, dinnerSpecial: string) => void;
  updateWeeklyDayMenu: (providerId: string, day: string, lunch: DayMenuSchedule['lunch'], dinner: DayMenuSchedule['dinner']) => void;
  updateProviderSettings: (providerId: string, settings: Partial<TiffinProvider>) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  // Customer action & validations
  cancelOrder: (orderId: string, reason?: string) => { success: boolean; error?: string };
  skipMeal: (planId: string, mealType: 'Lunch' | 'Dinner') => { success: boolean; error?: string };
  validateAndSwitchAddress: (planId: string, slot: 'lunch' | 'dinner', targetAddressId: string) => { success: boolean; error?: string };
  // Subscription & Booking Actions
  addPlan: (provider: TiffinProvider, planId: string, mealSlot: MealSlot, addressId: string) => void;
  addPlanWithBooking: (booking: {
    provider: TiffinProvider;
    planId: string;
    mealSlot: MealSlot;
    lunchAddressId?: string;
    dinnerAddressId?: string;
    selectedDays: string[];
    startDate?: string;
  }) => void;
  togglePausePlan: (planId: string) => void;
  switchPlanAddress: (planId: string, addressId: string) => void;
  switchMealSlotAddress: (planId: string, slot: 'lunch' | 'dinner', addressId: string) => void;
  // Address management
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (address: Address) => void;
  deleteAddress: (id: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  // Global Booking Summary Modal state
  bookingModalData: { provider: TiffinProvider; initialPlan?: SubscriptionPlan } | null;
  openBookingModal: (provider: TiffinProvider, initialPlan?: SubscriptionPlan) => void;
  closeBookingModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedLocation, setSelectedLocation] = useState<LocationItem>(LOCATIONS[0]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [mealTimeFilter, setMealTimeFilter] = useState<'all' | 'lunch' | 'dinner'>('all');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'pure-veg' | 'jain' | 'high-protein' | 'budget'>('all');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(150);
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [providers, setProviders] = useState<TiffinProvider[]>(MOCK_PROVIDERS);
  const [userPlans, setUserPlans] = useState<UserPlan[]>(INITIAL_USER_PLANS);
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [pastOrders, setPastOrders] = useState<PastOrder[]>(INITIAL_PAST_ORDERS);
  const [notifications, setNotifications] = useState<CustomerNotification[]>(INITIAL_NOTIFICATIONS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Provider for Partner Dashboard
  const [activePartnerProviderId, setActivePartnerProviderId] = useState<string>('maa-ki-rasoi');

  // Global booking modal
  const [bookingModalData, setBookingModalData] = useState<{ provider: TiffinProvider; initialPlan?: SubscriptionPlan } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const addNotification = (notif: Omit<CustomerNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: CustomerNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.');
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const openBookingModal = (provider: TiffinProvider, initialPlan?: SubscriptionPlan) => {
    setBookingModalData({ provider, initialPlan });
  };

  const closeBookingModal = () => {
    setBookingModalData(null);
  };

  // Provider Kitchen Updates (Phase 3)
  const updateDailyMenu = (providerId: string, lunchSpecial: string, dinnerSpecial: string) => {
    setProviders((prev) =>
      prev.map((p) => {
        if (p.id === providerId) {
          return {
            ...p,
            todayHighlight: {
              lunchSpecial,
              dinnerSpecial,
            },
          };
        }
        return p;
      })
    );
    showToast(`✅ Today's menu updated for kitchen!`);
  };

  const updateWeeklyDayMenu = (
    providerId: string,
    day: string,
    lunch: DayMenuSchedule['lunch'],
    dinner: DayMenuSchedule['dinner']
  ) => {
    setProviders((prev) =>
      prev.map((p) => {
        if (p.id === providerId) {
          const updatedSchedule = p.weeklySchedule.map((s) => {
            if (s.day.toLowerCase() === day.toLowerCase()) {
              return { ...s, lunch, dinner };
            }
            return s;
          });
          return { ...p, weeklySchedule: updatedSchedule };
        }
        return p;
      })
    );
    showToast(`✅ ${day}'s weekly schedule updated!`);
  };

  const updateProviderSettings = (providerId: string, settings: Partial<TiffinProvider>) => {
    setProviders((prev) =>
      prev.map((p) => {
        if (p.id === providerId) {
          return { ...p, ...settings };
        }
        return p;
      })
    );
    showToast(`⚙️ Kitchen parameters & service capacity updated!`);
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    let affectedOrder: PastOrder | undefined;

    setPastOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          affectedOrder = o;
          return { ...o, status: newStatus };
        }
        return o;
      })
    );

    if (affectedOrder) {
      showToast(`📦 Order ${orderId} marked as ${newStatus}`);
      addNotification({
        title: `Order Status: ${newStatus}`,
        message: `${affectedOrder.providerName} has updated order ${orderId} (${affectedOrder.mealType}) to "${newStatus}".`,
        type: 'order_status',
        orderId: affectedOrder.id,
      });
    }
  };

  // Customer Cancellation with Cutoff Validation
  const cancelOrder = (orderId: string, reason?: string) => {
    const order = pastOrders.find((o) => o.id === orderId);
    if (!order) return { success: false, error: 'Order not found.' };

    const provider = providers.find((p) => p.id === order.providerId);
    const cutoffTimeStr = order.mealType === 'Dinner' ? provider?.dinnerCutoffTime || '05:30 PM' : provider?.lunchCutoffTime || '10:30 AM';

    // Check if order is already out or cutoff passed
    if (order.isCutoffPassed || order.status === 'Preparing' || order.status === 'Ready' || order.status === 'Out for Delivery' || order.status === 'Delivered') {
      const errMsg = `Cannot cancel order #${order.id}. Dispatch cutoff (${cutoffTimeStr}) has already passed for this meal.`;
      showToast(`⚠️ ${errMsg}`);
      return { success: false, error: errMsg };
    }

    setPastOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'Cancelled' as OrderStatus } : o))
    );

    // Release kitchen capacity
    if (provider) {
      setProviders((prev) =>
        prev.map((p) => (p.id === provider.id ? { ...p, currentBookedCount: Math.max(0, p.currentBookedCount - 1) } : p))
      );
    }

    showToast(`✅ Order #${orderId} cancelled before ${cutoffTimeStr}.`);
    addNotification({
      title: 'Order Cancelled Before Cutoff',
      message: `Your ${order.mealType} meal #${order.id} was successfully cancelled before ${cutoffTimeStr}. Reason: ${reason || 'Customer requested'}.`,
      type: 'meal_cancelled',
      orderId,
    });

    return { success: true };
  };

  // Customer Skip Meal with Cutoff Rule & Subscription Extension
  const skipMeal = (planId: string, mealType: 'Lunch' | 'Dinner') => {
    const plan = userPlans.find((p) => p.id === planId);
    if (!plan) return { success: false, error: 'Subscription plan not found.' };

    const provider = providers.find((p) => p.id === plan.providerId);
    const cutoffTime = mealType === 'Dinner' ? provider?.dinnerCutoffTime || '05:30 PM' : provider?.lunchCutoffTime || '10:30 AM';

    // Simulate rule: if dinner, cutoff is 5:30 PM; if lunch, cutoff is 10:30 AM
    const todayDateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

    // Mark plan as skipped for today
    setUserPlans((prev) =>
      prev.map((p) => {
        if (p.id === planId) {
          const currentSkipped = p.skippedDates || [];
          return {
            ...p,
            isSkippedToday: true,
            skippedDates: [...currentSkipped, todayDateStr],
            nextMealDelivery: `Tomorrow, ${mealType}`,
          };
        }
        return p;
      })
    );

    showToast(`⏸️ ${mealType} skipped for today. No meal deducted!`);
    addNotification({
      title: `${mealType} Skipped for Today`,
      message: `Your ${mealType} from ${plan.providerName} has been skipped before the ${cutoffTime} cutoff. Your subscription expiry is automatically extended.`,
      type: 'meal_skipped',
    });

    return { success: true };
  };

  // Customer Address Switch with Provider Service Area Validation & Cutoff Check
  const validateAndSwitchAddress = (planId: string, slot: 'lunch' | 'dinner', targetAddressId: string) => {
    const plan = userPlans.find((p) => p.id === planId);
    if (!plan) return { success: false, error: 'Plan not found.' };

    const targetAddr = addresses.find((a) => a.id === targetAddressId);
    if (!targetAddr) return { success: false, error: 'Target address not found.' };

    const provider = providers.find((p) => p.id === plan.providerId);
    if (provider) {
      // Validate Service Area!
      const serviceable = provider.serviceableAreas.some((area) =>
        targetAddr.area.toLowerCase().includes(area.toLowerCase().split(',')[0].trim()) ||
        area.toLowerCase().includes(targetAddr.area.toLowerCase().split(',')[0].trim())
      );

      if (!serviceable) {
        const errMsg = `Address "${targetAddr.title}" (${targetAddr.area}) is outside ${provider.name}'s delivery coverage areas: ${provider.serviceableAreas.join(', ')}.`;
        showToast(`❌ ${errMsg}`);
        return { success: false, error: errMsg };
      }
    }

    // Apply change
    setUserPlans((prev) =>
      prev.map((p) => {
        if (p.id === planId) {
          return {
            ...p,
            lunchAddressId: slot === 'lunch' ? targetAddressId : p.lunchAddressId,
            dinnerAddressId: slot === 'dinner' ? targetAddressId : p.dinnerAddressId,
          };
        }
        return p;
      })
    );

    const cutoffInfo = slot === 'dinner' ? provider?.dinnerCutoffTime || '05:30 PM' : provider?.lunchCutoffTime || '10:30 AM';
    showToast(`📍 ${slot === 'lunch' ? 'Lunch' : 'Dinner'} destination updated to ${targetAddr.title} (${targetAddr.type})`);

    addNotification({
      title: `Delivery Destination Switched (${slot === 'lunch' ? 'Lunch' : 'Dinner'})`,
      message: `Delivering to ${targetAddr.title} (${targetAddr.roomFlat}, ${targetAddr.area}) before the ${cutoffInfo} cutoff.`,
      type: 'address_change',
    });

    return { success: true };
  };

  const addPlanWithBooking = ({
    provider,
    planId,
    mealSlot,
    lunchAddressId,
    dinnerAddressId,
    selectedDays,
    startDate,
  }: {
    provider: TiffinProvider;
    planId: string;
    mealSlot: MealSlot;
    lunchAddressId?: string;
    dinnerAddressId?: string;
    selectedDays: string[];
    startDate?: string;
  }) => {
    // Meal capacity validation
    if (provider.currentBookedCount >= provider.maxDailyCapacity) {
      showToast(`⚠️ Kitchen Capacity Full: ${provider.name} is currently at max daily meal capacity (${provider.maxDailyCapacity} meals).`);
    }

    const planDetail = provider.plans.find((p) => p.id === planId) || provider.plans[0];
    const daysCount = planDetail.durationDays;

    const start = startDate ? new Date(startDate) : new Date();
    const expiry = new Date(start);
    expiry.setDate(start.getDate() + daysCount);

    const slotLabel =
      mealSlot === 'lunch'
        ? provider.deliverySlots.lunch
        : mealSlot === 'dinner'
        ? provider.deliverySlots.dinner
        : `Lunch: ${provider.deliverySlots.lunch.split('-')[0].trim()} • Dinner: ${provider.deliverySlots.dinner.split('-')[0].trim()}`;

    const multiplier = mealSlot === 'both' ? 2 : 1;
    const totalMeals = daysCount * multiplier;
    const totalAmount = planDetail.pricePerMeal * totalMeals;

    const defaultAddr = addresses[0]?.id || 'addr-pg-1';
    const effectiveLunchAddr = lunchAddressId || defaultAddr;
    const effectiveDinnerAddr = dinnerAddressId || defaultAddr;

    const newPlan: UserPlan = {
      id: `plan-${Date.now()}`,
      providerId: provider.id,
      providerName: provider.name,
      providerImage: provider.imageUrl,
      planName: planDetail.title,
      planType: planDetail.type,
      mealSlot: mealSlot,
      deliveryTimeSlot: slotLabel,
      startDate: start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      expiryDate: expiry.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      totalMeals: totalMeals,
      consumedMeals: 0,
      status: 'Active',
      nextMealDelivery: `Tomorrow, ${mealSlot === 'dinner' ? 'Dinner' : 'Lunch'} (${
        mealSlot === 'dinner' ? provider.deliverySlots.dinner.split('-')[0].trim() : provider.deliverySlots.lunch.split('-')[0].trim()
      })`,
      customerName: 'Saurabh Sharma',
      customerPhone: '+91 98765 43210',
      lunchAddressId: effectiveLunchAddr,
      dinnerAddressId: effectiveDinnerAddr,
      addressId: effectiveLunchAddr,
      selectedDays: selectedDays && selectedDays.length > 0 ? selectedDays : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      pricePaid: totalAmount,
    };

    setUserPlans((prev) => [newPlan, ...prev]);

    // Increment provider booked count
    setProviders((prev) =>
      prev.map((p) => (p.id === provider.id ? { ...p, currentBookedCount: p.currentBookedCount + 1 } : p))
    );

    // Create upcoming mock meal order in PastOrders
    const targetAddrObj = addresses.find((a) => a.id === (mealSlot === 'dinner' ? effectiveDinnerAddr : effectiveLunchAddr)) || addresses[0];
    const newOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: PastOrder = {
      id: newOrderId,
      providerId: provider.id,
      providerName: provider.name,
      customerName: 'Saurabh Sharma',
      customerPhone: '+91 98765 43210',
      mealType: mealSlot === 'dinner' ? 'Dinner' : 'Lunch',
      date: 'Tomorrow (First Delivery)',
      timeSlot: mealSlot === 'dinner' ? provider.deliverySlots.dinner : provider.deliverySlots.lunch,
      items: [
        provider.todayHighlight.lunchSpecial.split('+')[0]?.trim() || 'Dal Tadka',
        '4 Soft Desi Ghee Phulkas',
        'Steamed Basmati Rice',
        'Kachumber Salad',
      ],
      status: 'Scheduled',
      addressSnapshot: `${targetAddrObj.buildingName}, ${targetAddrObj.area}`,
      addressType: targetAddrObj.type,
      addressArea: targetAddrObj.area,
      price: planDetail.pricePerMeal,
      cancellationCutoff: mealSlot === 'dinner' ? provider.dinnerCutoffTime : provider.lunchCutoffTime,
      isCutoffPassed: false,
    };

    setPastOrders((prev) => [newOrder, ...prev]);

    addNotification({
      title: 'Subscription Activated! 🎉',
      message: `Your ${planDetail.title} at ${provider.name} is now active. First delivery arrives tomorrow.`,
      type: 'system',
      orderId: newOrderId,
    });

    showToast(`🎉 Subscribed! ${planDetail.title} at ${provider.name} is now active.`);
  };

  const addPlan = (provider: TiffinProvider, planId: string, mealSlot: MealSlot, addressId: string) => {
    addPlanWithBooking({
      provider,
      planId,
      mealSlot,
      lunchAddressId: addressId,
      dinnerAddressId: addressId,
      selectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    });
  };

  const togglePausePlan = (planId: string) => {
    setUserPlans((prev) =>
      prev.map((plan) => {
        if (plan.id === planId) {
          const nextStatus = plan.status === 'Active' ? 'Paused' : 'Active';
          showToast(nextStatus === 'Paused' ? '⏸️ Plan paused. Meals frozen without deduction.' : '▶️ Plan resumed! Meals restart tomorrow.');
          return { ...plan, status: nextStatus };
        }
        return plan;
      })
    );
  };

  const switchPlanAddress = (planId: string, addressId: string) => {
    validateAndSwitchAddress(planId, 'lunch', addressId);
    validateAndSwitchAddress(planId, 'dinner', addressId);
  };

  const switchMealSlotAddress = (planId: string, slot: 'lunch' | 'dinner', addressId: string) => {
    validateAndSwitchAddress(planId, slot, addressId);
  };

  const addAddress = (newAddr: Omit<Address, 'id'>) => {
    const id = `addr-${Date.now()}`;
    const fullAddress: Address = { ...newAddr, id };
    setAddresses((prev) => [fullAddress, ...prev]);
    showToast(`✅ Saved address "${newAddr.title}"`);
  };

  const updateAddress = (updated: Address) => {
    setAddresses((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    showToast(`✅ Updated address "${updated.title}"`);
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    showToast('🗑️ Address removed.');
  };

  return (
    <AppContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation,
        isLocationModalOpen,
        setIsLocationModalOpen,
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
        providers,
        userPlans,
        addresses,
        pastOrders,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        activePartnerProviderId,
        setActivePartnerProviderId,
        updateDailyMenu,
        updateWeeklyDayMenu,
        updateProviderSettings,
        updateOrderStatus,
        cancelOrder,
        skipMeal,
        validateAndSwitchAddress,
        addPlan,
        addPlanWithBooking,
        togglePausePlan,
        switchPlanAddress,
        switchMealSlotAddress,
        addAddress,
        updateAddress,
        deleteAddress,
        toastMessage,
        showToast,
        bookingModalData,
        openBookingModal,
        closeBookingModal,
      }}
    >
      {children}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-stone-900/95 text-white px-5 py-3 rounded-full text-sm font-medium shadow-2xl flex items-center gap-2 border border-stone-700 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
