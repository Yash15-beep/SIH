# 06 — UI/UX Specification

## 1. Design Principles
1. **Farmer-first simplicity**: large tap targets, icons + text (not icon-only), dropdowns over free-text wherever possible, minimal steps to list produce (target: ≤5 taps).
2. **Trust through transparency**: every price shown next to it's "why" (e.g., "₹22/kg — based on today's Rewari mandi rate of ₹24/kg").
3. **Bilingual by default**: every screen has an EN/HI toggle in the header; Hindi is not an afterthought — write Hindi copy alongside English from day one.
4. **Low-bandwidth tolerant**: compress images, lazy-load, works usably on 3G.

## 2. Visual Identity (starter — team can restyle)
- Primary color: Earthy green `#2E7D32` (growth, agriculture)
- Secondary/accent: Warm amber `#F9A825` (harvest, price highlight)
- Neutral background: off-white `#FAFAF7`
- Font: `Inter` or `Noto Sans` (Noto Sans has excellent Devanagari/Hindi glyph support — required for bilingual UI)
- Iconography: simple line icons (Lucide/Feather — free, open source)

## 3. Screen-by-Screen Spec

### 3.1 Landing / Role Selection (`/`)
- Hero: app name + one-line tagline ("Bridging Farmers to Markets, Directly")
- 3 large buttons: "I'm a Farmer/FPO" · "I want to Buy" (consumer) · "Bulk Buying" — routes into role-appropriate registration.
- Small "Government/Admin login" link, low visual weight.

### 3.2 Registration/Login
- Phone number + OTP (no password) — lowest-friction for farmers.
- Role-specific fields shown conditionally: Farmer/FPO → village, pincode, crop types grown; Consumer → delivery address; Bulk Buyer → business name, business type.
- Language selector shown first, before any other field.

### 3.3 Farmer Dashboard (`/farmer/dashboard`)
- Top: "Today's suggested prices" card carousel for the farmer's usual crops (pulled from Agmarknet).
- "+ List New Produce" primary CTA (amber button, always visible).
- List of active listings with status chips (Active / Sold Out / Expired).
- Bottom: "This month's earnings" summary card with a "vs. mandi average" comparison — the emotional payoff screen.

### 3.4 New Listing Form (`/farmer/listing/new`)
- Step 1: Crop (searchable dropdown with common crop icons)
- Step 2: Quantity (kg, numeric stepper) + Harvest date (date picker)
- Step 3: **AI Suggested Price panel** — big, clear: "₹X/kg suggested (based on [mandi name] rate today)" with [Accept] and [Set My Own Price] buttons.
- Step 4: Confirmation screen — "Your listing is live!" with a shareable link (for WhatsApp forwarding to known buyers).

### 3.5 Marketplace Browse (`/marketplace`)
- Search bar + filter chips: Crop type, Distance, Price range, Bulk-eligible.
- Card grid: crop photo/icon, price/kg, farmer/FPO name + village, distance, "AI Fair Price" badge if within 10% of Agmarknet rate.
- Map toggle: same listings pinned on a Leaflet/OSM map.

### 3.6 Listing Detail / Checkout (`/marketplace/:id`, `/checkout/:id`)
- Farmer profile mini-card (name, village, rating, total sales).
- Price breakdown: farmer price + platform fee (if any, ideally ₹0 or minimal for MVP) + delivery estimate = total.
- Quantity selector, delivery address confirm, "Pay (Test Mode)" button clearly labelled as test/demo.

### 3.7 Orders & Tracking (`/orders`, `/orders/:id`)
- Status stepper: Placed → Confirmed → Routed → Out for Delivery → Delivered.
- Map showing current route stop if `routed`/`out_for_delivery`.

### 3.8 Bulk Buyer Demand Post (`/bulk/demand/new`)
- Similar step form: crop, quantity, frequency (one-time/weekly/monthly), delivery address.
- After submit → matches screen: ranked list of nearby farmer listings, price + distance sortable.

### 3.9 Market Insights (`/insights`)
- Crop + region selector.
- Line chart: historical price (solid) + 7-day forecast (dashed), using free charting lib (Recharts/Chart.js).
- One-line AI summary banner above the chart.

### 3.10 Admin Dashboard (`/admin/dashboard`) — the "wow" screen for judges
- 4 stat cards across the top: Active Farmers/FPOs · Active Orders · ₹ Saved by Farmers (cumulative) · ₹ Saved by Consumers (cumulative).
- Bar chart: "Price at each stage" — Farm-gate price vs. Platform price vs. Traditional-mandi-to-retail price, side by side, for top 5 crops.
- Logistics tab: live map of optimized routes currently in progress, with distance-saved metric vs. naive routing.

### 3.11 Settings
- Language toggle (EN/HI), profile edit, logout.

## 4. Accessibility Checklist
- Minimum tap target 44×44px.
- Color contrast ratio ≥ 4.5:1 for all text.
- All icons paired with text labels (never icon-only navigation).
- All forms usable with on-screen numeric keypad (numeric `input type` for quantities/pincodes).
