# Moderation, Editorial Policy & Community Governance
**Project Name**: Unsung Heroes of India (Multilingual Platform & Banner Factory)  
**Document**: `docs/09-moderation-and-editorial.md`  
**Phase**: Phase 6 — Community, Moderation & Admin Dashboard  
**Status**: Completed  

---

## 1. Editorial Mission & Anti-Hallucination Mandate

The **Unsung Heroes of India** catalog spans the full spectrum of Indian history—from **Ancient Pioneers** (medicine, astronomy, mathematics, philosophy) to **Medieval Resistance Leaders**, the **Freedom Struggle** (tribal rebellions, regional uprisings, revolutionary movements), **Scientific Pioneers**, and **Social Reformers**.

To preserve trust as a national public digital asset:
1. **Zero Unverified Folklore**: Every profile must have documentary provenance (State Archives, PIB, Indian Culture Portal, National Archives, CSIR, or recognized peer-reviewed historiography).
2. **Original Biographical Synthesis**: Neutral, respectful, fact-based summaries (150–350 words) written originally to maintain copyright integrity.
3. **Safe Media Licensing**: Only portraits with explicit `CC0`, `CC-BY`, `CC-BY-SA`, or verified `Public Domain` designations are approved.

---

## 2. Submission & Moderation Lifecycle (State Machine)

```
[ Public Contributor ]
        │
        ▼ (POST /api/v1/submissions)
+───────────────────────────────────────────────+
|               SUBMITTED                       |
| Metadata, Citations & Image License Declared  |
+───────────────────────┬───────────────────────+
                        │
                        ▼ (Moderator Claims)
+───────────────────────────────────────────────+
|              UNDER_REVIEW                     |
| Cross-referencing against PIB / NAI / ICP     |
+───────────────┬───────────────────────────────+
                │
        ┌───────┴───────────────────────────────┐
        │                                       │
        ▼ (Approve & Publish)                   ▼ (Reject with Reason)
+───────────────────────────+   +───────────────────────────+
|         APPROVED          |   |         REJECTED          |
|  - Live Hero Record Born  |   |  - Audit reason stored    |
|  - Bullet items attached  |   |  - Notification recorded  |
|  - QR Code Generated      |   +───────────────────────────+
+───────────────────────────+
```

---

## 3. Moderation Roles & Permissions

| Role | Permissions | Responsibilities |
| :--- | :--- | :--- |
| **CONTRIBUTOR** | Submit proposals via `/suggest`, view submission status. | Provide accurate primary source references and historical details. |
| **MODERATOR** | Review `/admin/submissions`, verify citations, edit metadata, approve/reject submissions. | Verify facts against official archives, ensure image licensing safety. |
| **ADMIN** | Full CRUD on heroes, users, templates, takedown management, and audit logs. | System administration, user onboarding, bulk ingestion oversight. |

---

## 4. Takedown & Correction Policy

1. If any factual inaccuracy, disputed claim, or copyright infringement notice is received:
   - The record is immediately transitioned to `is_published = FALSE` pending investigation.
   - Editorial board reviews primary archival records within 48 hours.
   - A documented correction log is recorded in `moderation_logs`.
