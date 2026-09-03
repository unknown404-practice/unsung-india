# Search Engine Design, Tokenization & Ranking Algorithms
**Project Name**: Unsung India Search  
**Document**: `docs/05-search-design.md`  
**Phase**: Phase 0 & 1 — Search Design Specification  
**Status**: Completed  

---

## 1. Search Engine Architecture

The search engine operates entirely on **locally pre-indexed data**, ensuring near-zero query-time latency ($< 35\text{ms}$) without calling external APIs at runtime.

```
                           [ User Query: "susruta plastic surgery" ]
                                              │
                                              ▼
                           [ Query Normalizer & Parser ]
                               ├── Strip special characters
                               ├── Lowercase & trim
                               ├── Extract potential State / Domain facets
                               └── Generate Trigram / Metaphone phonetics
                                              │
                                              ▼
                           [ Multi-Vector Execution Engine ]
                                              │
        ┌─────────────────────────────────────┼─────────────────────────────────────┐
        │                                     │                                     │
        ▼                                     ▼                                     ▼
[ Exact & Prefix Match ]            [ GIN Full-Text Search ]              [ Trigram Fuzzy Match ]
- `name ILIKE 'sush%'`              - `search_vector @@ to_tsquery`       - `similarity(name, q) > 0.3`
- `name_local = 'सुश्रुत'`           - Weighted: Name (A), Tagline (B),    - Typo tolerance for misspelling
- Weight: 1.0                         Bio (C), Domain (D)                 - Weight: 0.7
        │                                     │                                     │
        └─────────────────────────────────────┼─────────────────────────────────────┘
                                              │
                                              ▼
                             [ Composite Ranking Function ]
                   Score = 0.40 * ExactMatch + 0.35 * FTS_Rank + 
                           0.15 * TrigramSim + 0.10 * DataCompleteness
                                              │
                                              ▼
                             [ Result Set with Snippet Highlighting ]
                                 (Returned in < 35ms)
```

---

## 2. PostgreSQL GIN Indexing & Vector Configuration

### 2.1 Full-Text Search Weighting Configuration
```sql
-- Search Vector Column in 'heroes' table:
-- Weight 'A': Primary Name and Native Indic Script Names
-- Weight 'B': Primary Domain, State, District, and Tagline
-- Weight 'C': Key Contributions Bullet Points and Why Unsung Reason
-- Weight 'D': Short Biography text

ALTER TABLE heroes ADD COLUMN search_vector TSVECTOR;

CREATE OR REPLACE FUNCTION update_hero_search_vector() RETURNS trigger AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
        setweight(to_tsvector('simple', coalesce(NEW.name_local, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(NEW.primary_domain, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(NEW.state, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(NEW.tagline, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(NEW.is_unsung_reason, '')), 'C') ||
        setweight(to_tsvector('english', coalesce(NEW.short_bio, '')), 'D');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_hero_search_vector_update
BEFORE INSERT OR UPDATE ON heroes
FOR EACH ROW EXECUTE FUNCTION update_hero_search_vector();

-- GIN Index for sub-millisecond full-text queries
CREATE INDEX idx_heroes_fts_gin ON heroes USING GIN(search_vector);

-- Trigram Index for fuzzy typo tolerance
CREATE INDEX idx_heroes_trgm_name ON heroes USING GIN(name gin_trgm_ops);
CREATE INDEX idx_heroes_trgm_tagline ON heroes USING GIN(tagline gin_trgm_ops);
```

---

## 3. Typo-Tolerance & Transliteration Strategy

1. **Indic Script Mapping**: When a query in Latin script matches common Indic phonemes (e.g., *"Sushrut"*, *"Shushruta"*, *"Sushrutha"*), the system normalizes through phonetic equivalence mapping.
2. **Trigram Similarity (`pg_trgm`)**: If an exact full-text query returns 0 matches, the system automatically falls back to trigram threshold matching:
   ```sql
   SELECT id, slug, name, similarity(name, 'susruta') AS score
   FROM heroes
   WHERE similarity(name, 'susruta') > 0.35 OR name ILIKE '%susruta%'
   ORDER BY score DESC
   LIMIT 10;
   ```
3. **Faceted Intent Extraction**: If the query contains known geographic or domain tokens (e.g., *"women scientists from Bengal"*), the query parser extracts:
   - `domain = "Science & Tech"`
   - `state = "West Bengal"`
   - `gender = "Female"`
   and executes a precision-filtered query.

---

## 4. Ranking Formula

The ranking function balances text relevance, completeness of documentation, and historical provenance:

$$\text{FinalScore} = (w_1 \cdot \text{ExactNameMatch}) + (w_2 \cdot \text{ts\_rank\_cd}) + (w_3 \cdot \text{TrigramSimilarity}) + (w_4 \cdot \text{ProvenanceBonus})$$

Where:
- $w_1 = 0.40$ (Exact / prefix name match)
- $w_2 = 0.35$ (Cover-density ranking on search vector)
- $w_3 = 0.15$ (Trigram string similarity)
- $w_4 = 0.10$ (Provenance bonus for entries with $\ge 2$ verified primary archive references)
