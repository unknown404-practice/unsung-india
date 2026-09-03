# Governance, DPI Alignment & Sustainability Blueprint
**Project Name**: Unsung Heroes of India  
**Document**: `docs/06-governance-and-dpi.md`  
**Phase**: Phase 0 — Initial Specification  
**Status**: Draft for Review  

---

## 1. Digital Public Infrastructure (DPI) Alignment

### 1.1 The DPI Philosophy
In accordance with India’s Digital Public Infrastructure framework (built on open standards, modular architecture, non-proprietary data layers, and public-interest governance), **"Unsung Heroes of India"** is designed as a foundational cultural and educational public asset rather than a siloed commercial platform.

```
+-------------------------------------------------------------------------+
|                  INDIAN DIGITAL PUBLIC INFRASTRUCTURE                   |
+-------------------------------------------------------------------------+
| [Identity Layer]      | Aadhaar / DigiLocker                            |
| [Payment Layer]       | UPI                                             |
| [Linguistic Layer]    | Bhashini (NLTM - National Language Translation) |
| [Data & Heritage DPI] | Indian Culture Portal + Gyan Bharatam + OGD     |
| [Civic Cultural DPI]  | **Unsung Heroes of India (Catalog + Banners)**  |
+-------------------------------------------------------------------------+
```

### 1.2 Open Access & Interoperability Guarantees
- **Zero Lock-In**: Open JSON/REST APIs with OpenAPI standard specification.
- **Bulk Open Data**: Periodic published snapshots in standard formats (CSV, JSON-LD) under open licensing.
- **Semantic Metadata**: Schema.org `Person`, `HistoricalEvent`, and `EducationalResource` microdata compatibility for universal indexing.

---

## 2. Strategic Integration Targets (National Platforms)

| Platform | Role & Value Proposition | Integration Vector | Status & Verification Rule |
| :--- | :--- | :--- | :--- |
| **Indian Culture Portal (ICP)** *(Ministry of Culture)* | Primary authoritative heritage aggregator covering archives, manuscripts, and regional history. | Bidirectional metadata exchange and authoritative citation cross-referencing. | `[FACT]` Portal exists (`indianculture.gov.in`). `[ASSUMPTION]` Supports metadata exchange. Exact public API endpoints require official verification. |
| **Bhashini (NLTM)** *(MeitY)* | AI-powered automated translation across 22 scheduled Indian languages. | Pipeline translation of biographic summaries and banner taglines (English $\leftrightarrow$ Hindi / Regional). | `[FACT]` National language mission (`bhashini.gov.in`). Pipeline integration via standard Bhashini ULCA API specs. |
| **Gyan Bharatam National Digital Repository** | National repository for educational and indigenous knowledge assets. | Archival deposit and school curriculum alignment. | `[ASSUMPTION]` Potential target for educational asset distribution. |
| **National Archives of India (Abhilekh-Patal)** | Archival records of the Indian freedom struggle and declassified gazettes. | Primary documentary citation linking for historical records. | `[FACT]` Portal operational (`abhilekhpatal.in`). Used for manual citation validation. |
| **Press Information Bureau (PIB)** | Official releases on "Lesser Known Freedom Fighters". | Verified narrative source extraction. | `[FACT]` PIB historical features (`pib.gov.in`) used as verified primary references. |

---

## 3. Governance & Editorial Board Structure

```
                         +----------------------------------+
                         |      Advisory Board              |
                         |  (Historians, Archivists, DPI)   |
                         +-----------------+----------------+
                                           |
                                           v
                         +----------------------------------+
                         |     Editorial Working Group      |
                         |  (Domain Experts & Lead Editors) |
                         +-----------------+----------------+
                                           |
                                           v
                         +----------------------------------+
                         |     Community Reviewers /        |
                         |     Verified Regional Editors    |
                         +-----------------+----------------+
                                           |
                                           v
                         +----------------------------------+
                         |    Public Community Submission   |
                         |   (Crowdsourced Documentation)   |
                         +----------------------------------+
```

### 3.1 Roles & Responsibilities
1. **Advisory Council**: Establishes high-level editorial guidelines, historical veracity standards, and ethical guardrails.
2. **Lead Editors**: Vets flagged submissions, resolves historical disputes, and validates multi-source provenance before catalog publication.
3. **Regional Contributors**: Identifies local district-level unsung heroes, translating summaries into regional scripts.

### 3.2 Sourcing & Anti-Hallucination Editorial Policy
1. **Minimum Provenance Rule**: Every hero entry must cite at least one recognized primary or secondary historical source (e.g., Government Archives, PIB, State Gazetteers, Academic peer-reviewed publications, or documented Wikimedia entries).
2. **Original Synthesis Rule**: All biographic summaries must be synthesized originally by contributors/editors to maintain copyright hygiene while accurately summarizing factual history.
3. **Neutral & Dignified Tone**: Neutral, historically grounded language avoiding unverified folklore or partisan embellishments.

---

## 4. Licensing & Long-Term Sustainability

### 4.1 Data & Content Licensing
- **Text Biographies & Curated Metadata**: Published under **Creative Commons Attribution 4.0 International (CC-BY 4.0)**.
- **Codebase & Banner Engine**: Released under **Apache 2.0 / MIT License** for open civic reusability.
- **Image Assets**: Restricted strictly to verifiable **CC0, CC-BY, CC-BY-SA, or Public Domain** licenses with explicit author attribution displayed on all UI views and rendered banners.

### 4.2 Sustainability & Public Adoption
- **Free-Tier Sustainability**: Architecture designed to cost ₹0/month indefinitely on modern managed free tiers.
- **CSR & Institutional Grants**: Alignment with Section 8 non-profit structure (12A/80G/CSR-1) for future scaling, server funding, and school banner printing drives.
- **Civic Partnerships**: Outreach to State Metro Rail Corporations, Indian Railways, and State Education Boards to adopt auto-generated banners for civic digital signage.
