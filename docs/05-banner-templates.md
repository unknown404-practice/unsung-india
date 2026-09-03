# Banner Templates & Physical Signage Specifications
**Project Name**: Unsung Heroes of India (Multilingual Platform & Banner Factory)  
**Document**: `docs/05-banner-templates.md`  
**Phase**: Phase 4 — Banner Factory Implementation  
**Status**: Completed  

---

## 1. Overview & Signage Typology

The **Banner Factory** generates publication-ready digital signage and high-DPI physical print assets for civic and educational spaces across India. Every template complies with:
1. **High Visual Contrast**: Legible from a distance of 3 to 15 meters in bustling public environments (transit hubs, corridors, roadsides).
2. **Bilingual Typography**: Prominent display in English alongside native Indic scripts (Devanagari, Bengali, Tamil, Telugu, Assamese, etc.).
3. **Interactive Bridging**: Embedded vector QR code linking directly to the hero's canonical profile URL on the DPI platform.
4. **Copyright & Source Transparency**: Mandatory attribution watermark preserving copyright hygiene and official institutional provenance.

```
+─────────────────────────────────────────────────────────────────────────────+
|                             SIGNAGE MATRIX                                  |
+───────────────────────────┬─────────────┬──────────────┬────────────────────+
| Template ID               | Aspect / Sz | Resolution   | Target Environment |
+───────────────────────────┼─────────────┼──────────────┼────────────────────+
| 1. `metro_pillar`         | 9:16 Port.  | 1080x1920 px | Metro Rail Pillars |
| 2. `roadside_billboard`   | 16:9 Land.  | 1920x1080 px | Highways & Roads   |
| 3. `bus_stop`             | 3:4 Medium  | 1200x1600 px | Transit Shelters   |
| 4. `college_board_a3`     | ISO A3      | 3508x4960 px | College Notice Bds |
+───────────────────────────┴─────────────┴──────────────┴────────────────────+
```

---

## 2. Template Specifications & Coordinate Grid

### 2.1 Template 1: Metro Pillar (`metro_pillar`)
- **Aspect Ratio**: `9:16` (Vertical Transit Pillar / Digital Totem)
- **Dimensions**: `1080 × 1920 px` (72–150 DPI for Digital Screens)
- **Target Context**: DMRC, BMRCL, Kolkata Metro, and Maha Metro concourse pillars.
- **Layout Grid**:
  ```
  +-----------------------------------------------------------+ (0,0)
  | [Tiranga Tricolor Accent Strip - 24px]                    | (0, 0) -> (1080, 24)
  | Platform Header: UNSUNG HEROES OF INDIA (Font: 36px)     | (60, 80)
  |-----------------------------------------------------------|
  | HERO NAME (Primary Font: 54px Bold)                       | (60, 150)
  | Local Script Name: (Font: 34px Indic)                     | (60, 215)
  | Metadata: State | Domain | Years (Font: 26px Monospace)  | (60, 260)
  |-----------------------------------------------------------|
  | Tagline Card: "..." (Card: 960x90px, Font: 26px Italic)   | (60, 300)
  |-----------------------------------------------------------|
  | High-Res Portrait Frame (Max: 960x650px)                  | (60, 410) -> (1020, 1060)
  |-----------------------------------------------------------|
  | KEY CONTRIBUTIONS & SACRIFICES: (Font: 30px Saffron)     | (60, 1100)
  | • Bullet 1 (Font: 24px, Max 130 chars)                   | (60, 1150)
  | • Bullet 2 (Font: 24px, Max 130 chars)                   | (60, 1200)
  | • Bullet 3 (Font: 24px, Max 130 chars)                   | (60, 1250)
  |-----------------------------------------------------------|
  | [Scan QR Box: 140x140px] pointing to /heroes/{slug}       | (880, 1680)
  | Mandatory Attribution Watermark: Sources + Image License  | (60, 1860)
  +-----------------------------------------------------------+ (1080,1920)
  ```

---

### 2.2 Template 2: Roadside Billboard (`roadside_billboard`)
- **Aspect Ratio**: `16:9` (Landscape LED Display / Over-bridge Hoarding)
- **Dimensions**: `1920 × 1080 px`
- **Target Context**: Municipal highways, arterial flyovers, railway platform overheads.
- **Layout Grid (Horizontal Dual-Column)**:
  - **Left Column (X: 60 to 760)**: High-resolution hero portrait framed in rounded container with dark vignette.
  - **Right Column (X: 820 to 1860)**:
    - National DPI Banner & State Origin.
    - Hero Name in 64px display bold + native script in 40px.
    - Prominent biographic quote / tagline in callout box.
    - 3 concise bullet sacrifices.
    - Bottom Right: High-contrast 160×160px vector QR code + provenance line.

---

### 2.3 Template 3: Bus Stop Transit Panel (`bus_stop`)
- **Aspect Ratio**: `3:4` (Vertical Panel / Commuter Kiosk)
- **Dimensions**: `1200 × 1600 px`
- **Target Context**: State transport bus stations, shelter side panels, smart city digital kiosks.
- **Layout Grid**:
  - Balanced vertical structure optimized for pedestrian reading speed (under 15 seconds).
  - Centered hero portrait with high-contrast saffron border.
  - 3 large, legible bullet points summarizing decisive national impact.

---

### 2.4 Template 4: College / School Notice Board (`college_board_a3`)
- **Format**: `ISO A3 Print PDF`
- **Dimensions**: `3508 × 4960 px` (at 300 DPI true CMYK print resolution)
- **Target Context**: School classrooms, university history departments, public libraries, cultural bhavans.
- **Print Enhancements**:
  - 5mm safety bleed margin on all four edges.
  - CMYK color profile compatibility (`#FFFFFF` background in mono theme for zero-waste eco-printing).
  - Complete chronological timeline embedded alongside bullet contributions.
  - Verified primary bibliography citations printed at footer for academic referencing.

---

## 3. Color Palettes & Visual Themes

| Theme ID | Background | Primary Text | Accent 1 (Saffron) | Accent 2 (Green) | Use Case |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `saffron_navy` | `#0A0E1A` (Deep Midnight) | `#F8FAFC` (White) | `#FF6B00` (Saffron Glow) | `#10B981` (Emerald) | Digital Screens & Metro Totems |
| `tricolor_minimal` | `#F8FAFC` (Slate Light) | `#0F172A` (Navy Ink) | `#EA580C` (Dark Saffron) | `#046A38` (Tiranga Green) | Outdoor Lit Shelters |
| `print_clean_white` | `#FFFFFF` (Pure White) | `#000000` (True Black) | `#C2410C` (Deep Rust) | `#15803D` (Forest Green) | Classroom A3/A2 Paper Printing |

---

## 4. QR Code & Vector Integration Rules

1. **Error Correction Level**: Level `M` (15% recovery) or Level `Q` (25% recovery) to ensure scannability even on dusty, curved, or partially shadowed physical pillars.
2. **Quiet Zone**: Minimum 4 modules (white border margin) surrounding the QR matrix.
3. **Canonical Payload Target**: Direct HTTPS URL `https://unsung-heroes.vercel.app/heroes/{slug}` without intermediate redirect hops.
