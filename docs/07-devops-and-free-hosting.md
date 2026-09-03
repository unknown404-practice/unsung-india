# DevOps & Free-Tier Lifetime Hosting Specification
**Project Name**: Unsung Heroes of India  
**Document**: `docs/07-devops-and-free-hosting.md`  
**Phase**: Phase 0 — Initial Specification  
**Status**: Draft for Review  

---

## 1. Zero-Cost Lifetime Infrastructure Topology

The system is architected to operate **100% free-of-cost indefinitely** by leveraging modern managed serverless and cloud compute free tiers, with zero vendor lock-in and minimal operational overhead.

```
                                  [ PUBLIC INTERNET ]
                                           │
                                           ▼
                 +───────────────────────────────────────────────────+
                 │            Vercel Edge Network (Global)           │
                 │         - Next.js App Router (Frontend)           │
                 │         - Global Static & ISR Page Cache          │
                 │         - Free: 100 GB Bandwidth / mo             │
                 +─────────────────────────┬─────────────────────────+
                                           │
                                           │ HTTPS API Requests
                                           ▼
                 +───────────────────────────────────────────────────+
                 │        Render / Railway Free Web Service          │
                 │         - FastAPI ASGI Application                │
                 │         - Pillow / Banner Generator Service       │
                 │         - Cold Start: Spins down after ~15m idle  │
                 +─────────────────────────┬─────────────────────────+
                                           │
                                           │ Encrypted Connection Pooling
                                           ▼
                 +───────────────────────────────────────────────────+
                 │        Neon / Supabase Serverless Postgres        │
                 │         - Managed PostgreSQL 16+                  │
                 │         - Full-Text Search (GIN Indexes)          │
                 │         - Scale-to-zero on inactivity             │
                 │         - Free: 0.5 GB Storage                    │
                 +───────────────────────────────────────────────────+
```

---

## 2. Free Tier Matrix & Documented Constraints

| Tier Component | Recommended Provider | Backup Provider | Free Tier Limits (2026 Reality) | Known Constraints |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend Web App** | **Vercel Hobby** | Cloudflare Pages / Netlify | 100 GB Bandwidth/mo, Unlimited Static requests, 1M Edge Function calls/mo. | `[FACT]` Optimized for Next.js ISR; no long-running processes. |
| **Backend API Engine** | **Render (Free Tier)** | **Railway (Hobby Tier)** / Fly.io | 512 MB RAM, 0.1 CPU, 750 free compute hours/mo. | `[FACT]` **Cold Starts**: Spins down to 0 instances after 15 mins of inactivity. First wake-up request takes ~15–30s. |
| **Relational Database** | **Neon Postgres** | **Supabase Postgres** | 0.5 GB storage, serverless compute, auto-suspend when idle. | `[FACT]` **Cold Starts**: Scale-to-zero compute pauses after 5 mins idle; resumes in ~500ms–1.5s on incoming connection. |
| **Static / Media Storage** | **Cloudflare R2** / Supabase Storage | Vercel Blob | 10 GB free storage, zero egress fees (R2), or 1 GB on Supabase. | `[FACT]` Sufficient for 10,000+ optimized hero portraits & templates. |

---

## 3. Cold Start Mitigation & Resilience Strategy

To deliver an exceptional user experience despite compute services spinning down during periods of inactivity:

```
[User Request to API] 
       │
       ▼
Next.js API Proxy / Client
       ├──> 1. Sends Healthcheck / Ping to Wake Backend
       ├──> 2. Shows Responsive UI Skeleton with "Waking Server..." Indicator
       └──> 3. Serves Cached ISR Hero Profiles (Zero delay from Vercel Edge)
```

1. **Incremental Static Regeneration (ISR)**:
   - Popular hero profiles, state listings, and search catalogs are statically cached at the Vercel CDN edge (`revalidate: 3600`).
   - 90%+ of public visits hit the edge cache directly, bypassing the sleeping backend completely.
2. **Frontend Graceful Wakeup UX**:
   - For real-time API actions (generating custom banners, submitting new heroes), the UI includes an animated progress indicator ("Waking up sovereign compute node... ~10s").
3. **Keep-Alive Cron Ping (Optional / Self-Hosted)**:
   - A lightweight external health ping (e.g., free GitHub Actions cron or UptimeRobot) pinging `/health` every 14 minutes during peak daytime hours (08:00–22:00 IST) to keep instances warm without exceeding free hour quotas.
4. **Optimized Image Pipeline**:
   - Next.js Image component (`next/image`) automatically optimizes, resizes, and converts remote portraits to WebP at the edge.

---

## 4. Environment Configuration Architecture

### Backend (.env)
```ini
# Core Configuration
ENVIRONMENT=production
DEBUG=false
PROJECT_NAME="Unsung Heroes of India"

# Database Connection (Neon / Supabase Postgres Connection String with SSL)
DATABASE_URL=postgresql://user:password@ep-cool-pool-123456.ap-southeast-1.aws.neon.tech/unsung_heroes?sslmode=require

# Authentication & Security
JWT_SECRET_KEY=generate_with_openssl_rand_hex_32
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# CORS Configuration
ALLOWED_ORIGINS=["https://unsung-heroes.vercel.app","http://localhost:3000"]
```

### Frontend (.env.local)
```ini
NEXT_PUBLIC_API_BASE_URL=https://unsung-heroes-api.onrender.com/api/v1
NEXT_PUBLIC_SITE_URL=https://unsung-heroes.vercel.app
```

---

## 5. Local Development & Production Parity

For seamless local development without cloud dependencies:
- A root `infra/docker-compose.dev.yml` will orchestrate local PostgreSQL, FastAPI backend, and Next.js frontend with hot reloading.
