# Unsung India Search — Product Requirements Document (PRD)
**Project Name**: Unsung India Search (National Search Engine for Indian Contributors)  
**Document**: `docs/01-product-prd.md`  
**Phase**: Phase 0 — Clarify & Lock Requirements  
**Status**: Completed  

---

## 1. Executive Summary & Vision

### 1.1 Problem Statement
When citizens, students, and researchers search for Indian historical figures and contributors across domains (science, philosophy, anti-colonial resistance, literature, social reform), general-purpose search engines frequently return:
- Fragmented, paywalled, or commercial results.
- Prominent mainstream figures while completely burying grassroots and regional contributors.
- Disputed or hallucinated biographical claims lacking verifiable archival provenance.
- Inconsistent image copyright and licensing information.

### 1.2 Vision
To build **“Unsung India Search”** — a sovereign, lightning-fast, Google-grade specialized search engine indexing every verified Indian contributor across 3,000+ years of history. Designed as a foundational component of India's Digital Public Infrastructure (DPI).

---

## 2. Core Non-Negotiables & Performance Mandates

```
[ User Query: "women freedom fighters from assam" ]
                    │
                    ▼  (Zero External Calls | Local GIN / Trigram Index)
+───────────────────────────────────────────────────────────────────────────+
|               LOCAL SEARCH ENGINE & NORMALIZED INDEX                      |
|  - Sub-35ms query execution                                               |
|  - Typo-tolerant phonetic & n-gram matching                               |
|  - Pre-cached bilingual names (English + 22 Indic scripts)                |
|  - Pre-verified CC-BY / Public Domain image metadata                      |
|  - Structured bullet achievements & primary archive links                 |
+───────────────────────────────────────────────────────────────────────────+
                    │
                    ▼  (< 50ms Total Latency)
[ Instant Google-Style Knowledge Panels & Faceted Results ]
```

1. **Zero Query-Time Fetch**: At search time, the engine **never** makes network requests to Wikipedia or external government portals. All data is served from pre-indexed local records.
2. **100% Free & Verified Sources**: Data is ingested and enriched exclusively from Wikipedia (MediaWiki API), Indian Culture Portal, data.gov.in, PIB, National Archives (Abhilekh-Patal), and CSIR-NIScPR.
3. **Typo Tolerance & Multilingual Transliteration**: Automatic fuzzy matching and support for all 22 scheduled Indian languages.

---

## 3. User Personas & Search Journeys

| Persona | Query Intent | Example Search | System Output |
| :--- | :--- | :--- | :--- |
| **Student / Aspirant** | Discover local role models for exams and essays. | `tribal heroes jharkhand` | Immediate knowledge cards for Birsa Munda, Jatra Bhagat, Sidhu-Kanhu with key contributions and timelines. |
| **Educator / Professor** | Find verified primary source records for curriculum. | `ancient indian plastic surgery` | Detailed knowledge panel for Maharshi Sushruta with Sushruta Samhita citations and AIIMS statue photo. |
| **Researcher** | Explore historical contributions in specific fields. | `women botanists cytogenetics` | Instant profile of E.K. Janaki Ammal with sugarcane breeding breakthroughs and BSI reorganization records. |
| **Transit / Civic Body** | Generate banners and signage for stations. | `freedom fighters tamluk` | Matangini Hazra profile + direct 1-click Signage Banner generator button. |

---

## 4. Functional Requirements

### 4.1 Search & Discovery
- **FR-1.1**: Full-text keyword search across person names, Indic aliases, state, domain, and biographical summaries.
- **FR-1.2**: Multi-facet filtering by:
  - **State / Union Territory** (28 States + 8 UTs)
  - **Domain** (Freedom Struggle, Science & Mathematics, Medicine, Social Reform, Philosophy, Literature, Education, Tribal Resistance)
  - **Historical Era** (Ancient, Classical, Medieval, Early Colonial, 1857 Revolt, Revolutionary Movement, Quit India, Post-Independence)
  - **Gender** (Female, Male, All)
- **FR-1.3**: Instant autocomplete suggestions with portrait thumbnails as the user types.
- **FR-1.4**: Typo-tolerant search with automatic *"Did you mean?"* suggestions.

### 4.2 Knowledge Panel & Profile View
- **FR-2.1**: Google-style structured knowledge panel containing:
  - High-resolution verified portrait with copyright license badge (`CC0`, `CC-BY`, `Public Domain`).
  - Standard English name + native Indic script spelling.
  - Lifespan, state, and primary domain tags.
  - Tagline and concise 200–350 word synthesized bio.
  - 3–7 key structured contribution bullets.
  - Chronological life events timeline.
  - Authoritative source citations with direct external links to National Archives, PIB, and Indian Culture Portal.
- **FR-2.2**: 1-Click Action to generate printable signage banners (Metro Pillar, Billboard, College Notice Board).

---

## 5. Non-Functional Requirements (NFR)

- **NFR-1 (Latency)**: Search query execution $< 35\text{ms}$ on PostgreSQL local index; total end-to-end HTTP response $< 60\text{ms}$.
- **NFR-2 (Cold-Start Resilience)**: Next.js edge caching and client-side dataset fallback ensure instantaneous query responses even if backend compute is warming up.
- **NFR-3 (Data Integrity)**: Zero hallucinated entries. Strict database constraints enforce verified image licenses and primary source URLs.
