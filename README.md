# Rozzo - Everyday Tiffin 🍱
> Affordable, home-style daily meals and subscriptions designed for PG residents, students, and busy professionals.

Built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**.

---

## 🌟 Highlights & Design Aesthetic

- **Warm Indian Food Aesthetic**: Soft cream backgrounds (`#FCFAF6`), earthy green accents (`brand`), terracotta and saffron highlights, rounded cards (`rounded-3xl`), and readable typography.
- **Mobile-First Responsive Experience**:
  - Sticky header with location switcher pill, search bar, and Customer Notifications bell.
  - Mobile bottom navigation bar for quick transitions between Explore, My Plans, Orders, Partner Dashboard, and Profile.
  - Desktop-optimized grid layouts and navigation pills.

---

## 🚀 Features Implemented in Phase 3

1. **Functional Provider Kitchen Dashboard (`/partner`)**:
   - **Kitchen Switcher**: Switch between any of the 6 home kitchens to manage orders, subscribers, and menus.
   - **Live KPI Metrics**: Today's orders in pipeline, active recurring subscribers, daily capacity utilization bar, and revenue.
   - **Daily Orders Pipeline**: Manage incoming orders with full status lifecycle:
     - `Scheduled` ➔ `Confirmed` ➔ `Accepted` ➔ `Preparing` ➔ `Ready` ➔ `Out for Delivery` ➔ `Delivered` (or `Cancelled`).
     - 1-click status progression which triggers real-time customer notifications.
   - **Active Subscribers Overview**: Lists recurring subscribers, meal plan types, consumed vs. remaining meals, and assigned lunch/dinner destinations (PG vs. Office).

2. **Menu Management (Daily Specials & 7-Day Rotating Schedule)**:
   - **Today's Menu Editor**: Live input to update afternoon Lunch special and night Dinner special, updating customer-facing pages instantly.
   - **7-Day Weekly Schedule Editor**: Interactive day tabs (Mon–Sun) allowing the kitchen manager to update main curry, dry sabzi, breads, rice, accompaniments, and calories.

3. **Capacity, Cutoffs & Service Area Configuration**:
   - Configure base meal price (₹), maximum daily kitchen capacity, and booked quantity cap.
   - Lunch & Dinner delivery slots.
   - **Cancellation Cutoffs**: Configurable cutoff times (e.g., 10:30 AM for Lunch, 05:30 PM for Dinner, or 2 hours before dispatch).
   - **Service Area Checklist**: Active serviceable areas in Bengaluru (Koramangala, HSR Layout, Indiranagar, BTM, Bellandur, Whitefield) used for customer address validation.

4. **Customer Meal Skipping & Cutoff Validated Cancellation**:
   - **Skip Eligible Meal**: In *My Plans*, customers can skip upcoming lunch or dinner before cutoff. Meal credit is preserved, and subscription expiry is automatically extended by 1 day.
   - **Order Cancellation**: In *Orders*, customers can cancel `Scheduled` or `Confirmed` meals before the cutoff with a selected reason. If cutoff has passed or food is preparing, cancellation is safely prevented.

5. **Service Area & Cutoff Validated Address Switching**:
   - In *My Plans*, customers can re-route Lunch or Dinner to any saved PG or Office address.
   - **Validation**: System validates that the target address is within the kitchen's configured `serviceableAreas`. If outside, an informative error message is displayed.

6. **Real-Time Customer Notifications**:
   - Dedicated notification dropdown in the Header with unread badge count.
   - Auto-generates notifications when:
     - Kitchen updates order status (e.g. "Maa Ki Rasoi has marked your dabba as Preparing").
     - Customer switches delivery address between PG and Office.
     - Customer skips or cancels an eligible meal before cutoff.
     - New subscription is activated.

---

## 🍽️ 6 Verified Tiffin Providers (Bengaluru)

1. **Maa Ki Rasoi - Homestyle Thalis** (*Koramangala, 5th Block*) — Pure Veg North Indian.
2. **Annapurna Ghar Se - Kathiyawadi & Gujarati** (*HSR Layout, Sector 3*) — Satvik Gujarati & Kathiyawadi.
3. **Dadi's Kitchen - Punjabi & Desi Ghee Dabba** (*Indiranagar, 12th Main*) — Hearty Punjabi home dabba.
4. **Dakshin Daily Dabba - South Indian Meals** (*BTM Layout, 2nd Stage*) — Traditional Sambar, Rasam & Curd Rice.
5. **FitBite Tiffins - High Protein & Low Calorie** (*Whitefield, ITPL*) — Macro-tracked fitness meals (28g–35g protein).
6. **Bengali Rasoi - Gharer Khabar** (*Bellandur & Green Glen*) — Authentic Kolkata homestyle & Macher Jhol.

---

## 💻 How to Run Locally

```bash
# Clone or navigate to the project directory
cd "Rozzo"

# Start the development server
npm run dev

# Or run the optimized production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) for the customer storefront, or [http://localhost:3000/partner](http://localhost:3000/partner) for the Provider Dashboard.

---

## 🔮 Roadmap: Remaining Work for Phase 4

1. **Backend Database & ORM Integration**:
   - Replace local mock state with PostgreSQL / Supabase schema using Prisma or Drizzle ORM.
   - Real database transactions for subscription renewal, meal credit accounting, and capacity locking.
2. **Authentication & User Identity**:
   - Phone OTP authentication via Twilio / Firebase / WhatsApp OTP for passwordless login.
   - Role-based access control (Customer vs. Verified Kitchen Partner).
3. **Live Payments & UPI AutoPay**:
   - Razorpay / Cashfree integration supporting UPI recurring mandates for automated monthly/weekly plan renewals.
   - Rozzo In-App Wallet for instant meal skip refunds and referral credits.
4. **Delivery Partner Fleet & Live GPS Tracking**:
   - Integration with delivery fleet APIs (Dunzo for Business, Shadowfax, or in-house runner app).
   - Live rider location on Mapbox/Leaflet with real-time SSE/WebSocket location updates.
5. **Automated WhatsApp Bot Alerts**:
   - 09:00 AM daily automated ping with interactive buttons (`Deliver to PG`, `Deliver to Office`, `Skip Today`).
