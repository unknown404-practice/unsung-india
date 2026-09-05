# 🇮🇳 Unsung Heroes of India (भारत के अनाम नायक)

> ### *"Search every Indian who gave their life to the nation."*

[![Next.js 14](https://img.shields.io/badge/Frontend-Next.js%2014%20(App%20Router)-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2016-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Deployment-Docker%20Compose-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![Local AI](https://img.shields.io/badge/Local%20AI-Qwen%202.5%20Ollama-orange?style=for-the-badge&logo=alibabacloud)](https://ollama.com/)
[![License: CC BY 4.0](https://img.shields.io/badge/Content%20License-CC%20BY%204.0-blue?style=for-the-badge)](https://creativecommons.org/licenses/by/4.0/)
[![License: MIT](https://img.shields.io/badge/Code%20License-MIT-green?style=for-the-badge)](LICENSE)

---

## 📸 Platform Showcase & Live Previews

### 🖥️ High-Resolution Platform Interface
![Unsung Heroes of India Platform Interface](assets/platform_preview.png)

---

### 🎙️ Multilingual Voice Synthesis Demonstration (Speaks in Multiple Indic Languages)
The platform features an automated **Multilingual Speech & Audio Narration Engine** allowing every citizen to listen to the heroic stories of India's freedom fighters and contributors across several languages (Hindi, Bengali, Tamil, Telugu, and English).

<div align="center">
  <video src="assets/multilingual_audio_demo.mp4" controls="controls" width="100%" style="max-width: 100%; border-radius: 8px; border: 1px solid #334155;">
    <source src="assets/multilingual_audio_demo.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</div>

<br/>

<div align="center">
  <a href="assets/multilingual_audio_demo.mp4">
    <img src="assets/multilingual_audio_demo.gif" alt="Multilingual Voice Synthesis Live Motion Preview" width="100%" style="border-radius: 8px; border: 1px solid #334155;" />
  </a>
  <p><em>▶️ <b>Live Motion Preview</b>: Instant in-browser animation of multilingual recitation. Click the preview above to view the high-definition video with full audio narration.</em></p>
</div>

* 🎥 **Direct Video File**: [`assets/multilingual_audio_demo.mp4`](assets/multilingual_audio_demo.mp4) (High-Definition H.264 / AAC, 2.09 MB)
* 🎬 **Archival WebM Capture**: [`assets/multilingual_audio_demo.webm`](assets/multilingual_audio_demo.webm) (Original Raw Capture, 12.3 MB)

---

## 🌟 Why This System Was Built (The Vision)

India's independence, scientific prowess, and cultural integrity were not forged by a handful of textbook figures alone. Millions of courageous souls—tribal revolutionaries, grassroots freedom fighters, unsung scientists, social reformers, armed revolutionaries, and selfless martyrs—sacrificed their lives, liberties, and comfort so that India could breathe free.

Yet, as generations pass, their monumental contributions risk fading into obscurity.

**Unsung Heroes of India** was engineered as a sovereign, open **Digital Public Infrastructure (DPI)** designed specifically for the **new generation**. Young students, researchers, teachers, civil servants, and everyday citizens must have an instantaneous, unhindered window into the lives of the real heroes who built modern India.

---

## ⚡ Core Features & Functionality

### 1. 🔍 Universal Historical Search & Discovery Engine
- **Rank-1 Precision Resolution**: Instantly finds any Indian contributor with sub-second response times (< 800ms) and zero broken links.
- **Accurate Historical Identity**: Discovers exact birth/death eras, home states, primary domains (Science, Freedom Struggle, Surgery, Literature, Tribal Resistance), and rich biographical milestones.
- **High-Resolution Verified Portraits**: Pulls authentic, verified archival images directly from Wikipedia and Wikimedia Commons with intelligent portrait framing.

### 2. 🎨 Automated Public Signage & Banner Factory Studio
- **Civic Digital Public Infrastructure**: Generate 300 DPI print-ready posters, roadside billboards, bus shelter displays, college notice board flyers (ISO A3), and vertical metro pillar digital mastheads (9:16).
- **Anti-Crop Face Detection**: Intelligent vertical face detection ensures historical portraits are never cropped at the forehead or chin.
- **Dynamic Vector QR Codes**: Each poster automatically embeds a verifiable vector QR code linking directly to the hero’s archival story page.

### 3. 🎙️ Multilingual Voice Engine (Text-to-Speech)
- High-fidelity audio narration reciting authentic biographical chronicles across major Indic scripts and languages.
- Accessible for rural schools, visual-impairment accessibility, and grassroots community kiosks.

### 4. 🗺️ Interactive Geospatial Heritage Map
- Visualizes the patriotic footprint across every Indian State and Union Territory.
- Filter by regional leaders from the Santhal Uprising, Ahom Kingdom, Kittur Rebellion, Malabar revolts, and tribal insurrections.

### 5. ⏳ Chronological Historical Timeline
- Trace national movements across distinct eras: Early Colonial Resistance (1757–1856), The First War of Independence (1857), Armed Revolutionary Era (1900–1930), Azad Hind War (1942–1945), and Post-Independence Nation Building.

### 6. 🛡️ Community Proposal & Anti-Hallucination Vetting Portal
- Citizens can submit unrecorded freedom fighters from their districts.
- Submissions require strict citation of primary source archives (National Archives of India, Indian Culture Portal, PIB, CSIR-NIScPR) before publishing.

---

## 🧠 The Power of Qwen 2.5 & Wikipedia Credits

### 🚀 Sovereign Qwen 2.5 Local AI Engine
- Powered by Alibaba's state-of-the-art **Qwen 2.5 (1.5B / 7B)** running locally via **Ollama**.
- **100% Sovereign & Offline-Capable**: Zero cloud API dependencies, zero vendor lock-in, zero privacy leaks, and zero recurring token costs.
- **Ultra-Compact Micro-Prompting**: Optimized for sub-millisecond inference on standard CPU and GPU hardware (`num_ctx: 128`, `num_predict: 45`, `keep_alive: -1`).
- **In-Memory Synthesis Cache**: Sub-millisecond instant retrieval (< 0.01ms) for repeated queries.

### 📚 Wikipedia & Wikimedia Commons Attribution
- We gratefully acknowledge and credit the global knowledge community of **Wikipedia** and **Wikimedia Commons** for providing free, open, and verified archival text and historical public-domain imagery under Creative Commons licensing.

---

## 🐳 Docker Implementation (100% Sovereign Self-Hosted)

The entire platform is fully containerized with **Docker Compose**, running a 5-tier isolated microservice topology:

| Container Service | Role | Internal Port | Host Endpoint (Local) |
| :--- | :--- | :--- | :--- |
| `unsung_heroes_prod_frontend` | Next.js 14 Cinematic App | `3000` | `http://localhost:3000` |
| `unsung_heroes_prod_backend` | FastAPI REST & Banner Generator | `8000` | `http://localhost:8001` |
| `unsung_heroes_prod_db` | PostgreSQL 16 Relational Store | `5432` | `localhost:5433` |
| `unsung_heroes_prod_ollama` | Containerized Ollama AI Engine | `11434` | `localhost:11435` |
| `unsung_heroes_ollama_pull` | Automated Qwen 2.5 Model Provisioner | - | Auto-provisions Qwen |

---

## 📊 Project Building Graph Tree (Mermaid.js)

The following architectural graph tree visualizes the entire system hierarchy, module separation, containerized services, and dataflow:

```mermaid
flowchart TD
    classDef root fill:#ff9933,stroke:#ffffff,stroke-width:2px,color:#000000,font-weight:bold;
    classDef frontend fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#ffffff;
    classDef backend fill:#0f172a,stroke:#10b981,stroke-width:2px,color:#ffffff;
    classDef ai fill:#3b1e08,stroke:#f59e0b,stroke-width:2px,color:#ffffff;
    classDef db fill:#172554,stroke:#60a5fa,stroke-width:2px,color:#ffffff;
    classDef media fill:#2e1065,stroke:#c084fc,stroke-width:2px,color:#ffffff;

    ROOT["🇮🇳 Unsung Heroes of India (National DPI)"]:::root

    ROOT --> MEDIA["📂 assets/ (Media & Proof)"]:::media
    ROOT --> FRONT["⚡ frontend/ (Next.js 14 App Router)"]:::frontend
    ROOT --> BACK["🐍 backend/ (FastAPI REST Service)"]:::backend
    ROOT --> AI_TIER["🧠 Sovereign AI (Qwen 2.5 + Ollama)"]:::ai
    ROOT --> DB_TIER["🐘 Database (PostgreSQL 16)"]:::db

    subgraph MEDIA_TREE["Media & Demonstration Assets"]
        MEDIA --> M1["platform_preview.png (Platform UI Screenshot)"]
        MEDIA --> M2["multilingual_audio_demo.mp4 (High-Def Indic Audio Video)"]
        MEDIA --> M3["multilingual_audio_demo.gif (Instant Autoplay Looping Motion)"]
    end

    subgraph FRONTEND_TREE["Frontend Application Layer (:3000)"]
        FRONT --> F_PAGES["app/ (App Router Pages)"]
        F_PAGES --> FP1["/ (Cinematic Home & Precision Search)"]
        F_PAGES --> FP2["/explore (Catalog & Era Filters)"]
        F_PAGES --> FP3["/heroes/[slug] (Deep Biography & Audio)"]
        F_PAGES --> FP4["/banners (300 DPI Poster Studio)"]
        F_PAGES --> FP5["/map & /timeline (Geospatial & Eras)"]

        FRONT --> F_COMP["components/ (UI Modules)"]
        F_COMP --> FC1["AudioNarrator (Indic Speech Player)"]
        F_COMP --> FC2["BannerStudio (Anti-Crop Face Detection)"]
        F_COMP --> FC3["IndiaHeritageMap (State Hero Footprint)"]

        FRONT --> F_LIB["lib/ (Core Engine & Caching)"]
        F_LIB --> FL1["cloud-ai.ts (Micro-Prompt Engine)"]
        F_LIB --> FL2["api.ts (Rank-1 Resolution Client)"]
        F_LIB --> FL3["In-Memory Fast Cache (< 0.01ms)"]
    end

    subgraph BACKEND_TREE["Backend Services Layer (:8001)"]
        BACK --> B_CORE["src/app/"]
        B_CORE --> B1["heroes/ (Catalog Service)"]
        B_CORE --> B2["banners/ (Pillow Vector Renderer)"]
        B_CORE --> B3["submissions/ (Citizen Vetting Pipeline)"]
        B_CORE --> B4["wikipedia/ (Verification Ingestion)"]
        B_CORE --> B5["auth/ (JWT Security & RBAC)"]
    end

    subgraph AI_PIPELINE["Sovereign Local Intelligence Mesh"]
        AI_TIER --> A1["Ollama Service (Host: 11434 / Docker: 11435)"]
        A1 --> A2["Qwen 2.5 1.5B (Sub-Second Turbo Inference)"]
        A1 --> A3["Qwen 2.5 7B (Deep Historical Synthesis)"]
        AI_TIER --> A4["Wikipedia / Wikimedia Commons (Archival Citations & Verified Portraits)"]
    end

    subgraph DATA_STORAGE["Relational Persistence Tier"]
        DB_TIER --> D1["PostgreSQL 16 Engine (:5433)"]
        D1 --> D2["Heroes & Historical Eras Table"]
        D1 --> D3["Public Proposals & Verified Citations"]
    end
```

---

## 📂 Project Directory Structure

```text
unsung-heroes-india/
│
├── assets/                                 # Platform Media & Demonstration Assets
│   ├── platform_preview.png                # High-Resolution UI Screenshot
│   ├── multilingual_audio_demo.mp4         # High-Definition Indic Audio Video (2.09 MB)
│   ├── multilingual_audio_demo.gif         # Instant Autoplay Looping Motion Preview
│   └── multilingual_audio_demo.webm        # Archival WebM Raw Capture (12.3 MB)
│
├── frontend/                               # Next.js 14 Cinematic Web Application
│   ├── app/                                # App Router Pages & REST API Endpoints
│   │   ├── page.tsx                        # Cinematic Home & Universal Search
│   │   ├── explore/                        # Comprehensive Filter & Grid Catalog
│   │   ├── heroes/[slug]/                  # Deep Biographical Chronicle & Story
│   │   ├── banners/                        # Automated Public Banner Factory Studio
│   │   ├── map/                            # Interactive Geospatial Heritage Map
│   │   ├── timeline/                       # Chronological Historical Progression
│   │   ├── suggest/                        # Citizen Hero Proposal Form
│   │   ├── admin/submissions/              # Editorial Review & Verification Dashboard
│   │   ├── about/                          # Mission & Sovereign Topology Documentation
│   │   └── api/                            # Next.js Serverless Edge Routes
│   │       ├── qwen/search/                # Rank-1 Wikipedia + Qwen 2.5 Synthesis API
│   │       ├── qwen/state-heroes/          # Regional State Leader Discovery API
│   │       ├── search/                     # High-Speed Query Resolver
│   │       ├── image-proxy/                # Direct CORS High-Res Streaming Proxy
│   │       ├── submissions/                # Community Proposals Store
│   │       └── tts/                        # Multilingual Web Speech Synthesis
│   ├── components/                         # Modular React UI Components
│   │   ├── BannerStudio.tsx                # Visual Banner Customizer & Downloader
│   │   ├── HeroCard.tsx                    # Glassmorphism Portrait Card
│   │   ├── Navbar.tsx                      # Header & Language Selector
│   │   ├── Footer.tsx                      # Public Credits & Open Licensing
│   │   └── IndiaHeritageMap.tsx            # Interactive Map Visualization
│   ├── lib/                                # Core Utilities & Data Layer
│   │   ├── api.ts                          # Universal Client/Server Discovery Client
│   │   ├── cloud-ai.ts                     # Sovereign Ollama Qwen 2.5 Engine & Cache
│   │   ├── sample-data.ts                  # Seed Dataset of Supreme National Icons
│   │   ├── submissions-db.ts               # Local Submissions Store
│   │   └── types.ts                        # TypeScript Data Contracts
│   ├── public/                             # Static Web Assets & Fonts
│   ├── Dockerfile                          # Optimized Multi-Stage Production Build
│   └── package.json                        # Node.js Dependencies & Build Scripts
│
├── backend/                                # FastAPI REST Service & Python Engine
│   ├── src/app/
│   │   ├── auth/                           # JWT Authentication & RBAC
│   │   ├── heroes/                         # Hero Catalog CRUD & Database Services
│   │   ├── banners/                        # Pillow High-DPI Vector Signage Renderer
│   │   ├── submissions/                    # Citizen Proposal Moderation Pipeline
│   │   ├── wikipedia/                      # Background Ingestion & Verification
│   │   ├── config.py                       # Pydantic Settings & Environment
│   │   ├── db.py                           # SQLAlchemy 2.0 Async Session
│   │   └── main.py                         # FastAPI Application Router
│   ├── Dockerfile                          # Debian Slim Python Container
│   └── requirements.txt                    # Python Dependencies (FastAPI, Pydantic, etc.)
│
├── docs/                                   # Architectural Blueprint & Specifications
│   ├── 01-product-prd.md                   # PRD & User Personas
│   ├── 02-architecture.md                  # System Architecture & Component Design
│   ├── 03-data-model.md                    # PostgreSQL DDL Relational Schema
│   ├── 04-api-spec.md                      # OpenAPI Specification
│   ├── 06-governance-and-dpi.md            # Editorial Ethics & DPI Alignment
│   └── 07-devops-and-free-hosting.md       # Self-Hosted Sovereign Infrastructure Guide
│
├── infra/                                  # Development Cluster Definitions
├── scripts/                                # Verification & Benchmark Test Suites
│   ├── test_full_search_flow.js            # Rank-1 Identity Resolution Verification
│   ├── test_local_models.js                # Ollama Model Inspection Script
│   └── seed_heroes.py                      # Database Seeding Utility
│
├── docker-compose.yml                      # Full-Stack Sovereign Production Cluster
├── CHECKPOINT_RESUME.md                    # Session Checkpoint & Exact Resume Guide
└── README.md                               # Primary Documentation & Repository Master
```

---

## 🚀 How to Run (Step-by-Step Instructions)

### 📥 1. Clone the Repository
```bash
git clone https://github.com/unknown404-practice/unsung-india.git
cd unsung-india
```

---

### 💻 2. Launch Localhost (The Master Command)

#### **Step A: Start the Frontend**
```powershell
cd C:\Users\RANADEEP\Desktop\.vscode\unsung-heroes-india\frontend
npm run dev
```
> **Access URL**: Open your local browser at `http://localhost:3000`

#### **Step B (Optional): Start Local Qwen AI with Ollama**
In a separate terminal, start Ollama:
```powershell
# Optional: Enable AMD Radeon GPU acceleration via Vulkan:
$env:OLLAMA_IGPU_ENABLE="1"
$env:OLLAMA_VULKAN="1"

ollama serve
```

---

### 🐳 3. Or Launch Everything in 1 Command with Docker
If you have Docker Desktop installed, you can launch the complete ecosystem (Frontend, Backend, PostgreSQL, and Ollama) with a single command:
```powershell
cd C:\Users\RANADEEP\Desktop\.vscode\unsung-heroes-india
docker compose up -d
```
* **Frontend Web App**: `http://localhost:3000`
* **Backend API Swagger Docs**: `http://localhost:8001/docs`
* **To stop anytime**: `docker compose down`

---

## 🇮🇳 Significance of the System to the Nation

1. **Constitutional & Civic Education**: Empowers youth to understand that India's liberty was achieved through the collective valor of diverse regions, castes, religions, and tribal communities.
2. **Open Cultural Sovereignty**: Preserves public historical assets independently of commercial paywalls, ensuring data remains freely accessible forever.
3. **Public Infrastructure Integration**: Makes it effortless for municipal corporations, schools, metro transit authorities, and universities to print patriotic banners and educate commuters daily.

---

## 👨‍💻 Project Credentials & Leadership

* **Project Lead:** Ranadeep Saha
* **Email:** [ranadeep2021saha@gmail.com](mailto:ranadeep2021saha@gmail.com)
* **GitHub:** [@unknown404-practice](https://github.com/unknown404-practice)
* **LinkedIn:** [Ranadeep Saha](https://www.linkedin.com/in/ranadeep-saha-a03296404)
* **Affiliation:** Member, Google Developer Group

---

<div align="center">

### *"It is proudly made by an Indian ❤️ to all the Indian."*

</div>
