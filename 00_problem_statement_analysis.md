# 00 — Problem Statement Analysis (SIH 2026, PS ID 26033)

## 1. Official Problem Statement (verbatim from SIH 2026 portal)

| Field | Value |
|---|---|
| PS ID | 26033 |
| Title | Multiple intermediaries reduce farmers' earnings and increase consumer prices |
| Organization | Ministry of Consumer Affairs, Food & Public Distribution |
| Department | Department of Consumer Affairs (DoCA) |
| Category | Software |

**Expected Solution (as stated by the ministry):**
Create a digital marketplace that:
- Connects farmers/FPOs directly with consumers and bulk buyers.
- Provides logistics support.
- Uses AI for demand forecasting and route optimization.

**Stated Benefits:**
- Better prices for farmers.
- Lower prices for consumers.
- Reduced supply chain inefficiencies.

> Note: The official PS text is intentionally short (no long "Background" section like other PS IDs this year). Everything below this point is our team's interpretation, filled in explicitly so no team member has to guess. Where we made a judgment call, it is logged in Section 5 ("Assumptions Log") so it can be defended to a jury or changed later with a single edit.

## 2. Root Cause Breakdown (why the problem exists)

1. **Fragmented first-mile**: Farmers are geographically dispersed, produce small individual lots, and have no way to reach buyers directly — they are forced to sell to the nearest commission agent/mandi trader.
2. **Information asymmetry**: Farmers don't know real-time prices in nearby mandis or what bulk buyers are willing to pay, so they under-negotiate.
3. **No aggregation mechanism**: A single farmer's produce is too small for a bulk buyer/retail chain to deal with directly — intermediaries exist partly because they perform real aggregation and logistics work (this is important: **we are not removing all middlemen, we are removing the unnecessary/rent-seeking layers** and digitizing the aggregation + logistics function itself).
5. **No cold chain/logistics visibility**: Farmers can't arrange transport to a distant buyer themselves, so they default to the local mandi.
6. **Multiple markup layers**: Produce commonly passes through Farmer → Village trader → Mandi commission agent (arhtiya) → Wholesaler → Retailer → Consumer, each adding 10–30% margin, resulting in consumer prices 2–3x the farm-gate price for the same commodity.

## 3. Who Loses and Who Gains Today

| Stakeholder | Current Pain |
|---|---|
| Farmer / FPO | Gets 30-50% of final consumer price; no price transparency; forced distress selling; no direct buyer access |
| Consumer / Household | Pays inflated price; no visibility into where produce came from |
| Bulk Buyer (hotels, caterers, retail chains, processors) | Deals with unreliable, non-standardized supply; no direct sourcing channel from FPOs |
| Government (DoCA) | No visibility/dashboard into supply-chain price-formation and margin leakage across mandis |
| Genuine logistics/aggregation intermediaries | Currently informal, undercapitalized, no digital tools — our platform should let *this* layer plug in formally rather than be eliminated |

## 4. Our Solution in One Line

**KisanSetu** — a digital marketplace + logistics + AI pricing layer that lets FPOs/farmers list produce, lets consumers and bulk buyers order directly, uses AI to forecast demand and optimize delivery routes, and gives DoCA a live dashboard of price-formation across the chain — built entirely on free-tier / open-source infrastructure so it can run at zero cost through the hackathon and pilot phase.

(See `01_prd.md` for full scope; `08_pitch_and_antigravity_prompt.md` for the one-paragraph pitch.)

## 5. Assumptions Log (explicit — challenge/change any of these before build starts)

| # | Assumption | Why we made it | Impact if wrong |
|---|---|---|---|
| A1 | App name = "KisanSetu" (placeholder, team can rebrand) | PS gives no name | Cosmetic only — find/replace |
| A2 | MVP covers 3 user roles: Farmer/FPO, Buyer (Consumer + Bulk), Admin/DoCA | PS explicitly mentions farmers, consumers, bulk buyers | Adding a 4th role (e.g. delivery partner) is Phase 2, documented in PRD |
| A3 | Geographic pilot scope = 1 state / a cluster of districts (we'll say Haryana NCR belt, since team is Delhi-NCR based) for demo data | Needed for a bounded demo, not stated in PS | Change district names only |
| A4 | Price data source = **Agmarknet (data.gov.in)** — official, free, real-time mandi price API from Ministry of Agriculture | It's the only free, authoritative, real-time Indian mandi price dataset | If unavailable at demo time, fallback to a static CSV shipped in-repo |
| A5 | "AI demand forecasting" = time-series model (moving average / linear regression / Prophet) on historical Agmarknet arrival + price data, not a huge LLM | Keeps it free, explainable, buildable in a hackathon, and directly answers the PS ask | Can be upgraded post-hackathon |
| A6 | "AI route optimization" = a Vehicle Routing Problem (VRP) heuristic (nearest-neighbor / OR-Tools) over free OpenStreetMap + OSRM road-network data | Google Maps/Routes API isn't free at scale; OSRM demo server is free for hackathon use | If OSRM public server is down at demo, fallback to Haversine-distance-based simple optimizer (already in scope) |
| A7 | Payments = Razorpay **Test Mode** (free, no real money moves) for the demo; production payment gateway integration is Phase 2 | PS doesn't require real payments; hackathon judges accept test/mock payment flows | None — clearly labelled "Test Mode" in UI |
| A8 | Notifications = Firebase Cloud Messaging (push, free) + in-app, NOT paid SMS | Real SMS (Twilio etc.) costs money past trial credits | If team wants real SMS for demo impact, use Twilio's free trial credits only for a few demo numbers |
| A9 | Languages = English + Hindi at MVP (via i18n JSON files) | Farmers' primary language; keeps scope bounded | More languages = add JSON files, no architecture change |
| A10 | "FPO" = Farmer Producer Organisation — a registered collective that can list on behalf of many farmers; individual farmers can also self-register | Standard Indian agri-tech term, PS explicitly says "farmers/FPOs" | — |

## 6. What "Done" Looks Like for the Hackathon Demo

A judge should be able to see, live:
1. A farmer/FPO listing 50kg of tomatoes with an AI-suggested price (derived from live/near-live Agmarknet data).
2. A consumer and a bulk buyer (e.g., a hotel) both discovering and ordering that produce on the same marketplace.
3. The system computing an optimized delivery route across 2–3 pending orders.
4. A DoCA-style admin dashboard showing: average farmer price vs. average consumer price vs. traditional-mandi price for the same commodity, i.e., the **margin saved** — this is the single most important screen because it directly proves the PS's success metric.
