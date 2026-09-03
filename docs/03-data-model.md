# Database Schema & Relational Data Model
**Project Name**: Unsung Heroes of India (Multilingual Platform & Banner Factory)  
**Document**: `docs/03-data-model.md`  
**Phase**: Phase 1 — System Architecture & Data Model  
**Status**: Draft for Review  

---

## 1. Entity-Relationship Diagram (Logical)

```
        ┌───────────────┐                  ┌───────────────────┐
        │     users     │ 1              * │    submissions    │
        │ (Admin/Mod)   ├──────────────────┤ (Community Queue) │
        └───────┬───────┘                  └─────────┬─────────┘
                │ 1                                  │
                │                                    │ 1 (Upon Approval)
                ▼ *                                  ▼
        ┌───────────────┐                  ┌───────────────────┐
        │moderation_logs│                  │      heroes       │◄─────────────┐
        └───────────────┘                  └─┬───┬───┬───┬───┬─┘              │
                                             │   │   │   │   │                │
            ┌────────────────────────────────┘   │   │   │   └────────────┐   │
            │ 1                                1 │   │ 1 │ 1            1 │   │ *
            ▼ *                                  ▼ * │   ▼ *              ▼ * │
    ┌───────────────┐                  ┌───────────┐ │ ┌───────────┐ ┌────────┴──────────┐
    │ contributions │                  │ timeline  │ │ │  sources  │ │ generated_banners │
    │ (Key Bullets) │                  │  _events  │ │ └───────────┘ └───────────────────┘
    └───────────────┘                  └───────────┘ │
                                                     │ 1
                                                     ▼ *
                                               ┌───────────┐
                                               │hero_tags  │
                                               └─────┬─────┘
                                                   * │
                                                     │ 1
                                                     ▼
                                               ┌───────────┐
                                               │   tags    │
                                               └───────────┘
```

---

## 2. PostgreSQL DDL Schema (Production-Grade)

```sql
-- Enable necessary PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- -----------------------------------------------------------------------------
-- 1. USERS TABLE (Admins, Moderators, Editors)
-- -----------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM ('ADMIN', 'MODERATOR', 'EDITOR', 'CONTRIBUTOR');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role user_role NOT NULL DEFAULT 'CONTRIBUTOR',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_users_email ON users(email);

-- -----------------------------------------------------------------------------
-- 2. HEROES TABLE (Core Entity)
-- -----------------------------------------------------------------------------
CREATE TABLE heroes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(200) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    name_local VARCHAR(200),
    name_local_lang VARCHAR(10) DEFAULT 'hi', -- ISO 639-1 code (e.g., hi, bn, ta, te)
    birth_year INT,
    death_year INT,
    era VARCHAR(100), -- e.g., '1857 Revolt', 'Early Nationalist Era (1885-1919)'
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    primary_domain VARCHAR(100) NOT NULL, -- Freedom Struggle, Science, Social Reform, etc.
    short_bio TEXT NOT NULL,
    tagline VARCHAR(200) NOT NULL,
    is_unsung_reason TEXT NOT NULL,
    
    -- Portrait & Licensing Metadata
    image_url TEXT NOT NULL,
    image_license VARCHAR(50) NOT NULL CHECK (image_license IN (
        'CC0',
        'CC-BY-4.0',
        'CC-BY-SA-4.0',
        'PUBLIC_DOMAIN',
        'UNKNOWN'
    )),
    image_attribution VARCHAR(300) NOT NULL,
    image_source_page_url TEXT,
    
    -- Verification & Publication Flags
    is_verified BOOLEAN NOT NULL DEFAULT TRUE,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    view_count INT NOT NULL DEFAULT 0,
    banner_download_count INT NOT NULL DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Full Text Search Vector
    search_vector TSVECTOR
);

CREATE INDEX idx_heroes_slug ON heroes(slug);
CREATE INDEX idx_heroes_state ON heroes(state);
CREATE INDEX idx_heroes_domain ON heroes(primary_domain);
CREATE INDEX idx_heroes_search ON heroes USING GIN(search_vector);

-- -----------------------------------------------------------------------------
-- 3. CONTRIBUTIONS TABLE (3-5 Succinct Fact-Checked Bullet Points)
-- -----------------------------------------------------------------------------
CREATE TABLE contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hero_id UUID NOT NULL REFERENCES heroes(id) ON DELETE CASCADE,
    display_order INT NOT NULL DEFAULT 1,
    title VARCHAR(200),
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_contributions_hero ON contributions(hero_id, display_order);

-- -----------------------------------------------------------------------------
-- 4. TIMELINE EVENTS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE timeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hero_id UUID NOT NULL REFERENCES heroes(id) ON DELETE CASCADE,
    event_year INT NOT NULL,
    event_date VARCHAR(50), -- e.g., "12 August 1942" or "Circa 1895"
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_timeline_hero ON timeline_events(hero_id, event_year);

-- -----------------------------------------------------------------------------
-- 5. SOURCES TABLE (Primary Provenance & Citations)
-- -----------------------------------------------------------------------------
CREATE TYPE source_type AS ENUM (
    'GOVERNMENT_ARCHIVE',  -- National Archives (Abhilekh-Patal)
    'GOVERNMENT_PORTAL',   -- Indian Culture Portal, PIB, OGD
    'ACADEMIC_PUBLICATION',-- CSIR Science Reporter, Peer-reviewed paper, University press
    'HISTORICAL_BOOK',     -- Documented biography, Gazetteer
    'COMMONS_MEDIA'        -- Wikimedia Commons
);

CREATE TABLE sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hero_id UUID NOT NULL REFERENCES heroes(id) ON DELETE CASCADE,
    title VARCHAR(300) NOT NULL,
    source_type source_type NOT NULL,
    url TEXT,
    archive_ref_no VARCHAR(150), -- e.g., NAI File No. / Gazette reference
    publisher_or_institution VARCHAR(200),
    is_primary_reference BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_sources_hero ON sources(hero_id);

-- -----------------------------------------------------------------------------
-- 6. TAGS & HERO_TAGS (State, Domain, Language, Era, Category)
-- -----------------------------------------------------------------------------
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'state', 'domain', 'era', 'language'
    slug VARCHAR(120) UNIQUE NOT NULL
);

CREATE TABLE hero_tags (
    hero_id UUID NOT NULL REFERENCES heroes(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (hero_id, tag_id)
);

CREATE INDEX idx_hero_tags_tag ON hero_tags(tag_id);

-- -----------------------------------------------------------------------------
-- 7. SUBMISSIONS TABLE (Community Suggestion Queue)
-- -----------------------------------------------------------------------------
CREATE TYPE submission_status AS ENUM (
    'SUBMITTED',
    'UNDER_REVIEW',
    'APPROVED',
    'REJECTED',
    'REVISION_REQUESTED'
);

CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submitter_name VARCHAR(150) NOT NULL,
    submitter_email VARCHAR(255) NOT NULL,
    hero_name VARCHAR(200) NOT NULL,
    hero_name_local VARCHAR(200),
    state VARCHAR(100) NOT NULL,
    primary_domain VARCHAR(100) NOT NULL,
    birth_year INT,
    death_year INT,
    short_bio TEXT NOT NULL,
    key_contributions JSONB NOT NULL, -- Array of strings/bullets
    sources_text TEXT NOT NULL,       -- Citation URLs / Book references
    image_url TEXT,
    image_license_declared VARCHAR(50),
    status submission_status NOT NULL DEFAULT 'SUBMITTED',
    rejection_reason TEXT,
    reviewed_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_submissions_status ON submissions(status);

-- -----------------------------------------------------------------------------
-- 8. MODERATION LOGS TABLE (Audit Trail)
-- -----------------------------------------------------------------------------
CREATE TABLE moderation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID REFERENCES submissions(id) ON DELETE SET NULL,
    hero_id UUID REFERENCES heroes(id) ON DELETE SET NULL,
    moderator_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(50) NOT NULL, -- 'APPROVE', 'REJECT', 'EDIT_PUBLISHED', 'TAKEDOWN'
    notes TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- -----------------------------------------------------------------------------
-- 9. BANNER TEMPLATES & GENERATION LOGS
-- -----------------------------------------------------------------------------
CREATE TABLE banner_templates (
    id VARCHAR(50) PRIMARY KEY, -- 'roadside_billboard', 'metro_pillar', 'bus_stop', 'college_board_a3'
    name VARCHAR(150) NOT NULL,
    aspect_ratio VARCHAR(20) NOT NULL,
    width_px INT NOT NULL,
    height_px INT NOT NULL,
    format_type VARCHAR(20) NOT NULL, -- 'DIGITAL_RASTER', 'PRINT_VECTOR_PDF'
    layout_config JSONB NOT NULL,     -- Placement coordinates for portrait, QR, text
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE generated_banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hero_id UUID NOT NULL REFERENCES heroes(id) ON DELETE CASCADE,
    template_id VARCHAR(50) NOT NULL REFERENCES banner_templates(id),
    language_pair VARCHAR(20) NOT NULL, -- 'en-hi', 'en-bn', 'en-ta'
    theme_color VARCHAR(30) NOT NULL DEFAULT 'saffron_navy',
    download_format VARCHAR(10) NOT NULL, -- 'png', 'pdf'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_generated_banners_hero ON generated_banners(hero_id);
```

---

## 3. Seed Example Data (Verification & Schema Demonstration)

```sql
-- Insert Seed Banner Templates
INSERT INTO banner_templates (id, name, aspect_ratio, width_px, height_px, format_type, layout_config) VALUES
('metro_pillar', 'Metro Pillar Vertical Signage', '9:16', 1080, 1920, 'DIGITAL_RASTER', '{"qr_pos": [880, 1720], "portrait_box": [60, 200, 960, 1000]}'),
('roadside_billboard', 'Roadside Landscape Billboard', '16:9', 1920, 1080, 'DIGITAL_RASTER', '{"qr_pos": [1720, 880], "portrait_box": [80, 80, 600, 920]}'),
('college_board_a3', 'College Notice Board Print A3', '1:1.414', 3508, 4960, 'PRINT_VECTOR_PDF', '{"qr_pos": [3100, 4500], "dpi": 300}');

-- Insert Seed Hero: Matangini Hazra (West Bengal Freedom Fighter)
INSERT INTO heroes (
    id, slug, name, name_local, name_local_lang, birth_year, death_year, era,
    state, district, primary_domain, tagline, short_bio, is_unsung_reason,
    image_url, image_license, image_attribution, image_source_page_url
) VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'matangini-hazra',
    'Matangini Hazra (Gandhi Buri)',
    'মাতঙ্গিনী হাজরা',
    'bn',
    1870,
    1942,
    'Quit India Movement (1942)',
    'West Bengal',
    'Tamluk, Purba Medinipur',
    'Freedom Struggle',
    'The 72-year-old martyr who kept the Indian flag aloft while facing British bullets in Tamluk.',
    'Matangini Hazra was an Indian revolutionary who participated in the Indian independence movement until she was shot dead by the British Indian police in front of the Tamluk Police Station on 29 September 1942. Affectionately known as "Gandhi Buri" (Old Lady Gandhi), she led a procession of six thousand volunteers, mostly women, to take over the Tamluk police station during the Quit India movement.',
    'Despite her supreme sacrifice holding the tricolor aloft until her last breath, her story is rarely taught in mainstream national school curricula outside West Bengal.',
    'https://upload.wikimedia.org/wikipedia/commons/4/4b/Matangini_Hazra.jpg',
    'PUBLIC_DOMAIN',
    'Public Domain (Photograph taken circa 1942 in British India, copyright expired)',
    'https://commons.wikimedia.org/wiki/File:Matangini_Hazra.jpg'
);

-- Insert Bullet Contributions for Matangini Hazra
INSERT INTO contributions (hero_id, display_order, title, description) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1, 'Quit India Movement Martyrdom', 'Led a peaceful procession of 6,000 freedom fighters in Tamluk at age 72, continuing to chant Vande Mataram even after being shot multiple times.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 2, 'Salt Satyagraha Participant', 'Active participant in the 1930 Civil Disobedience and Salt Satyagraha movements, enduring multiple arrests and physical imprisonment.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 3, 'First Woman Statue in Independent Kolkata', 'Recognized posthumously as the first woman freedom fighter to have a statue erected in Kolkata Maidan in independent India (1977).');

-- Insert Sources for Matangini Hazra
INSERT INTO sources (hero_id, title, source_type, url, publisher_or_institution, is_primary_reference) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Press Information Bureau: Women in India’s Freedom Struggle', 'GOVERNMENT_PORTAL', 'https://pib.gov.in', 'Press Information Bureau, Ministry of Information and Broadcasting', TRUE),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'National Archives of India Freedom Struggle Records (NAI File Ref: 1942 Tamluk Incident)', 'GOVERNMENT_ARCHIVE', 'https://www.abhilekhpatal.in', 'National Archives of India', FALSE);
```
