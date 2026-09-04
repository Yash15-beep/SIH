# 🌱 KisanSetu (किसानसेतु)
> **SIH 2026 Problem Statement 26033**: *"Multiple intermediaries reduce farmers' earnings and increase consumer prices"*  
> **Ministry**: Department of Consumer Affairs (DoCA), Ministry of Consumer Affairs, Food & Public Distribution

---

## 🌟 Overview
**KisanSetu** is a direct farm-to-fork digital marketplace, logistics engine, and AI pricing layer designed to eliminate redundant middleman markup.

- **Direct Farmer Listing & AI Mandi Advisor**: Cites real-time **Agmarknet (data.gov.in)** mandi data to prevent distress selling.
- **Consumer & Bulk Marketplace**: Transparent cost breakdown (Base price + direct rural logistics).
- **AI 7-Day Demand Forecasting**: Time-series statistical models projecting commodity price trajectories and arrival trends.
- **Smart Logistics VRP Route Optimizer**: Batches multi-stop farm pickups and urban drops, saving ~24% road transit km.
- **DoCA Transparency Dashboard**: Real-time price-formation waterfall charts proving margin recovery.
- **100% Zero-Cost Architecture**: Operates entirely on free-tier, open-source infrastructure with offline demo resiliency.

---

## 🚀 Quickstart for Teammates (Cloning & Running Locally)

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js**: `v18.17.0` or higher (`v20+` recommended)
- **npm**: `v9.0.0` or higher
- **Python**: `3.10+` (optional, for running the FastAPI microservice locally)
- **Git**

---

### 2. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/KisanSetu.git
cd KisanSetu
```

---

### 3. Install Dependencies
```bash
npm install
```

---

### 4. Setup Environment Variables
Create a local `.env.local` file from the provided template:
```bash
cp .env.example .env.local
```
*(On Windows PowerShell: `Copy-Item .env.example .env.local`)*

---

### 5. Seed the Database
Populate demo users (Ramesh/Farmer, Priya/Consumer, Sanjay/Bulk Buyer, DoCA Admin), active produce listings, and 1,000+ Agmarknet records:
```bash
npm run seed
```

---

### 6. Start the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🐍 (Optional) Running the Python AI Microservice

The Next.js application includes built-in fallback algorithms so it runs 100% standalone. If you wish to run the standalone Python FastAPI service:

```bash
cd ai-service

# Create and activate virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Start FastAPI server on port 8000
python main.py
```
FastAPI documentation will be available at **[http://localhost:8000/docs](http://localhost:8000/docs)**.

### Fresh Vision produce-quality scan

The included `Fresh-Vision/` directory contains the trained freshness and
produce-identification models. With the AI service running, farmers can upload
a JPG, PNG, or WebP photo in the listing wizard. The scan rejects non-produce
photos, detects one of 14 supported crops, and maps calibrated freshness to
Grade A/B/C with a shelf-life estimate. Set `FRESH_VISION_MODEL_DIR` only when
the model folder is located outside the project root.

---

## 📂 Project Structure

```
SIH/
├── src/
│   ├── app/                     # Next.js App Router pages and API routes
│   │   ├── page.tsx             # Hero Landing Page with live Mandi Ticker
│   │   ├── farmer/              # Farmer Dashboard & AI Listing Wizard
│   │   ├── marketplace/         # Direct Marketplace (Grid & Map views)
│   │   ├── checkout/            # Transparent Checkout & Razorpay Test Mode
│   │   ├── orders/              # Multi-Stop Order Tracking Stepper
│   │   ├── bulk/                # B2B Bulk Demand Matching Hub
│   │   ├── insights/            # AI 7-Day Demand Forecasting (Recharts)
│   │   ├── admin/dashboard/     # DoCA Margin Saved & Transparency Portal
│   │   ├── admin/logistics/     # VRP Smart Logistics Route Optimizer
│   │   └── api/                 # REST API Endpoints
│   ├── components/              # Navbar, Footer, UI components
│   ├── data/                    # Agmarknet historical seed dataset & DB store
│   ├── lib/                     # Database engine (db.ts), i18n, and auth context
│   ├── messages/                # Bilingual dictionaries (en.json, hi.json)
│   └── types/                   # TypeScript interfaces (User, Listing, Order, Route)
├── ai-service/                  # Python FastAPI AI Microservice
│   ├── main.py                  # API endpoints
│   ├── forecasting.py           # Time-series trend and demand forecaster
│   ├── route_optimizer.py       # VRP road network heuristic optimizer
│   └── requirements.txt         # Python dependencies
├── scripts/
│   └── seed.ts                  # Database seeder script (npm run seed)
├── package.json                 # Node.js dependencies & scripts
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.ts           # Tailwind CSS configuration & design tokens
├── .env.example                 # Environment variables template
└── .gitignore                   # Git ignore rules
```

---

## 🛠️ Available npm Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Next.js local development server on `http://localhost:3000` |
| `npm run build` | Builds the production bundle and type-checks all routes |
| `npm run start` | Runs the optimized production build |
| `npm run seed` | Resets and populates the database with realistic Agmarknet & persona data |
| `npm run lint` | Runs ESLint checks |

---

## 👥 Demo Personas (For Jury Evaluation)
The navigation bar includes a **Demo Quick Persona Switcher** to jump across roles in 1 click:
1. **🌾 Ramesh Kumar** (`Farmer`, Rewari) — List produce, view AI price suggestions, inspect ₹10k+ extra earnings vs mandi.
2. **🛒 Priya Sharma** (`Consumer`, Gurugram) — Discover fresh farm produce, view AI Fair badges, test checkout.
3. **🏨 Sanjay Mehra** (`Bulk Buyer`, Hotel Chain) — Post recurring volume demands, view ranked farmer matches.
4. **🏛️ DoCA Admin / Jury Evaluator** — View the Price Formation Waterfall chart and Margin Recovered metrics.

---

## 📄 License & Attribution
Developed for **Smart India Hackathon 2026**. Open-source under the MIT License.
