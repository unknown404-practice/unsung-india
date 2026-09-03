# Unsung Heroes of India (भारत के अनाम नायक)
### Sovereign Digital Public Infrastructure (DPI) & Public Banner Factory

[![License: CC BY 4.0](https://img.shields.io/badge/Content%20License-CC%20BY%204.0-blue.svg)](https://creativecommons.org/licenses/by/4.0/)
[![License: MIT](https://img.shields.io/badge/Code%20License-MIT-green.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black.svg)](https://nextjs.org)

**“Unsung Heroes of India”** is a sovereign, multilingual, community-vetted, and open Digital Public Infrastructure (DPI). The platform documents India’s lesser-known freedom fighters, tribal resistance leaders, pioneering scientists, and social reformers, providing open REST APIs and an automated **Banner Factory** to generate print-ready and digital signage for Indian public infrastructure (roads, metro stations, bus stops, railway stations, colleges).

---

## 🏛️ Project Architecture & Repository Structure

```text
unsung-heroes-india/
  docs/                             # Spec-First Architecture & Design Documentation
    01-product-prd.md               # Product Requirements & User Journeys
    02-architecture.md              # System Architecture & Component Design
    03-data-model.md                # PostgreSQL DDL Schema & Relational Model
    04-api-spec.md                  # OpenAPI REST Specification
    06-governance-and-dpi.md        # DPI Alignment & Editorial Sourcing
    07-devops-and-free-hosting.md   # Zero-Cost Lifetime Infrastructure Topology
  backend/                          # FastAPI REST API & Banner Factory Engine
    src/
      app/
        auth/                       # JWT Authentication & RBAC
        heroes/                     # Hero Catalog CRUD & Search
        banners/                    # Pillow + Vector QR Banner Renderer
        submissions/                # Community Proposals & Moderation
        config.py                   # Pydantic Settings
        db.py                       # SQLAlchemy 2.0 Async Session
        main.py                     # FastAPI Application Instance
    Dockerfile                      # Containerization Blueprint
    render.yaml                     # Render 1-Click Deployment
    requirements.txt                # Python Dependencies
  frontend/                         # Next.js 14 App Router (Cinematic UI)
    app/                            # Next.js Routes (Home, Explore, Profiles, Studio, Suggest)
    components/                     # Reusable UI (Navbar, Footer, HeroCard, BannerStudio)
    lib/                            # API Client, TypeScript Interfaces & Sample Dataset
    styles/                         # Cinematic Tailwind CSS & Indic Typography
  infra/
    docker-compose.dev.yml          # Local PostgreSQL + Backend Dev Cluster
  scripts/
    seed_heroes.py                  # Seed Script for Verified Historical Figures
```

---

## 🚀 Getting Started

### 1. Backend Service (FastAPI)
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env

# Seed initial verified heroes & admin account
python ../scripts/seed_heroes.py

# Start dev server
cd src
uvicorn app.main:app --reload --port 8000
```
API Documentation (Swagger): [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Cinematic Frontend Web App (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to experience the cinematic UI.

---

## 🛡️ Anti-Hallucination & Provenance Guarantee
Every biographical entry is required to link to primary source archives:
1. **Indian Culture Portal** (`indianculture.gov.in`)
2. **National Archives of India — Abhilekh-Patal** (`abhilekhpatal.in`)
3. **Press Information Bureau (PIB)** (`pib.gov.in`)
4. **CSIR-NIScPR Science Reporter** (`sciencereporter.niscpr.res.in`)
5. **Wikimedia Commons** (Safe image licenses: `CC0`, `CC-BY-4.0`, `CC-BY-SA-4.0`, `PUBLIC_DOMAIN`)
