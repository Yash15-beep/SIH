# 07 — Non-Functional Requirements & DevOps Plan

## 1. Non-Functional Requirements (NFRs)

| Category | Requirement |
|---|---|
| Performance | Marketplace listing search returns results in < 1s for demo dataset (< 500 rows); forecast/route AI calls return in < 3s |
| Availability | Demo environment must be pre-warmed and stable for a 5–10 min live judging window; no requirement for 24/7 uptime at MVP stage |
| Scalability (design intent, not built for MVP) | Postgres schema and API are stateless/horizontally-scalable-ready; AI microservice separated so it can be swapped for a heavier model later without touching the core app |
| Security | Passwordless OTP auth; Supabase Row-Level Security enforced on every table; HTTPS everywhere (Vercel/Render provide this by default); no card numbers ever touch our servers (Razorpay handles that in test mode) |
| Data Privacy | Farmer phone numbers and location data are the most sensitive fields — never exposed to other users beyond first name + village; full phone number visible only to the transacting counterpart after order confirmation |
| Accessibility | Bilingual (EN/HI), WCAG-AA color contrast, large touch targets (see `06_ui_ux_spec.md` §4) |
| Cost | $0 to run through hackathon + pilot phase (see stack table in `03_technical_architecture.md`) |
| Offline tolerance | Farmer-facing screens degrade gracefully with a "you're offline, showing last cached prices" banner rather than a blank error screen |
| Observability | Basic logging via Vercel/Render built-in logs (free); no paid APM needed at MVP stage |

## 2. Environments

| Env | Purpose | Hosting |
|---|---|---|
| `local` | Development on team laptops | Docker Compose (optional) or plain `npm run dev` + local Supabase CLI |
| `staging/demo` | The environment judges will actually see | Vercel (frontend) + Render (AI service) + Supabase project (free tier) |
| `production` | Post-hackathon pilot (Phase 1) | Same stack, upgrade Supabase/Render tier only if free-tier limits are hit |

## 3. CI/CD (kept minimal for hackathon timeline)
- GitHub repo, `main` branch auto-deploys to Vercel (built-in Vercel-GitHub integration, zero config).
- AI microservice: Render's "auto-deploy on push" from its own subfolder or repo.
- No formal test suite required for MVP, but a lightweight smoke test script (curl a few key endpoints) is recommended before the demo.

## 4. Environment Variables (documented so Antigravity/any teammate can set these up without guessing)

```
# Frontend (.env.local)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_AI_SERVICE_URL=
NEXT_PUBLIC_RAZORPAY_KEY_ID=   # test mode key
NEXT_PUBLIC_MAP_TILE_URL=https://tile.openstreetmap.org/{z}/{x}/{y}.png

# Backend / API routes
SUPABASE_SERVICE_ROLE_KEY=
RAZORPAY_KEY_SECRET=           # test mode secret
AGMARKNET_API_KEY=             # free registration at data.gov.in
USE_LIVE_AGMARKNET=false       # true only when confirmed working pre-demo

# AI microservice (FastAPI)
OSRM_BASE_URL=https://router.project-osrm.org
NOMINATIM_BASE_URL=https://nominatim.openstreetmap.org
FORECAST_MODEL=moving_average  # or 'prophet'
```

## 5. Demo-Day Runbook (so no one has to improvise)
1. T-30 min: ping Render AI service URL once to wake it from sleep.
2. T-20 min: run DB seed script (`npm run seed`) to reset demo data to known-good state.
3. T-15 min: verify `USE_LIVE_AGMARKNET` — set `true` only if a manual API test call succeeds; otherwise leave `false` (cached data).
4. T-10 min: walk through the exact demo script (see `08_pitch_and_antigravity_prompt.md` §"Live Demo Script") once, end to end.
5. During judging: if any live network call fails, the app must still work end-to-end on cached/seed data — this is why `USE_LIVE_AGMARKNET` and OSRM-fallback-to-Haversine exist.

## 6. Data Sourcing Details

| Data need | Free source | Notes |
|---|---|---|
| Mandi commodity prices | **Agmarknet** — `https://agmarknet.gov.in` / data.gov.in API | Free registration for API key at data.gov.in; daily modal/min/max price + arrivals by commodity/state/market |
| Road distances/routing | **OSRM public demo server** | Free, no key, rate-limited — fine for hackathon volume; self-host OSRM later if scaling |
| Geocoding (address → lat/lng) | **Nominatim (OpenStreetMap)** | Free, respect 1 req/sec usage policy; cache results in DB |
| Map tiles | **OpenStreetMap tile server** | Free for low-volume/non-commercial use; consider a free tier of MapTiler/Stadia Maps if styling needed later |
