# System Architecture & Component Design
**Project Name**: Unsung Heroes of India (Multilingual Platform & Banner Factory)  
**Document**: `docs/02-architecture.md`  
**Phase**: Phase 1 — System Architecture & Data Model  
**Status**: Draft for Review  

---

## 1. High-Level Architecture Overview

The system is architected as an open, decoupled, service-oriented platform designed to maximize performance on free-tier infrastructure while ensuring enterprise-grade scalability and modularity.

```
                                  [ END USERS / CIVIC PARTNERS ]
                                                │
                                                ▼
                 ┌─────────────────────────────────────────────────────────────┐
                 │                   Vercel Global Edge CDN                    │
                 │   Next.js 14+ App Router (TypeScript, Tailwind CSS)         │
                 │   - Static Hero Profiles (ISR Cache: 3600s)                 │
                 │   - Search / Filter UI & Interactive Banner Customizer      │
                 │   - Admin Dashboard & Moderation Portal                     │
                 └──────────────────────────────┬──────────────────────────────┘
                                                │
                                                │ HTTPS / REST (JSON)
                                                ▼
                 ┌─────────────────────────────────────────────────────────────┐
                 │                 FastAPI Backend Service                     │
                 │       (Deployed on Render / Railway Container)              │
                 │                                                             │
                 │  ┌────────────────────────┐    ┌─────────────────────────┐  │
                 │  │   Public API Router    │    │    Admin API Router     │  │
                 │  │  - /api/v1/heroes      │    │  - /api/v1/admin/auth   │  │
                 │  │  - /api/v1/search      │    │  - /api/v1/moderation   │  │
                 │  │  - /api/v1/banners     │    │  - /api/v1/ingest       │  │
                 │  └───────────┬────────────┘    └────────────┬────────────┘  │
                 │              │                              │               │
                 │              ▼                              ▼               │
                 │  ┌────────────────────────┐    ┌─────────────────────────┐  │
                 │  │  Banner Factory Engine │    │  Auth & RBAC Security   │  │
                 │  │  - Pillow / ReportLab  │    │  - Argon2 Password Hash │  │
                 │  │  - Vector QR Generator │    │  - JWT Bearer Tokens    │  │
                 │  └───────────┬────────────┘    └────────────┬────────────┘  │
                 │              │                              │               │
                 └──────────────┼──────────────────────────────┼───────────────┘
                                │                              │
                     SQLAlchemy │ Engine (Asyncpg)             │ Storage API
                                ▼                              ▼
                 ┌───────────────────────────┐    ┌─────────────────────────┐
                 │    Serverless Postgres    │    │   Object Storage (S3)   │
                 │      (Neon / Supabase)    │    │ (Cloudflare R2 / Supa)  │
                 │ - Structured Hero Schemas │    │ - High-Res Portraits    │
                 │ - GIN Full-Text Indexes   │    │ - Rendered Banner PDFs  │
                 │ - Moderation State Engine │    │ - Static Vector Assets  │
                 └───────────────────────────┘    └─────────────────────────┘
```

---

## 2. Core Subsystems & Components

### 2.1 Frontend Web App (Next.js 14+ App Router)
- **Role**: High-speed, SEO-optimized, accessible public interface.
- **Rendering Strategy**:
  - **ISR (Incremental Static Regeneration)**: For individual hero profile pages (`/heroes/[slug]`). Pre-renders top profiles at build time and lazily generates new pages with a 1-hour revalidation window.
  - **SSR / Client-Side Fetching**: For dynamic search, filtering, and banner customization pages (`/explore`, `/banner-builder`).
  - **Static Pages**: About, Governance, API documentation, and Contribution guidelines.
- **Client Cache Layer**: TanStack Query (React Query) for optimistic UI updates, deduplicated network calls, and automatic retry handling during backend cold-starts.

### 2.2 Backend API Engine (FastAPI)
- **Role**: Asynchronous REST API providing high-throughput data access, authentication, validation, and content orchestration.
- **Architecture**: Clean modular domain design (`app/heroes`, `app/banners`, `app/submissions`, `app/auth`, `app/users`).
- **ORM & Database Layer**: SQLAlchemy 2.0 (asyncio) + Alembic for migrations + Asyncpg driver with SSL pooling.
- **Validation**: Pydantic v2 schemas for strict input/output serialization and data coercion.

### 2.3 Banner Factory Engine
- **Role**: Programmatic generation of high-resolution digital signage (PNG/WebP) and physical print assets (PDF).
- **Core Pipeline**:
  1. **Template Selection**: Load coordinate matrix and typography rules (Roadside, Metro, Bus Stop, College Board).
  2. **Asset Assembly**: Fetch verified hero portrait, biographic bullets, bilingual names, and source credits.
  3. **QR Code Generation**: Dynamically generate high-contrast vector QR code pointing to canonical profile URL (`https://<domain>/heroes/<slug>`).
  4. **Text Layout & Wrapping**: Multi-line Indic script rendering using PIL `ImageFont` with Devanagari/Indic Unicode font bundles (e.g., Noto Sans Indic).
  5. **Composition & Watermarking**: Composite hero portrait, color gradients, national motifs, typography, and mandatory source/license attribution watermark.
  6. **Export**: Stream buffer as raster image (`image/png`) or vector/PDF document (`application/pdf`).

### 2.4 Search Subsystem
- **Phase 1 Implementation**: Native PostgreSQL Full-Text Search (FTS).
  - Uses `tsvector` columns with GIN indexes on `name`, `name_local`, `state`, `domains`, and `short_bio`.
  - Supports prefix matching, language stemming, and multi-field weighted ranking (`setweight`).
- **Future Scale Path**: Optional seamless hook into Meilisearch / Typesense free tiers when index size exceeds 50,000 entities.

### 2.5 Authentication & RBAC Security Layer
- **Role-Based Access Control**:
  - `PUBLIC`: Read-only access to catalog, banner generation, and submission creation.
  - `CONTRIBUTOR`: Track own submitted heroes and revision requests.
  - `MODERATOR`: Access moderation queue, verify sources, edit submissions, approve/reject.
  - `ADMIN`: Full system CRUD, user management, and template configuration.
- **Token Mechanism**: Standard OAuth2 Password Bearer flow issuing HMAC-SHA256 signed JWTs with explicit role claims and short expirations (15–60 mins).

---

## 3. End-to-End Data Flows

### 3.1 Public Hero Discovery & Profile Request
```
User -> Vercel Edge CDN -> [Cache Hit: Return HTML/WebP in < 50ms]
                        -> [Cache Miss: Proxy -> FastAPI /api/v1/heroes/{slug} -> Neon Postgres -> Return JSON -> Cache at Edge]
```

### 3.2 Real-time Banner Generation Flow
```
User selects options -> POST /api/v1/banners/render {hero_id, template_id, lang_pair, theme}
                     -> FastAPI Banner Service
                          ├── Load Hero Metadata & Image Buffer
                          ├── Render Indic Bilingual Typography & Tagline
                          ├── Generate Canonical QR Code
                          ├── Embed Mandatory License & Source Watermark
                          └── Output Binary Stream (PNG/PDF) -> Browser Instant Download
```

### 3.3 Community Submission & Moderation Pipeline
```
Public Contributor -> POST /api/v1/submissions (Hero Data + Citations + Image License)
                   -> DB: `submissions` table (Status = 'PENDING')
                   -> Moderator logs in -> GET /api/v1/admin/submissions?status=PENDING
                   -> Moderator validates primary source against PIB/NAI/ICP
                   -> POST /api/v1/admin/submissions/{id}/approve
                        ├── Creates new row in `heroes`, `contributions`, `sources`
                        ├── Updates submission status to 'APPROVED'
                        └── Triggers Next.js ISR on-demand revalidation
```
