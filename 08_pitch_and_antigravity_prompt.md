# 08 — Pitch, Differentiation & Master Prompt for Antigravity

## 1. One-Paragraph Pitch
KisanSetu is a free-to-run digital marketplace built for SIH PS 26033. It removes unnecessary middlemen — not the useful ones — by letting farmers and FPOs list produce directly to consumers and bulk buyers, showing an AI-suggested fair price pulled from live government mandi data (Agmarknet), forecasting 7-day demand so farmers know what to grow/sell and when, and optimizing multi-stop delivery routes so logistics stays efficient even without a middleman aggregating loads. A live dashboard shows exactly how many rupees are saved on both sides of the transaction — turning the PS's abstract goal ("reduce intermediaries") into a number DoCA can point to.

## 2. Differentiation (have this ready — jury will ask "how is this different from eNAM / existing agri apps?")

| Existing solution | Gap | How KisanSetu is different |
|---|---|---|
| **eNAM** | Connects mandis to each other (B2B, trader-to-trader); still routes through mandi/commission-agent structure | KisanSetu goes farmer → end-buyer directly, bypassing the mandi transaction itself for the produce it lists |
| **Traditional agri-marketplaces (e.g. DeHaat, Ninjacart)** | Often still act as a new intermediary/aggregator layer themselves; not free/open | KisanSetu is a lean, government-aligned, free-stack platform designed to plug into Agmarknet's own price data for transparency, not to replace it |
| **Local WhatsApp groups / informal direct-sale** | No price transparency, no logistics support, no scale | KisanSetu adds AI price-fairness, route optimization, and a government-facing transparency dashboard |

## 3. Live Demo Script (5–7 minutes, rehearse this exact sequence)
1. **Landing page** → show role selection, switch language toggle EN→HI once to prove bilingual support (10s).
2. **Farmer flow**: log in as Ramesh → "List New Produce" → select Tomato, 50kg → AI-suggested price appears with mandi-source citation → accept → listing goes live (60s).
3. **Consumer flow**: switch to Priya → search "tomato" → see Ramesh's listing with distance + AI Fair Price badge → order 5kg → test-mode checkout → order confirmed (60s).
4. **Bulk buyer flow**: switch to Sanjay → post recurring demand for 200kg onions/week → see ranked farmer matches (45s).
5. **AI Insights**: open Market Insights → show 7-day tomato demand forecast chart + plain-language summary (30s).
6. **Route optimization**: as Admin, select 3 pending orders → "Optimize Route" → show map with optimized stop order and % distance saved vs naive routing (45s).
7. **Admin dashboard — the closing shot**: show ₹ saved by farmers, ₹ saved by consumers, active farmers/orders count, price-comparison bar chart. End on this screen — it's the direct answer to the PS. (60s)
8. Close with the one-paragraph pitch (Section 1 above) restated in your own words.

## 4. Master Prompt — Paste This Into Antigravity To Start The Build

> Copy everything in the fenced block below as your first message to Antigravity. It references all the documents in this folder so Antigravity has full context and doesn't need to guess anything.

```
You are building "KisanSetu" — a digital marketplace for SIH 2026 Problem Statement 26033
("Multiple intermediaries reduce farmers' earnings and increase consumer prices", Ministry of
Consumer Affairs, Food & Public Distribution / DoCA).

I have attached/pasted the following planning documents — read them fully before writing any
code, and follow them exactly. Do not invent requirements that contradict these docs; if
something is genuinely ambiguous, make the most sensible choice and note it in a
DECISIONS.md file rather than asking me to clarify, unless it blocks you completely:

1. 00_problem_statement_analysis.md — the real problem, stakeholders, and an explicit
   assumptions log (Section 5) that you should treat as settled decisions, not open questions.
2. 01_prd.md — full scope: goals, non-goals, MVP feature list (F1–F9 are P0/must-build,
   F10–F13 are P1/P2, build only if time remains), and Given/When/Then acceptance criteria
   for every user story (US-1 through US-6). Build to satisfy every acceptance criterion.
3. 02_personas_and_user_flows.md — the exact screen flows (as Mermaid flowcharts) and the
   full sitemap. Build these routes/screens exactly as listed in the sitemap.
4. 03_technical_architecture.md — the required tech stack (Next.js + TypeScript + Tailwind
   frontend, Next.js API routes or Node backend, Python FastAPI AI microservice, Supabase
   Postgres+Auth+Storage, OpenStreetMap/Leaflet/OSRM/Nominatim for maps/routing/geocoding,
   Agmarknet for price data, Razorpay Test Mode for payments, Firebase Cloud Messaging for
   push notifications). EVERY component must run on a free tier — do not introduce any paid
   API or service.
5. 04_database_schema.md — the exact Postgres schema (SQL provided) and RLS policy notes.
   Use this schema as-is.
6. 05_api_specification.md — the exact REST API contract (routes, methods, request/response
   shapes). Implement every endpoint listed.
7. 06_ui_ux_spec.md — design principles, color palette, fonts (Noto Sans for Hindi support),
   and a screen-by-screen spec for every page in the sitemap.
8. 07_nonfunctional_and_devops.md — NFRs, environment variable list (use these exact names),
   and the deployment plan (Vercel for frontend, Render for AI microservice, Supabase for data).

Build order:
1. Scaffold the Next.js + TypeScript + Tailwind project, set up Supabase client and the schema
   from 04_database_schema.md (run the provided SQL).
2. Implement Auth (OTP via Supabase) and the registration/login flow per 06_ui_ux_spec.md §3.2.
3. Implement Farmer listing flow (F1) end-to-end, including a stubbed AI price-suggestion
   endpoint that reads from a seeded `price_cache` table (real Agmarknet integration can come
   after the stub works).
4. Implement Marketplace browse/search + order/checkout flow (F2, F4) with Razorpay Test Mode.
5. Implement the FastAPI AI microservice: demand forecast endpoint (moving average model,
   F5) and route optimization endpoint (nearest-neighbor + OSRM distances, F6).
6. Implement the Admin dashboard (F9) — this is the most important screen for the demo; make
   sure the ₹-saved metrics are computed from real seeded data, not hardcoded numbers.
7. Write a `seed.ts`/`seed.sql` script that populates ~30-50 demo listings, 3 farmer accounts,
   3 consumer accounts, 1 bulk buyer, 1 admin — realistic Indian crop names, Haryana/Delhi-NCR
   villages/pincodes, and price data plausible for Agmarknet-style modal prices.
8. Add bilingual (EN/HI) support via next-intl or react-i18next as the last step, wrapping
   existing screens rather than redesigning them.

Constraints to always respect:
- Zero paid dependencies. If you're about to add a package/service that requires a credit
  card or has no free tier, stop and use the free alternative named in the docs instead.
- Keep the AI microservice swappable/replaceable — don't hardcode forecast logic inside the
  main Next.js app.
- Every screen must work in both English and Hindi.
- The app must degrade gracefully to cached/seeded data if Agmarknet or OSRM calls fail
  (see 07_nonfunctional_and_devops.md §6 "USE_LIVE_AGMARKNET" flag and Haversine fallback).

Start by scaffolding the repo and the database schema, then proceed through the build order
above, showing me the working app after each numbered step.
```

## 5. What To Attach Alongside The Prompt
When you open Antigravity, upload/paste all 9 files in this `docs/` folder (00 through 08) as
context/reference files in the same session before sending the master prompt above — that is
what makes the "no assumptions needed" guarantee actually hold.
