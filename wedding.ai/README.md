<div align="center">

# 👑 WeddingBudget.ai

### _The AI-Powered Wedding Budget Engine for India's Finest Destination Weddings_

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Vercel-black?style=for-the-badge)](https://weddingbudget-ai-hazel.vercel.app)
[![Backend API](https://img.shields.io/badge/🤖_AI_API-Hugging_Face-yellow?style=for-the-badge)](https://shrestha2007-weddingbudget-api.hf.space/ping)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Shrestha-Kumar/weddingbudget-ai)

# 🚨 **[LIVE DEMO AVAILABLE HERE](https://weddingbudget-ai-hazel.vercel.app/)** 🚨
### **Deployed Website URL: https://weddingbudget-ai-hazel.vercel.app/**

<br>

**WedTech IIT Innovation Challenge 2025 — Product 3 (P3)**  
_Issued by **Events by Athea**, a premium wedding planning firm managing 50+ destination weddings annually with budgets ranging from ₹50 Lakhs to ₹10 Crores._

---

</div>

## 📌 The Problem

India's luxury wedding industry operates inside a **budget black box**. Couples and coordinators rely on fragmented vendor quotes, verbal estimates, and spreadsheets that are outdated the moment they're created. A single Udaipur palace wedding can span **₹50 Lakhs to ₹10 Crores**, yet there exists no intelligent, data-driven platform to:

- Predict décor execution costs from **visual mood boards**
- Calculate **deterministic logistics** (fleet sizing, F&B per-head, artist fees)
- Track **real-time budget variance** against AI-generated forecasts
- Provide **shareable, versioned scenario comparisons** for client signoff

**WeddingBudget.ai solves this entirely.**

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                               │
│                                                                     │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  ┌───────────┐ │
│  │  Landing     │  │   Wizard     │  │  Dashboard │  │  Tracker  │ │
│  │  (Canvas     │  │  (Multi-Step │  │  (Budget   │  │  (Post-   │ │
│  │   Scrubber)  │  │   Planner)   │  │   Matrix)  │  │  Booking) │ │
│  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘  └─────┬─────┘ │
│         │                 │                │               │        │
│         └────────────┬────┴────────────────┴───────────────┘        │
│                      │                                              │
│              ┌───────▼────────┐     ┌──────────────────┐            │
│              │  Zustand Store │     │  localStorage    │            │
│              │  (Global State)│     │  (Persistent DB) │            │
│              └───────┬────────┘     └──────────────────┘            │
└──────────────────────┼──────────────────────────────────────────────┘
                       │ HTTPS
          ┌────────────▼─────────────┐
          │    Vercel Edge Network   │
          │    (Next.js 14 SSR/CSR)  │
          └────────────┬─────────────┘
                       │ REST API
          ┌────────────▼─────────────┐
          │  Hugging Face Spaces     │
          │  (Docker Container)      │
          │                          │
          │  ┌────────────────────┐  │
          │  │  FastAPI + Uvicorn │  │
          │  │  ┌──────────────┐  │  │
          │  │  │ ONNX Runtime │  │  │
          │  │  │ (CPU Infer.) │  │  │
          │  │  └──────────────┘  │  │
          │  │  ┌──────────────┐  │  │
          │  │  │ OpenCV       │  │  │
          │  │  │ (Grad-CAM)   │  │  │
          │  │  └──────────────┘  │  │
          │  └────────┬───────────┘  │
          └───────────┼──────────────┘
                      │ PostgreSQL Wire Protocol
          ┌───────────▼──────────────┐
          │    Supabase (Postgres)   │
          │    9 Normalized Tables   │
          │    + Row Level Security  │
          └──────────────────────────┘
```

---

## 🧠 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14 (App Router) | Server-side rendering, file-based routing, React Server Components |
| **Styling** | Tailwind CSS + shadcn/ui | Utility-first design system with accessible, composable primitives |
| **Animations** | Framer Motion | Hardware-accelerated scroll-driven parallax, page transitions, micro-interactions |
| **Canvas Engine** | HTML5 Canvas API | Apple-style 30FPS scroll scrubber rendering 480+ pre-cached keyframes |
| **Asset CDN** | Cloudinary | Global edge-cached delivery of 480+ pre-rendered canvas frames at 30FPS |
| **State Management** | Zustand | Lightweight, performant global state without Redux boilerplate |
| **Persistence** | Browser localStorage | Client-side persistent storage for Vendor CRM and Task Checklist data |
| **Backend API** | Python FastAPI + Uvicorn | Asynchronous REST microservice with automatic OpenAPI documentation |
| **ML Inference** | ONNX Runtime (CPU) | Sub-second model inference without GPU dependency |
| **Computer Vision** | OpenCV + Pillow | Image preprocessing, Grad-CAM heatmap generation, saliency mapping |
| **Database** | Supabase (PostgreSQL) | 9 normalized tables with real-time subscriptions and Row Level Security |
| **Containerization** | Docker | Reproducible deployment environment for ML workloads |
| **Frontend Hosting** | Vercel | Zero-config Next.js deployment with global CDN and edge functions |
| **Backend Hosting** | Hugging Face Spaces | Always-on Docker container hosting (no cold starts on free tier) |

---

## ✨ Feature Breakdown

### 1. 🎬 Cinematic Landing Experience
The landing page features an **Apple-style hardware-accelerated canvas scrubber** that renders **480+ pre-cached keyframes** at 30FPS, driven entirely by scroll position using Framer Motion's `useScroll` and `useTransform` hooks. A custom loading screen with frame-by-frame progress tracking ensures buttery-smooth playback from the first interaction.

### 2. 🧙 Multi-Step Budget Wizard (`/wizard`)
A guided, multi-step interface that collects structured inputs:
- **Destination City** (Udaipur, Jaipur, Goa, etc.)
- **Hotel Tier** (5-Star Palace, Boutique, etc.)
- **Guest Count & Outstation Ratio**
- **Event Functions** (Haldi, Mehendi, Sangeet, Baraat, Pheras, Reception)
- **Bride & Groom Hometowns** (for logistics distance calculation)

The wizard features a scroll-synced background canvas animation with real-time visual feedback.

### 3. 🖼️ AI Décor Intelligence (`/library`)
Users browse a curated image library (powered by Supabase) or upload their own inspiration photos. Each image is sent to the ONNX inference engine which returns:
- **Cost Range** (Low / Mid / High in ₹)
- **Model Confidence Score** (0.0 — 1.0)
- **Grad-CAM Heatmap Overlay** — A visual saliency map highlighting which regions of the image (floral density, structural complexity, lighting rigs) are driving the cost prediction.
- **Inference Latency** (measured in milliseconds)

### 4. 📊 Master Budget Dashboard (`/dashboard`)
A comprehensive financial overview displaying:
- **Grand Total Estimated Budget** (Low — High range with confidence indicator)
- **Category Breakdown**: Décor & Production, Food & Beverage, Ground Logistics, Artists & Entertainment, Sundries & Miscellaneous
- **Export to Excel** (`.xlsx` generation using SheetJS)
- **Share Client View** (generates a unique cryptographic session token for read-only access)
- **Save Scenario** (persists the current parameter set to Supabase for comparison)
- **Recent Activity Logs** (last 3 saved scenarios with timestamps and totals)

### 5. 📊 Scenario Analysis (`/dashboard`)
The dashboard dynamically calls 4 parallel API endpoints to calculate real-time budget estimates:
- `POST /logistics` — Fleet sizing, round-trip distance, driver allowances
- `POST /fnb` — Per-head meal costs by venue tier and meal type
- `POST /artists` — Entertainment fees by category and tier
- `POST /sundries` — Miscellaneous costs by hotel tier

All calculations use **live data from Supabase** with zero hardcoded fallbacks.

### 6. 📋 Post-Booking Tracker (`/tracker`)
Once vendors are confirmed, the tracker enables:
- **Budget Variance Table** — Auto-synced from the Vendor CRM with read-only actuals
- **Live Status Badges** — "On Target", "Saving", or "Over Budget" per category
- **Progress Velocity** — Real-time task completion percentage synced from the Master Checklist
- **Budget Alerts Engine** — Automatic warnings when actuals exceed AI forecasted maximums
- **Optimization Suggestions** — Contextual recommendations for cost reduction

### 7. ✅ Master Timeline Checklist (`/tasks`)
A 12-month wedding planning timeline with persistent task tracking:
- **3 Timeline Phases**: 6 Months Before, 3 Months Before, 1 Month Before
- **12 Core Planning Tasks** covering venue, vendors, attire, invitations, and logistics
- **Completion Velocity Widget** — Live percentage with animated progress bar
- **Full Persistence** — All task states saved to `localStorage`, surviving page reloads and browser restarts

### 8. 🏢 Vendor Detail CRM (`/vendors`)
A dedicated vendor management portal:
- **Add vendors** with Name, Category, Contact, and Quote Amount
- **5 Category Filters**: Décor & Production, Food & Beverage, Ground Logistics, Artists & Entertainment, Sundries & Miscellaneous
- **Formatted INR Display** with proper Indian number formatting
- **Full Persistence** — All vendor data saved to `localStorage`
- **Automatic Sync** — Vendor quotes auto-populate the Budget Tracker's actuals column

### 9. 🔗 Shareable Client Views (`/view/[token]`)
Generate cryptographic session tokens that create unique, read-only URLs for client review. Each session captures the complete state snapshot including wizard inputs, selected images, and budget outputs.

### 10. 🛡️ Admin Panel (`/admin`)
Administrative tools for managing the platform's underlying data:
- **Image Labeling** (`/admin/label`) — Assign training labels (function type, style, complexity tier, cost seeds) to unlabeled images
- **Data Management** (`/admin/data`) — View and manage F&B rates, bar rates, logistics rules, and artist databases

---

## 🤖 ML Pipeline Deep Dive

### Model Architecture
```
Input Image (JPEG/PNG)
       │
       ▼
┌──────────────┐
│  Download    │ ← httpx async HTTP client
│  via URL     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Preprocess  │ ← Resize to 224×224, normalize with ImageNet
│  (PIL/NumPy) │   mean=[0.485, 0.456, 0.406]
│              │   std=[0.229, 0.224, 0.225]
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ ONNX Runtime │ ← CPUExecutionProvider (no GPU required)
│  Inference   │   Input: [1, 3, 224, 224] float32
│              │   Output: [cost_low, cost_mid, cost_high, confidence]
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Grad-CAM    │ ← OpenCV-based saliency heatmap
│  Generation  │   Canny edges → Dilation → JET colormap
│              │   Overlay: 60% original + 40% heatmap
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Response    │ ← cost_low, cost_mid, cost_high (×100,000 ₹)
│  Payload     │   confidence (0.0–1.0)
│              │   gradcam_image (base64 JPEG)
│              │   inference_time_ms
└──────────────┘
```

### Why ONNX Instead of PyTorch?
| Factor | PyTorch | ONNX Runtime |
|--------|---------|--------------|
| Container Size | ~2.5 GB | ~200 MB |
| Cold Start | 15-30s | 2-3s |
| CPU Inference Speed | Baseline | 2-4x faster |
| GPU Required | Recommended | Not needed |
| Free Tier Compatible | ❌ | ✅ |

By converting the trained model to ONNX format, we achieve **production-grade inference** on free-tier cloud hosting without any GPU dependencies.

---

## 🗄️ Database Schema (9 Tables)

```sql
-- Core Data Tables
images              -- Curated décor reference library (Cloudinary URLs)
labels              -- Admin-assigned ML training labels (complexity, cost seeds)
artists             -- Entertainment cost database (tiered, categorized)
logistics_rules     -- Configurable transport parameters
ceremonial_costs    -- City-specific ceremonial item costs
fnb_rates           -- Food & beverage per-head rates by tier
bar_rates           -- Bar package rates by type and venue
sundries_config     -- Miscellaneous items (room baskets, printing, etc.)
budget_sessions     -- Saved user scenarios (JSONB for flexible schema)
```

Each table uses **UUID primary keys** with `gen_random_uuid()`, **timestamp tracking**, and **unique constraints** where applicable. The `budget_sessions` table leverages PostgreSQL's **JSONB** type for flexible, schema-less storage of user states.

---

## 🚀 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/ping` | Health check with timestamp |
| `POST` | `/predict` | ONNX inference on image URL → cost prediction + Grad-CAM |
| `POST` | `/logistics` | Calculate fleet size, round-trip costs, driver allowances |
| `POST` | `/fnb` | Calculate per-head food & beverage costs by tier |
| `POST` | `/artists` | Query artist fees by category, tier, and name |
| `POST` | `/sundries` | Retrieve sundries configuration by hotel tier |
| `GET` | `/images` | Browse curated image library with search and pagination |
| `POST` | `/session` | Create a new budget session with cryptographic token |
| `GET` | `/session/:token` | Retrieve a saved session by token |
| `GET` | `/sessions` | List all recent sessions (paginated) |
| `PATCH` | `/session/:token` | Update an existing session with actuals |
| `GET` | `/admin/images/unlabeled` | Get images pending labeling |
| `POST` | `/admin/labels` | Assign training labels to images |
| `GET` | `/admin/artists` | List all artists in the database |
| `POST` | `/admin/artists` | Add a new artist entry |
| `GET` | `/admin/rates` | View all F&B, bar, and logistics rates |

---

## 🌐 Deployment Architecture

### Why Not a Single Platform?

Vercel's serverless functions impose a **250MB package limit** and **10-60 second timeouts**. A standard Python ML environment with ONNX Runtime + OpenCV exceeds **500MB**+, making it impossible to deploy the AI backend alongside the frontend. The solution: **decoupled microservices**.

```
┌──────────────────────┐        ┌──────────────────────┐
│     VERCEL            │        │   HUGGING FACE       │
│                       │  REST  │   SPACES             │
│  Next.js 14 Frontend  │◄──────►│  Docker Container    │
│  Static + SSR Pages   │  API   │  FastAPI + ONNX      │
│  Global CDN           │        │  Always-On (Free)    │
│                       │        │  Port 7860           │
└──────────┬────────────┘        └──────────┬───────────┘
           │                                │
           └────────┬───────────────────────┘
                    │
           ┌────────▼────────┐
           │    SUPABASE     │
           │    PostgreSQL   │
           │    (Shared DB)  │
           └─────────────────┘
```

### Key Deployment Decisions
- **Hugging Face Spaces** was chosen over Render because Render's free tier **sleeps after 15 minutes** of inactivity, causing 60-second cold starts that would fail during live judge evaluations.
- All environment secrets (`SUPABASE_URL`, `SUPABASE_KEY`) are injected via platform-native secret managers — never committed to source control.

---

## ⚙️ Local Development Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Shrestha-Kumar/weddingbudget-ai.git
cd weddingbudget-ai
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:3000`.

### 3. Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate          # Linux/Mac
# .venv\Scripts\activate           # Windows

pip install -r requirements.txt
```

### 4. Environment Variables
Create a `.env` file in the `backend/` directory:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_role_key
```

### 5. Start the Backend
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
The API will be available at `http://localhost:8000`.

### 6. Connect Frontend to Backend
Set the environment variable in `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📁 Project Structure

```
weddingbudget-ai/
├── frontend/                       # Next.js 14 Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx            # Cinematic Landing (Canvas Scrubber)
│   │   │   ├── wizard/page.tsx     # Multi-Step Budget Wizard
│   │   │   ├── library/page.tsx    # AI Décor Intelligence Browser
│   │   │   ├── dashboard/page.tsx  # Master Budget Dashboard
│   │   │   ├── tracker/page.tsx    # Post-Booking Variance Tracker
│   │   │   ├── tasks/page.tsx      # Master Timeline Checklist
│   │   │   ├── vendors/page.tsx    # Vendor Detail CRM
│   │   │   ├── sessions/page.tsx   # Saved Scenario History
│   │   │   ├── view/[token]/       # Shareable Client Views
│   │   │   ├── about/page.tsx      # Platform Information
│   │   │   └── admin/              # Admin Panel (Labels + Data)
│   │   ├── components/
│   │   │   └── Navigation.tsx      # Global Navigation Bar
│   │   ├── store/
│   │   │   └── useBudgetStore.ts   # Zustand Global State
│   │   └── lib/
│   │       └── api.ts              # API Client Functions
│   ├── public/
│   │   └── keyframes_manifest.json # Cloudinary CDN Frame URLs
│   ├── next.config.mjs
│   ├── tailwind.config.ts
│   └── package.json
│
├── backend/                        # Python FastAPI Backend
│   ├── main.py                     # API Routes & Application Entry
│   ├── ml_inference.py             # ONNX Model + Grad-CAM Pipeline
│   ├── models.py                   # Pydantic Request/Response Schemas
│   ├── database.py                 # Supabase Client Initialization
│   ├── model.onnx                  # Trained ONNX Model Weights
│   ├── model.onnx.data             # ONNX External Data Tensors
│   ├── requirements.txt            # Production Dependencies
│   └── scripts/
│       └── migrate_keyframes.py    # Cloudinary Asset Migration Tool
│
├── schema.sql                      # Complete Database Schema (9 Tables)
├── Dockerfile                      # Production Container (Python 3.11-slim)
├── DEPLOYMENT_STRATEGY.md          # Technical Deployment Documentation
└── README.md                       # This File
```

---

## 🔐 Environment Variables

| Variable | Location | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | Backend (HF Secrets) | Supabase project URL |
| `SUPABASE_KEY` | Backend (HF Secrets) | Supabase service role key |
| `NEXT_PUBLIC_API_URL` | Frontend (Vercel Env) | Backend API base URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Frontend (Vercel Env) | Supabase URL for client-side access |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Frontend (Vercel Env) | Supabase anon key for client-side access |

---

## 🏆 Built For

<div align="center">

**WedTech IIT Innovation Challenge 2025**  
Product 3 (P3) — AI-Powered Budget Estimation Engine

_Issued by **Events by Athea** — managing luxury Indian destination weddings from ₹50 Lakhs to ₹10 Crores_

---

**Made with ❤️ by Shrestha Kumar**

</div>
