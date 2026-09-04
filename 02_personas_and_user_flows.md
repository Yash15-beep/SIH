# 02 — User Personas & User Flows

## 1. Personas

### Persona A — Ramesh (Farmer)
- 42, grows tomatoes & onions on 3 acres near Rewari, Haryana.
- Owns a basic Android phone, uses WhatsApp daily, moderate Hindi literacy, low English.
- Pain: sells to village trader at whatever price offered, no idea what mandi rate actually is that day.
- Goal: sell at a fair, transparent price without traveling to the mandi.

### Persona B — Priya (Urban Consumer)
- 29, works in Gurugram, orders groceries online, price- and freshness-conscious.
- Pain: pays high prices for produce that "isn't even that fresh," no idea where it came from.
- Goal: buy fresh produce directly from a farmer at a fair price, with reasonable delivery time.

### Persona C — Sanjay (Bulk Buyer / Hotel Procurement Manager)
- 35, manages purchasing for a mid-size hotel chain in Delhi NCR.
- Pain: deals with 3–4 unreliable wholesale vendors, inconsistent quality/pricing, no visibility into supply.
- Goal: source produce in bulk directly and predictably, with reliable weekly quantities.

### Persona D — DoCA Admin / Hackathon Jury
- Government official / evaluator.
- Pain: no data-driven visibility into how many markup layers exist and how much value leaks out.
- Goal: see a live dashboard proving the platform reduces intermediary markup, at a glance.

## 2. Core User Flows

### Flow 1 — Farmer Onboarding & Listing (Ramesh)
```mermaid
flowchart TD
    A[Open app] --> B{Have account?}
    B -- No --> C[Register: Name, Phone/OTP, Village, Pincode, Role=Farmer/FPO]
    B -- Yes --> D[Login via OTP]
    C --> D
    D --> E[Dashboard: 'List New Produce' button]
    E --> F[Select crop from dropdown]
    F --> G[Enter quantity kg + harvest date]
    G --> H[System fetches Agmarknet price for crop+region]
    H --> I[Show AI-suggested price range]
    I --> J{Accept suggested price or set own?}
    J -- Accept --> K[Listing published]
    J -- Set own --> L[Enter custom price] --> K
    K --> M[Listing visible in marketplace]
```

### Flow 2 — Consumer Discovery & Order (Priya)
```mermaid
flowchart TD
    A[Open marketplace] --> B[Search/filter: crop, distance, price]
    B --> C[View listing: farmer/FPO, price, distance, harvest date]
    C --> D[Enter quantity needed]
    D --> E[Confirm delivery address]
    E --> F[Review order summary incl. platform fee if any]
    F --> G[Test-mode payment / mock checkout]
    G --> H[Order confirmed, tracking screen shown]
    H --> I[Notification: order status updates]
```

### Flow 3 — Bulk Buyer Recurring Demand (Sanjay)
```mermaid
flowchart TD
    A[Login as Bulk Buyer] --> B[Post Demand: crop, qty, frequency, address]
    B --> C[System matches nearby farmer/FPO listings]
    C --> D[Buyer sees ranked list: price, distance, FPO rating]
    D --> E[Buyer selects one or more sources]
    E --> F[Order/subscription created]
    F --> G[Recurring orders auto-generated per frequency]
```

### Flow 4 — AI Demand Forecast (any user)
```mermaid
flowchart TD
    A[Open 'Market Insights' tab] --> B[Select crop + region]
    B --> C[Backend pulls historical Agmarknet arrivals+price]
    C --> D[Forecast model runs 7-day projection]
    D --> E[Chart + plain-language summary rendered]
```

### Flow 5 — Route Optimization (Admin / Logistics)
```mermaid
flowchart TD
    A[Admin opens Logistics tab] --> B[System lists confirmed, unrouted orders]
    B --> C[Admin selects orders/region + clicks 'Optimize Route']
    C --> D[Backend geocodes pickup/drop points]
    D --> E[VRP/nearest-neighbor solver over OSRM road network]
    E --> F[Ordered stop list + map polyline returned]
    F --> G[Route shown on Leaflet/OSM map with ETA per stop]
```

### Flow 6 — Admin Transparency Dashboard (DoCA / Jury)
```mermaid
flowchart TD
    A[Admin login] --> B[Dashboard loads]
    B --> C[Card: Avg farmer price via platform vs mandi]
    B --> D[Card: Avg consumer price via platform vs retail]
    B --> E[Card: Total Rs saved farmer-side + consumer-side]
    B --> F[Card: Active farmers/FPOs, orders, regions]
    B --> G[Chart: intermediary layers bypassed per transaction]
```

## 3. End-to-End Sitemap (screen inventory — used directly in `06_ui_ux_spec.md`)

```
/ (landing / role selection)
/login  /register
/farmer/dashboard
/farmer/listing/new
/farmer/listing/:id
/farmer/earnings
/marketplace  (consumer + bulk buyer browse)
/marketplace/:listingId
/checkout/:listingId
/orders  /orders/:id
/bulk/demand/new
/bulk/demand/:id
/insights  (AI demand forecast)
/admin/dashboard
/admin/logistics
/settings (language, profile)
```
