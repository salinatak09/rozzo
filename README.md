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

## 🚀 Features Implemented in Phase 4 (Delivery Management Workflow)

1. **Dual Delivery Modes (Platform-Managed vs. Provider-Managed)**:
   - **Rozzo Green Fleet (`platform-managed`)**: Platform electric two-wheeler fleet with automated runner assignment, turn-by-turn navigation, and live customer ETA windows.
   - **Kitchen Express (`provider-managed`)**: Home kitchen’s own dedicated delivery boys handling local PG clusters and neighborhood drops.
   - Kitchens can toggle their preferred delivery fleet mode with 1-click in the Partner Kitchen Dashboard (`/partner`).

2. **Delivery Operations & Runner Dashboard (`/delivery`)**:
   - Dedicated dispatch hub for delivery riders, fleet captains, and kitchen dispatchers.
   - **Live KPI Strip**: Active in-flight deliveries, orders ready for pickup, on-time completions today, and delivery exception counters.
   - **Filtering Controls**: Filter by status (`All Runs`, `Ready for Pickup`, `In-Flight`, `Delivered`, `Failed / Issues`) and by fleet mode (`Rozzo Green Fleet` vs `Kitchen Express`).
   - **Order Dispatch Cards**:
     - Customer name, phone (1-click direct calling via `tel:`), meal type, packed dish items.
     - Destination address with badges for **PG / Hostel**, **Office Desk**, or **Home**.
     - Special delivery instructions prominently highlighted (e.g., *"Leave with security guard if door locked"*, *"Deliver to 4th Floor Tower B reception delivery shelf"*).
     - Turn-by-Turn GPS navigation link direct to Google Maps (`mapQueryUrl`).
     - Real-time ETA updater (10m, 15m, 25m, 35m).

3. **Complete Delivery Status Lifecycle & Valid State Transitions**:
   - Full status lifecycle: `Ready` ➔ `Assigned` ➔ `Picked Up` ➔ `Out for Delivery` ➔ `Delivered` (or `Failed` / `Cancelled`).
   - Enforced transition validation rules to prevent invalid or out-of-sequence jumps.
   - **Rider Assignment Modal**: Assign active runners (Ramesh Kumar on EV, Suresh Gowda on Splendor, Priya Sharma on Ather) with vehicle details and ratings.
   - **Delivery Exception Reporting Modal**: Capture failure reasons (customer unreachable, gate security refused entry without OTP, severe waterlogging) and automatically credit 100% rollover meal to the customer with zero penalty.

4. **Customer Live Delivery Tracker Component (`DeliveryStatusTracker`)**:
   - Visual 5-step progress stepper: *Confirmed ➔ Cooking ➔ Packed ➔ On The Way ➔ Delivered*.
   - Live ETA pills (e.g., *"12:45 PM – 01:05 PM (~12 mins away)"*).
   - Assigned rider identity card with vehicle number, vehicle model, and 1-click runner phone call button.
   - Integrated directly into **Order History (`/orders`)** and **My Plans (`/plans`)** active banners.

5. **Customer Notifications & Resolution Messages**:
   - Real-time notification center triggers updates for runner assignment, kitchen pickup, out-for-delivery alerts, meal delivery, and failed delivery rollover guarantees.

---

## 🍽️ 6 Verified Tiffin Providers (Bengaluru)

1. **Maa Ki Rasoi - Homestyle Thalis** (*Koramangala, 5th Block*) — Pure Veg North Indian (`Rozzo Green Fleet`).
2. **Annapurna Ghar Se - Kathiyawadi & Gujarati** (*HSR Layout, Sector 3*) — Satvik Gujarati & Kathiyawadi (`Kitchen Express`).
3. **Dadi's Kitchen - Punjabi & Desi Ghee Dabba** (*Indiranagar, 12th Main*) — Hearty Punjabi home dabba (`Rozzo Green Fleet`).
4. **Dakshin Daily Dabba - South Indian Meals** (*BTM Layout, 2nd Stage*) — Traditional Sambar, Rasam & Curd Rice (`Kitchen Express`).
5. **FitBite Tiffins - High Protein & Low Calorie** (*Whitefield, ITPL*) — Macro-tracked fitness meals (`Rozzo Green Fleet`).
6. **Bengali Rasoi - Gharer Khabar** (*Bellandur & Green Glen*) — Authentic Kolkata homestyle & Macher Jhol (`Kitchen Express`).

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

- **Customer Marketplace**: [http://localhost:3000](http://localhost:3000)
- **Delivery Fleet Hub**: [http://localhost:3000/delivery](http://localhost:3000/delivery)
- **Provider Kitchen Dashboard**: [http://localhost:3000/partner](http://localhost:3000/partner)
- **Customer Meal Orders & Live Tracking**: [http://localhost:3000/orders](http://localhost:3000/orders)
- **Customer Subscriptions & Address Allocation**: [http://localhost:3000/plans](http://localhost:3000/plans)

---

## 🔮 Roadmap: Remaining Work for Phase 5

1. **Backend Database & Persistence**:
   - Replace local mock state with PostgreSQL / Supabase schema using Prisma or Drizzle ORM.
   - Persistent transactional records for meal subscriptions, daily dispatch queues, and customer rollover credits.
2. **Authentication & User Roles**:
   - Passwordless phone OTP authentication (Firebase / Supabase Auth).
   - Role-based authorization for Customers, Kitchen Partners, and Fleet Runners.
3. **Live Payments & Recurring Subscriptions**:
   - Razorpay / Cashfree integration supporting UPI Autopay / recurring mandates.
   - Rozzo In-App Wallet for instant meal skip refunds and referral credits.
4. **Real GPS & Runner Telemetry**:
   - WebSockets / SSE for live runner lat/long coordinates streaming to interactive Mapbox/Leaflet maps.
   - Push notifications via Web Push / FCM.
