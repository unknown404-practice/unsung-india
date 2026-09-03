# Content Pipeline, Ingestion Strategy & Editorial Hygiene
**Project Name**: Unsung Heroes of India (Multilingual Platform & Banner Factory)  
**Document**: `docs/08-content-pipeline.md`  
**Phase**: Phase 5 — Content Pipeline & Wikipedia Integration  
**Status**: Completed  

---

## 1. Content Acquisition Strategy & Pipeline Topology

To ensure continuous, verified, and copyright-safe content growth without hallucinations:

```
[ Raw Sourcing Vectors ]
  ├── 1. Wikimedia API / Commons (CC-BY-SA, CC0, Public Domain Media)
  ├── 2. Open Government Data (data.gov.in datasets)
  ├── 3. PIB Features & Indian Culture Portal Collections
  └── 4. Public Crowdsourced Submissions (/suggest)
            │
            ▼
[ Ingestion & Normalization Engine (scripts/ingest_wikipedia.py) ]
  ├── Structured Metadata Extraction (Names, Dates, State, Era, Domain)
  ├── Image License Gatekeeper (Accept only CC0, CC-BY, CC-BY-SA, Public Domain)
  └── Source Attribution Assembly (PIB / NAI / MediaWiki link)
            │
            ▼
[ Editorial Synthesis & Fact Verification ]
  ├── Original Prose Synthesis (Zero direct copy-paste to maintain copyright hygiene)
  ├── Extraction of 3-5 Succinct Impact Bullets
  └── "Why are they Unsung?" Contextual Analysis
            │
            ▼
[ Production Postgres Catalog (heroes, contributions, timeline, sources) ]
```

---

## 2. MediaWiki & Wikimedia Commons Integration Specifications

### 2.1 MediaWiki API Endpoints Used
`[FACT]` Wikimedia exposes public, open REST and Action APIs:
- **Search Query**: `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={query}&format=json`
- **Page Extract & Infobox**: `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageprops|pageimages&exintro=true&explaintext=true&titles={title}&format=json`
- **Image Metadata & License**: `https://commons.wikimedia.org/w/api.php?action=query&titles=File:{filename}&prop=imageinfo&iiprop=url|extmetadata&format=json`

### 2.2 License Gatekeeper Protocol
Before any image is accepted into the catalog:
1. Extract `LicenseShortName` or `LicenseUrl` from `extmetadata`.
2. Map to safe enum:
   - `CC0` / `Public Domain` / `CC-BY-4.0` / `CC-BY-SA-4.0` $\rightarrow$ **ACCEPTED**.
   - `Non-Commercial (NC)` or `No-Derivatives (ND)` $\rightarrow$ **REJECTED** (conflicts with open public banner reusability).
   - If license is indeterminate $\rightarrow$ Flag as `UNKNOWN` and do not deploy to public banners until manually verified.

---

## 3. Editorial Synthesis Guidelines

1. **Original Biographic Synthesis**:
   - Never copy entire paragraphs from external sources verbatim.
   - Summarize facts into 200–350 words of original, dignified, objective narrative.
2. **Succinct Action Bullets**:
   - Extract 3–5 bullet points representing specific historical actions, battles, legal changes, scientific discoveries, or institutional reforms.
   - Max length per bullet: 140 characters (optimized for banner legibility).
3. **Primary Attribution Display**:
   - Every hero profile and generated banner must explicitly credit the primary documentary source and image license.
