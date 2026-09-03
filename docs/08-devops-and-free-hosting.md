# DevOps, Search Performance & Free-Tier Lifetime Hosting
**Project Name**: Unsung India Search  
**Document**: `docs/08-devops-and-free-hosting.md`  
**Phase**: Phase 0 — DevOps Specification  
**Status**: Completed  

---

## 1. Zero-Cost Lifetime Infrastructure Topology

```
                                  [ PUBLIC INTERNET ]
                                           │
                                           ▼
                 +───────────────────────────────────────────────────+
                 │            Vercel Edge Network (Global)           │
                 │         - Next.js Search UI & Knowledge Panels    │
                 │         - Edge Caching (< 10ms response)          │
                 │         - Free: 100 GB Bandwidth / mo             │
                 +─────────────────────────┬─────────────────────────+
                                           │
                                           │ HTTPS API Requests (< 35ms)
                                           ▼
                 +───────────────────────────────────────────────────+
                 │        Render / Railway Free Web Service          │
                 │         - FastAPI Search & Person API Engine      │
                 │         - Background Ingestion / Normalizer Jobs  │
                 +─────────────────────────┬─────────────────────────+
                                           │
                                           │ Asyncpg Connection Pool
                                           ▼
                 +───────────────────────────────────────────────────+
                 │        Neon / Supabase Serverless Postgres        │
                 │         - Pre-indexed Person Catalog              │
                 │         - GIN Full-Text Indexes + Trigram Ops     │
                 │         - Free: 0.5 GB Storage                    │
                 +───────────────────────────────────────────────────+
```

---

## 2. Cold-Start Tolerance & Performance Safeguards

1. **Client-Side Instant Fallback Index**: The frontend maintains a local pre-compiled static index of core historical figures in memory, providing 0s instant search responses even if the backend container is spinning up from idle.
2. **Postgres GIN Vector Optimization**: Search vectors are pre-computed on write/ingest so that search queries perform fast index scans without computing text vectors at runtime.
