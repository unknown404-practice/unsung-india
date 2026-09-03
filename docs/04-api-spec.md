# REST API Specification (OpenAPI Blueprint)
**Project Name**: Unsung Heroes of India (Multilingual Platform & Banner Factory)  
**Document**: `docs/04-api-spec.md`  
**Phase**: Phase 1 — System Architecture & Data Model  
**Status**: Draft for Review  

---

## 1. Overview & Conventions

- **Base URL**: `/api/v1`
- **Content-Type**: `application/json; charset=utf-8`
- **Binary Responses**: `image/png`, `image/webp`, `application/pdf`
- **Authentication**: Bearer JWT tokens for admin/moderator endpoints (`Authorization: Bearer <token>`).
- **Standard Error Format**:
  ```json
  {
    "error": {
      "code": "RESOURCE_NOT_FOUND",
      "message": "Hero with slug 'unknown-hero' was not found.",
      "details": null
    }
  }
  ```

---

## 2. Public Read Endpoints

### 2.1 List & Search Heroes
- **Endpoint**: `GET /api/v1/heroes`
- **Query Parameters**:
  - `q` (string, optional): Full-text keyword search query.
  - `state` (string, optional): Filter by Indian state (e.g., `West Bengal`, `Assam`, `Maharashtra`).
  - `domain` (string, optional): Filter by domain (e.g., `Freedom Struggle`, `Science`, `Social Reform`).
  - `era` (string, optional): Filter by era/time period.
  - `page` (integer, default: 1): Page number.
  - `limit` (integer, default: 12, max: 50): Number of items per page.
  - `sort_by` (string, default: `created_at`): `name`, `birth_year`, `views`.
- **Response `200 OK`**:
  ```json
  {
    "data": [
      {
        "id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        "slug": "matangini-hazra",
        "name": "Matangini Hazra (Gandhi Buri)",
        "name_local": "মাতঙ্গিনী হাজরা",
        "name_local_lang": "bn",
        "birth_year": 1870,
        "death_year": 1942,
        "state": "West Bengal",
        "primary_domain": "Freedom Struggle",
        "tagline": "The 72-year-old martyr who kept the Indian flag aloft while facing British bullets in Tamluk.",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/4/4b/Matangini_Hazra.jpg",
        "image_license": "PUBLIC_DOMAIN",
        "image_attribution": "Public Domain (1942)",
        "created_at": "2026-09-03T06:45:00Z"
      }
    ],
    "pagination": {
      "total_records": 1,
      "total_pages": 1,
      "current_page": 1,
      "limit": 12
    }
  }
  ```

---

### 2.2 Get Hero Profile Details
- **Endpoint**: `GET /api/v1/heroes/{slug_or_id}`
- **Parameters**: `slug_or_id` (string: UUID or URL slug).
- **Response `200 OK`**:
  ```json
  {
    "id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "slug": "matangini-hazra",
    "name": "Matangini Hazra (Gandhi Buri)",
    "name_local": "মাতঙ্গিনী হাজরা",
    "name_local_lang": "bn",
    "birth_year": 1870,
    "death_year": 1942,
    "era": "Quit India Movement (1942)",
    "state": "West Bengal",
    "district": "Tamluk, Purba Medinipur",
    "primary_domain": "Freedom Struggle",
    "tagline": "The 72-year-old martyr who kept the Indian flag aloft while facing British bullets in Tamluk.",
    "short_bio": "Matangini Hazra was an Indian revolutionary who participated in the Indian independence movement until she was shot dead by the British Indian police in front of the Tamluk Police Station on 29 September 1942...",
    "is_unsung_reason": "Despite her supreme sacrifice holding the tricolor aloft until her last breath, her story is rarely taught in mainstream national school curricula outside West Bengal.",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/4/4b/Matangini_Hazra.jpg",
    "image_license": "PUBLIC_DOMAIN",
    "image_attribution": "Public Domain (Photograph taken circa 1942 in British India, copyright expired)",
    "image_source_page_url": "https://commons.wikimedia.org/wiki/File:Matangini_Hazra.jpg",
    "contributions": [
      {
        "id": "c1aebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
        "display_order": 1,
        "title": "Quit India Movement Martyrdom",
        "description": "Led a peaceful procession of 6,000 freedom fighters in Tamluk at age 72, continuing to chant Vande Mataram even after being shot multiple times."
      }
    ],
    "timeline_events": [
      {
        "id": "t1aebc99-9c0b-4ef8-bb6d-6bb9bd380a33",
        "event_year": 1942,
        "event_date": "29 September 1942",
        "title": "Martyrdom at Tamluk",
        "description": "Shot three times while leading the Quit India rally; kept the tricolor erect."
      }
    ],
    "sources": [
      {
        "id": "s1aebc99-9c0b-4ef8-bb6d-6bb9bd380a44",
        "title": "Press Information Bureau: Women in India’s Freedom Struggle",
        "source_type": "GOVERNMENT_PORTAL",
        "url": "https://pib.gov.in",
        "publisher_or_institution": "Press Information Bureau, Ministry of Information and Broadcasting",
        "is_primary_reference": true
      }
    ],
    "tags": ["Freedom Struggle", "West Bengal", "Quit India", "Women Martyrs"]
  }
  ```

---

## 3. Banner Factory Endpoints

### 3.1 List Banner Templates
- **Endpoint**: `GET /api/v1/banners/templates`
- **Response `200 OK`**:
  ```json
  {
    "templates": [
      {
        "id": "metro_pillar",
        "name": "Metro Pillar Vertical Signage",
        "aspect_ratio": "9:16",
        "width_px": 1080,
        "height_px": 1920,
        "format_type": "DIGITAL_RASTER",
        "supported_themes": ["saffron_navy", "tricolor_minimal", "vintage_parchment"]
      },
      {
        "id": "roadside_billboard",
        "name": "Roadside Landscape Billboard",
        "aspect_ratio": "16:9",
        "width_px": 1920,
        "height_px": 1080,
        "format_type": "DIGITAL_RASTER",
        "supported_themes": ["saffron_navy", "tricolor_minimal"]
      },
      {
        "id": "college_board_a3",
        "name": "College Notice Board Print A3",
        "aspect_ratio": "1:1.414",
        "width_px": 3508,
        "height_px": 4960,
        "format_type": "PRINT_VECTOR_PDF",
        "supported_themes": ["print_clean_white", "saffron_navy"]
      }
    ]
  }
  ```

---

### 3.2 Render & Download Banner
- **Endpoint**: `POST /api/v1/banners/render`
- **Request Body**:
  ```json
  {
    "hero_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "template_id": "metro_pillar",
    "language_pair": "en-hi",
    "theme": "saffron_navy",
    "format": "png"
  }
  ```
- **Response `200 OK`**:
  - `Content-Type`: `image/png` (or `application/pdf`)
  - `Content-Disposition`: `attachment; filename="unsung-hero-matangini-hazra-metro-pillar.png"`
  - Body: Binary image stream.

---

## 4. Community Submissions & Public Contributions

### 4.1 Submit a Hero Proposal
- **Endpoint**: `POST /api/v1/submissions`
- **Request Body**:
  ```json
  {
    "submitter_name": "Dr. Ananya Sen",
    "submitter_email": "ananya.sen@example.ac.in",
    "hero_name": "Tirot Sing",
    "hero_name_local": "ইউ তিৰত সিং",
    "state": "Meghalaya",
    "primary_domain": "Freedom Struggle",
    "birth_year": 1802,
    "death_year": 1835,
    "short_bio": "U Tirot Sing Syiem was a native Khasi chief of Nongkhlaw who led the Anglo-Khasi War (1829-1833) resisting British attempts to construct a road through Khasi hills.",
    "key_contributions": [
      "Led the indigenous Khasi armed resistance against the British East India Company (1829-1833).",
      "Employed guerilla mountain warfare tactics effectively defending tribal sovereignty for 4 years.",
      "Celebrated as the national hero of Meghalaya with state holiday on 17 July (U Tirot Sing Day)."
    ],
    "sources_text": "PIB Article on Tribal Freedom Fighters (https://pib.gov.in); Meghalaya State Archives gazetteer.",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/U_Tirot_Sing.jpg/800px-U_Tirot_Sing.jpg",
    "image_license_declared": "PUBLIC_DOMAIN"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "id": "e4aebc99-9c0b-4ef8-bb6d-6bb9bd380a55",
    "status": "SUBMITTED",
    "message": "Hero submission successfully received. Our editorial team will verify sources within 48-72 hours."
  }
  ```

---

## 5. Protected Admin & Moderation Endpoints

### 5.1 Admin Authentication (JWT Login)
- **Endpoint**: `POST /api/v1/admin/auth/login`
- **Request Body (`OAuth2PasswordRequestForm` / JSON)**:
  ```json
  {
    "username": "editor@unsungheroes.gov.in",
    "password": "secure_admin_password"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "user": {
      "id": "u1aebc99-9c0b-4ef8-bb6d-6bb9bd380a99",
      "email": "editor@unsungheroes.gov.in",
      "full_name": "Chief Editor",
      "role": "ADMIN"
    }
  }
  ```

---

### 5.2 List Submissions (Moderation Queue)
- **Endpoint**: `GET /api/v1/admin/submissions`
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**: `status` (`SUBMITTED`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`), `page`, `limit`.
- **Response `200 OK`**: Returns paginated list of pending submissions with full provenance fields.

---

### 5.3 Approve & Publish Submission
- **Endpoint**: `POST /api/v1/admin/submissions/{id}/approve`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body (Optional edits before publishing)**:
  ```json
  {
    "slug": "tirot-sing",
    "tagline": "The Khasi tribal chief who fought the British Empire in the Khasi Hills (1829–1833).",
    "editorial_notes": "Verified against PIB Tribal Heroes archive."
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "message": "Submission approved and published to the live catalog.",
    "hero_id": "b1aebc99-9c0b-4ef8-bb6d-6bb9bd380a66",
    "hero_slug": "tirot-sing"
  }
  ```

---

### 5.4 Reject Submission
- **Endpoint**: `POST /api/v1/admin/submissions/{id}/reject`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "reason": "Insufficient primary source verification. The provided URL is not accessible or lacks historical citations."
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "message": "Submission rejected.",
    "submission_id": "e4aebc99-9c0b-4ef8-bb6d-6bb9bd380a55"
  }
  ```
