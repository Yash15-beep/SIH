# 01 — Product Requirements Document (PRD)

**Product:** KisanSetu
**PS ID:** 26033 | SIH 2026
**Owner:** Yash's team | **Status:** Hackathon build — v1.0

---

## 1. Vision Statement
KisanSetu is a free-to-operate digital marketplace that connects farmers and FPOs directly with consumers and bulk buyers, using AI to forecast demand and optimize logistics — so farmers earn more, consumers pay less, and the government gets visibility into supply-chain efficiency.

## 2. Goals & Non-Goals

### Goals (MVP — must be true by demo time)
- G1: Farmers/FPOs can register and list produce (crop, quantity, price, location) in under 2 minutes.
- G2: Consumers and bulk buyers can search/browse produce, see an AI-suggested fair price, and place an order.
- G3: System shows an AI demand forecast per commodity per region (next 7 days).
- G4: System computes an optimized delivery route for a batch of pending orders.
- G5: Admin/DoCA dashboard shows farmer-price vs consumer-price vs mandi-price comparison ("margin saved").
- G6: Entire stack runs on free tiers (no card required, no paid API keys).

### Non-Goals (explicitly out of scope for MVP — do NOT build these, log as Phase 2)
- Real payment settlement / escrow / GST invoicing automation.
- Full KYC / Aadhaar verification of farmers.
- Cold-chain / IoT temperature tracking.
- Native mobile apps (MVP is a responsive web app — installable as PWA).
- Multi-state / multi-language beyond Hindi + English.
- Dispute resolution / returns workflow (show a "Report Issue" button that just logs a ticket — no automated resolution).

## 3. User Roles

| Role | Description |
|---|---|
| **Farmer / FPO** | Lists produce, sees AI price suggestion, manages orders, sees earnings dashboard |
| **Consumer** | Individual household buyer, browses/searches, orders small quantities |
| **Bulk Buyer** | Hotels, caterers, retailers, processors — orders large quantities, may set recurring demand |
| **Admin (DoCA-style)** | Government/hackathon-jury view — sees platform-wide analytics, price comparison, no transactional actions |
| **Logistics Partner** (Phase 2, stubbed in MVP as "self-pickup / platform-arranged") | Executes optimized delivery routes |

## 4. Feature List (MVP, mapped to PS requirements)

| # | Feature | Maps to PS requirement | Priority |
|---|---|---|---|
| F1 | Farmer/FPO registration + produce listing | "Connects farmers/FPOs directly with consumers and bulk buyers" | P0 |
| F2 | Marketplace browse/search/filter (by crop, location, price, quantity) | same | P0 |
| F3 | AI-suggested fair price at listing time (from Agmarknet mandi data) | "Better prices for farmers / lower prices for consumers" | P0 |
| F4 | Order placement + order status tracking | "digital marketplace" | P0 |
| F5 | AI demand forecast (7-day, per crop per region) | "AI for demand forecasting" | P0 |
| F6 | AI route optimization for a batch of orders | "AI for route optimization" | P0 |
| F7 | Logistics support screen (assigned route, pickup/drop points, ETA) | "Provides logistics support" | P0 |
| F8 | Farmer earnings dashboard (this order vs. average mandi price) | "Better prices for farmers" | P0 |
| F9 | Admin/DoCA analytics dashboard (margin-saved, adoption stats) | "Reduced supply chain inefficiencies" | P0 |
| F10 | Bulk buyer recurring-demand posting ("I need 200kg onions every Monday") | "consumers and bulk buyers" | P1 |
| F11 | Bilingual UI (English/Hindi) | accessibility for farmers | P1 |
| F12 | Ratings/reviews on completed orders | trust-building | P2 |
| F13 | Push notifications (order placed/confirmed/out for delivery) | UX | P2 |

## 5. User Stories (Given/When/Then — ready to hand to Antigravity as acceptance criteria)

**US-1 (Farmer lists produce)**
Given I am a logged-in Farmer/FPO,
When I fill in crop name, quantity (kg), harvest date, and my village/pincode,
Then the system shows me an AI-suggested price range (based on the last 7–30 days of Agmarknet mandi data for that crop in my region), and I can accept it or set my own price, and my listing appears live in the marketplace within 5 seconds.

**US-2 (Consumer orders)**
Given I am a logged-in Consumer,
When I search "tomato" and select a listing within my delivery radius,
Then I can see farmer name/FPO, price/kg, distance, estimated delivery date, and place an order by entering quantity and confirming (test-mode payment).

**US-3 (Bulk buyer posts recurring demand)**
Given I am a logged-in Bulk Buyer,
When I create a demand post (crop, quantity, frequency, delivery address),
Then matching farmer listings within range are notified, and I can see all farmers who responded, ranked by price and distance.

**US-4 (AI demand forecast)**
Given I am any logged-in user,
When I open the "Market Insights" tab and select a crop + region,
Then I see a 7-day forecast chart of expected demand/price trend, generated from historical Agmarknet data, with a plain-language one-line summary (e.g., "Tomato demand in Rewari is expected to rise 12% this week").

**US-5 (Route optimization)**
Given there are ≥2 confirmed orders for pickup/delivery in a region,
When the Admin or Logistics view triggers "Optimize Route,"
Then the system returns an ordered stop sequence and total distance/time, visualized on a free OpenStreetMap-based map.

**US-6 (Admin transparency dashboard)**
Given I am logged in as Admin,
When I open the dashboard,
Then I see: total farmer earnings via platform vs. estimated traditional-mandi earnings for the same volume (₹ saved), total consumer spend vs. estimated retail-market spend (₹ saved), number of active farmers/FPOs, number of orders, average intermediary layers bypassed.

## 6. Success Metrics (how the jury / a real pilot would measure impact)

| Metric | Target for demo | Real-world target (post-pilot) |
|---|---|---|
| Farmer price uplift vs. mandi average | Show ≥15% (from seeded/demo data) | 15–25% |
| Consumer price reduction vs. retail average | Show ≥10% | 10–20% |
| Time to list produce | < 2 min | < 2 min |
| Route optimization distance saved vs. naive sequential route | ≥ 15% | 15–30% |
| Forecast directional accuracy | Demonstrable trend line, MAPE reported | MAPE < 20% |

## 7. Release Plan

| Phase | Scope | Timing |
|---|---|---|
| Phase 0 — Hackathon MVP | F1–F9 (P0 only), demo/seed data, single region | SIH D-Day |
| Phase 1 — Pilot | Add F10–F13, real district rollout, real farmer onboarding, WhatsApp bot for low-literacy farmers | Post-SIH, 1–3 months |
| Phase 2 — Scale | Payments/escrow, KYC, multi-state, cold-chain partners, native app | 3–12 months |

## 8. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Agmarknet API down/rate-limited during demo | Ship a cached/static snapshot CSV as fallback data source, switch via env flag |
| Free-tier hosting cold-starts / sleeps | Pre-warm servers 10 min before demo; keep frontend on Vercel (no cold start) |
| Farmers have low smartphone/data literacy | Bilingual UI, large touch targets, minimal text-entry (dropdowns over free text), Phase-1 WhatsApp bot |
| Jury asks "how is this different from eNAM / Agri-market apps" | Differentiator doc prepared — see `08_pitch_and_antigravity_prompt.md` §"Differentiation" |
