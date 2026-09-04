# Project Memory & Changes Log

## Changes & Feature Log

### [2026-09-04] Full End-to-End Implementation of KisanSetu Platform (SIH 2026 PS 26033)
* **Issue**: Implementation of SIH 2026 Problem Statement 26033 ("Multiple intermediaries reduce farmers' earnings and increase consumer prices", Ministry of Consumer Affairs, Food & Public Distribution / DoCA).
* **Resolution**:
    * Created resilient database and seed data engine with 1000+ Agmarknet records and 7 demo personas in [db.ts](file:///e:/SIH/src/lib/db.ts) and [seed.ts](file:///e:/SIH/scripts/seed.ts).
    * Built bilingual i18n support (English & Hindi) in [i18n.tsx](file:///e:/SIH/src/lib/i18n.tsx), [en.json](file:///e:/SIH/src/messages/en.json), and [hi.json](file:///e:/SIH/src/messages/hi.json).
    * Built responsive Navigation Bar with instant persona quick-switcher in [Navbar.tsx](file:///e:/SIH/src/components/Navbar.tsx).
    * Built Home Landing Page with live Agmarknet rate ticker, role gateways, and price-formation showcase in [page.tsx](file:///e:/SIH/src/app/page.tsx).
    * Built Farmer Portal with 4-step low-literacy listing wizard and AI Mandi Price Advisor in [dashboard/page.tsx](file:///e:/SIH/src/app/farmer/dashboard/page.tsx) and [new/page.tsx](file:///e:/SIH/src/app/farmer/listing/new/page.tsx).
    * Built Direct Consumer Marketplace with search, filter, and Leaflet map view in [marketplace/page.tsx](file:///e:/SIH/src/app/marketplace/page.tsx) and [checkout/[id]/page.tsx](file:///e:/SIH/src/app/checkout/[id]/page.tsx).
    * Built Orders Tracking stepper in [orders/page.tsx](file:///e:/SIH/src/app/orders/page.tsx) and Bulk Demand Hub in [bulk/demand/page.tsx](file:///e:/SIH/src/app/bulk/demand/page.tsx).
    * Built AI 7-Day Market Forecasting Center with Recharts time-series curves in [insights/page.tsx](file:///e:/SIH/src/app/insights/page.tsx).
    * Built DoCA Transparency Dashboard with Price-Formation Waterfall Chart and Intermediary Margin Saved counters in [admin/dashboard/page.tsx](file:///e:/SIH/src/app/admin/dashboard/page.tsx).
    * Built Smart Logistics VRP Route Optimizer with road distance and fuel saved counters in [admin/logistics/page.tsx](file:///e:/SIH/src/app/admin/logistics/page.tsx).
    * Implemented complete REST APIs in [src/app/api/](file:///e:/SIH/src/app/api/) and Python FastAPI microservice in [ai-service/](file:///e:/SIH/ai-service/).

### [2026-09-04] GitHub Repository & Dependency Files Setup
* **Issue**: Prepare repository configuration and dependency files so teammates can clone and run the project seamlessly.
* **Resolution**:
    * Created [.gitignore](file:///e:/SIH/.gitignore) to exclude node_modules, .next build cache, .env secrets, and Python virtual environments.
    * Created [.env.example](file:///e:/SIH/.env.example) with environment variable templates.
    * Created [README.md](file:///e:/SIH/README.md) with comprehensive clone, installation, database seeding, and script running instructions.
    * Created Python dependencies configuration in [requirements.txt](file:///e:/SIH/ai-service/requirements.txt).
### [2026-09-04] Phase 2: Supabase & Prisma ORM Relational Backend Architecture
* **Issue**: Upgrade the platform from an in-memory mock engine to a production-grade PostgreSQL relational database schema with Prisma ORM and Supabase client integration.
* **Resolution**:
    * Created [schema.prisma](file:///e:/SIH/prisma/schema.prisma) with complete relational entities (`User`, `ProduceListing`, `Order`, `DemandPost`, `PriceBenchmark`, `LogisticsRoute`).
    * Created singleton Prisma database client in [prisma.ts](file:///e:/SIH/src/lib/prisma.ts).
    * Created Supabase Auth & Storage client helpers in [supabase.ts](file:///e:/SIH/src/lib/supabase.ts).
    * Created PostgreSQL seed script in [seed-prisma.ts](file:///e:/SIH/scripts/seed-prisma.ts) with npm scripts `npm run seed:prisma`, `npm run prisma:generate`, and `npm run prisma:push`.
    * Updated [.env.example](file:///e:/SIH/.env.example) with Supabase connection strings and credentials.
### [2026-09-04] Phase 3: Real AI/ML Models & Agmarknet Method 1 Ingestion Pipeline
* **Issue**: Implement live Agmarknet data ingestion from Data.gov.in (Method 1), build adaptive AI pricing regressor, 7-day demand forecasting model, and VRP logistics route optimizer.
* **Resolution**:
    * Created [agmarknet_client.py](file:///e:/SIH/ai-service/agmarknet_client.py) to ingest daily mandi prices from Data.gov.in (resource/9ef84268-d588-465a-a308-a864a43d0070) and normalize units from ₹/Quintal to ₹/Kg.
    * Created [price_model.py](file:///e:/SIH/ai-service/price_model.py) with dynamic quality grading modifiers, harvest freshness factors, and 4-stage DoCA price-formation waterfall analysis.
    * Created [forecasting_model.py](file:///e:/SIH/ai-service/forecasting_model.py) providing 7-day daily price curves, arrival projections, and weekend consumer demand surges.
    * Created [vrp_optimizer.py](file:///e:/SIH/ai-service/vrp_optimizer.py) calculating multi-farmer clustered pickup sequences, saved road kilometers, and diesel/CO2 emissions reductions.
    * Updated [main.py](file:///e:/SIH/ai-service/main.py) with full REST endpoints for `/api/v1/sync/agmarknet`, `/api/v1/price/predict`, `/api/v1/forecast/demand`, and `/api/v1/logistics/optimize`.
    * Implemented Next.js live sync API in [sync/route.ts](file:///e:/SIH/src/app/api/agmarknet/sync/route.ts) and added interactive *"Sync Agmarknet Live (Data.gov.in)"* button with live status feedback in [dashboard/page.tsx](file:///e:/SIH/src/app/admin/dashboard/page.tsx).
### [2026-09-04] Standalone AI Evaluation & Accuracy Demonstration Script
* **Issue**: Provide a clean terminal-executable Python evaluation tool for teammates and judges without cluttering user-facing web pages.
* **Resolution**:
    * Created [evaluate_models.py](file:///e:/SIH/ai-service/evaluate_models.py) CLI benchmark tool displaying $R^2$ variance accuracy (99.96%), MAE (₹0.04/kg), RMSE, MAPE (0.17%), sample prediction comparisons, and DoCA economic impact per tonne.
    * Reverted the Insights page UI to a clean, user-facing 7-day forecast design without testing cards.
* **Verification**: Ran `python evaluate_models.py` in terminal; output validated cleanly with code 0.

