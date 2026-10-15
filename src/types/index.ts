export type MealSlot = 'lunch' | 'dinner' | 'both';
export type PlanType = 'trial' | 'weekly' | 'monthly';

export type OrderStatus =
  | 'Scheduled'
  | 'Confirmed'
  | 'Accepted'
  | 'Preparing'
  | 'Ready'
  | 'Assigned'
  | 'Picked Up'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Failed'
  | 'Cancelled';

export type DeliveryMode = 'platform-managed' | 'provider-managed';

export interface RiderInfo {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  photoUrl?: string;
  rating?: number;
}

export interface Address {
  id: string;
  type: 'PG / Hostel' | 'Office' | 'Home' | 'Other';
  title: string;
  roomFlat: string;
  buildingName: string;
  landmark: string;
  area: string;
  city: string;
  deliveryInstructions: string;
  isDefault: boolean;
}

export interface DayMenuSchedule {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  dateLabel?: string;
  lunch: {
    mainCurry: string;
    drySabzi: string;
    breads: string;
    rice: string;
    accompaniments: string;
    calories: number;
    specialHighlight?: string;
  };
  dinner: {
    mainCurry: string;
    drySabzi: string;
    breads: string;
    rice: string;
    accompaniments: string;
    calories: number;
    specialHighlight?: string;
  };
}

export interface SubscriptionPlan {
  id: string;
  type: PlanType;
  title: string;
  badge?: string;
  durationDays: number;
  pricePerMeal: number;
  originalPricePerMeal: number;
  savingsPercent: number;
  idealFor: string;
  features: string[];
  allowsPause: boolean;
  freeDelivery: boolean;
}

export interface TiffinProvider {
  id: string;
  name: string;
  tagline: string;
  locationArea: string;
  city: string;
  distance: string;
  rating: number;
  reviewCount: number;
  hygieneBadge: string;
  kitchenType: string;
  dietaryTags: string[];
  isPureVeg: boolean;
  hasJainOption: boolean;
  sampleMealPrice: number;
  deliverySlots: {
    lunch: string;
    dinner: string;
  };
  todayHighlight: {
    lunchSpecial: string;
    dinnerSpecial: string;
  };
  weeklySchedule: DayMenuSchedule[];
  plans: SubscriptionPlan[];
  imageUrl: string;
  coverUrl: string;
  description: string;
  packagingNote: string;
  // Capacity, Cutoffs & Service Areas
  serviceableAreas: string[];
  maxDailyCapacity: number;
  currentBookedCount: number;
  lunchCutoffTime: string; // e.g. "10:30 AM"
  dinnerCutoffTime: string; // e.g. "05:30 PM"
  cancellationCutoffHours: number; // e.g. 2
  // Phase 4 Delivery Mode
  deliveryMode: DeliveryMode;
}

export interface UserPlan {
  id: string;
  providerId: string;
  providerName: string;
  providerImage: string;
  planName: string;
  planType: PlanType;
  mealSlot: MealSlot;
  deliveryTimeSlot: string;
  startDate: string;
  expiryDate: string;
  totalMeals: number;
  consumedMeals: number;
  status: 'Active' | 'Paused' | 'Completed';
  nextMealDelivery: string;
  customerName?: string;
  customerPhone?: string;
  // Per-meal address choices
  lunchAddressId?: string;
  dinnerAddressId?: string;
  addressId: string; // fallback / default address
  selectedDays?: string[]; // e.g. ['Monday', 'Tuesday', ...]
  pricePaid: number;
  skippedDates?: string[];
  isSkippedToday?: boolean;
}

export interface PastOrder {
  id: string;
  providerId: string;
  providerName: string;
  customerName?: string;
  customerPhone?: string;
  mealType: 'Lunch' | 'Dinner';
  date: string;
  timeSlot: string;
  items: string[];
  status: OrderStatus;
  addressSnapshot: string;
  addressType?: Address['type'];
  addressArea?: string;
  deliveryInstructions?: string;
  deliveryMode: DeliveryMode;
  rider?: RiderInfo;
  estimatedDeliveryWindow?: string;
  estimatedMinutesAway?: number;
  mapQueryUrl?: string;
  price: number;
  cancellationCutoff?: string;
  isCutoffPassed?: boolean;
  failedReason?: string;
  cancellationReason?: string;
}

export interface CustomerNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'order_status' | 'address_change' | 'meal_skipped' | 'meal_cancelled' | 'delivery_update' | 'delivery_failed' | 'system';
  read: boolean;
  orderId?: string;
}

export interface BookingSummaryData {
  provider: TiffinProvider;
  plan: SubscriptionPlan;
  mealSlot: MealSlot;
  startDate: string;
  endDate: string;
  selectedDays: string[];
  lunchAddress: Address;
  dinnerAddress: Address;
  pricePerMeal: number;
  totalMeals: number;
  originalPrice: number;
  discountSavings: number;
  finalPrice: number;
}
