---
title: WeddingBudget.ai Backend API
emoji: 💍
colorFrom: gray
colorTo: green
sdk: docker
pinned: false
---

# 👑 WeddingBudget.ai 

**An AI-powered wedding budget estimation engine for high-end Indian destination weddings.**

Built exclusively for the **WedTech IIT Innovation Challenge 2025**, Product 3 (P3), issued by **Events by Athea** — a high-end wedding planning firm managing destination weddings with budgets ranging from ₹50 Lakhs to ₹10 Crores.

---

## 🚀 The Architecture

WeddingBudget.ai bridges the gap between creative Pinterest vision boards and rigid financial reality. It allows elite coordinators and clients to upload inspiration images (e.g. Mandaps, Reception Stages) and leverages computer vision to predict the structural and floral costs to execute that exact vision in major Indian destination cities.

### Technology Stack
- **Frontend Engine**: Next.js 14 (App Router), React, Tailwind CSS, shadcn/ui.
- **Micro-Interactions**: Framer Motion for scroll-orchestrated parallax, Apple-style hardware-accelerated Canvas scrubbers.
- **Backend API**: Python FastAPI.
- **Machine Learning**: OpenCV, specialized ONNX Runtime architecture utilizing a deterministic regression layer (`ml_inference.py`) to bypass massive GPU compute overhead.
- **Data Persistence**: Supabase (PostgreSQL).
- **Asset Delivery**: High-speed Cloudinary CDN globally distributing 480+ pre-rendered 30FPS UI canvas frames.

---

## 🛠 Features

1. **Deterministic Budgeting Algorithms**: Calculate precise costs spanning `Décor`, `Logistics`, `F&B`, `Artists`, and `Sundries`.
2. **ONNX Computer Vision Inference**: Analyze any uploaded JPEG/PNG to determine execution costs based on floral density and structural complexity.
3. **Advanced Scenario Planning**: Spin up countless budget variations (`/wizard`) and save them with opaque cryptographic tokens (`/view/[token]`) for client sharing.
4. **Targeted Vendor CRM**: A dedicated dashboard for tracking incoming invoices natively against AI forecasted constraints.
5. **Timeline Execution**: Master chronological checklists optimized for a 12-month destination planning cycle.

---

## ⚙️ Getting Started

### 1. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 2. Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn api.main:app --port 8000 --reload
```
