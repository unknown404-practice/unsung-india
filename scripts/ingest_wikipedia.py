import asyncio
import os
import sys
import json
import re

# Ensure backend/src is on the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend", "src")))

from app.wikipedia.client import WikipediaClient
from app.heroes.models import Hero, Contribution, Source, SourceType
from app.db import AsyncSessionLocal, engine
from sqlalchemy import select

SEED_CANDIDATES = [
    {
        "search_title": "Tirot Sing",
        "state": "Meghalaya",
        "primary_domain": "Freedom Struggle",
        "tagline": "The Khasi tribal chief who fought the British Empire for four years to protect indigenous sovereignty.",
        "is_unsung_reason": "Tribal resistance movements in North-East India predating 1857 are rarely highlighted in standard national history curricula.",
    },
    {
        "search_title": "Kanaklata Barua",
        "state": "Assam",
        "primary_domain": "Freedom Struggle",
        "tagline": "The 17-year-old Assamese martyr who gave her life hoisting the National Tricolor at Gohpur Police Station.",
        "is_unsung_reason": "One of the youngest female martyrs of the freedom movement whose extraordinary sacrifice is often confined to regional North-East remembrance.",
    },
    {
        "search_title": "Janaki Ammal",
        "state": "Kerala",
        "primary_domain": "Science & Tech",
        "tagline": "India’s pioneering cytogeneticist and botanist who developed sweet indigenous sugarcane hybrids and co-authored the Chromosome Atlas.",
        "is_unsung_reason": "Despite foundational contributions to Indian agriculture and the Botanical Survey of India, her scientific legacy is overshadowed by contemporary Western scientists.",
    },
    {
        "search_title": "Velu Nachiyar",
        "state": "Tamil Nadu",
        "primary_domain": "Freedom Struggle",
        "tagline": "The first Indian queen to wage war against the British East India Company and successfully defeat them (1780).",
        "is_unsung_reason": "Her successful military victory over the British occurred nearly 75 years before the 1857 Revolt yet remains overlooked in national textbooks.",
    }
]


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    return re.sub(r"[-\s]+", "-", text)


async def ingest_candidates():
    print("=== Wikipedia & Wikimedia Commons Ingestion Pipeline ===")
    results = []

    for item in SEED_CANDIDATES:
        title = item["search_title"]
        print(f"\n[1/3] Searching Wikimedia for: '{title}'...")
        summary = await WikipediaClient.get_page_summary(title)

        if not summary:
            print(f"  -> Page '{title}' not found. Searching closest matches...")
            matches = await WikipediaClient.search_pages(title, limit=1)
            if matches:
                closest_title = matches[0]["title"]
                print(f"  -> Found match: '{closest_title}'. Fetching...")
                summary = await WikipediaClient.get_page_summary(closest_title)

        if summary:
            print(f"  -> Successfully fetched extract for: {summary['title']}")
            image_url = summary.get("image_url") or "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/India_Emblem.svg/600px-India_Emblem.svg.png"

            # Check image licensing
            print(f"[2/3] Validating media license...")
            license_info = await WikipediaClient.get_image_license_info(summary["title"])
            print(f"  -> License: {license_info['license']} | Attribution: {license_info['attribution']}")

            # Assemble normalized record
            hero_record = {
                "slug": slugify(summary["title"]),
                "name": summary["title"],
                "state": item["state"],
                "primary_domain": item["primary_domain"],
                "tagline": item["tagline"],
                "short_bio": summary["extract"][:600],
                "is_unsung_reason": item["is_unsung_reason"],
                "image_url": image_url,
                "image_license": license_info["license"],
                "image_attribution": license_info["attribution"],
                "image_source_page_url": license_info["source_page"],
            }
            results.append(hero_record)
            print(f"[3/3] Normalized record generated for '{summary['title']}'.")

    # Output results to scratch/ingested_heroes.json
    out_file = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "scripts", "ingested_heroes.json"))
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print(f"\nIngestion pipeline complete! Saved {len(results)} normalized records to: {out_file}")


if __name__ == "__main__":
    asyncio.run(ingest_candidates())
