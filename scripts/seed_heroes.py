import asyncio
import os
import sys

# Ensure backend/src is on the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend", "src")))

from app.db import AsyncSessionLocal, engine, Base
from app.auth.models import User, UserRole
from app.auth.security import get_password_hash
from app.heroes.models import Hero, Contribution, TimelineEvent, Source, SourceType
from app.config import settings
from sqlalchemy import select


SEED_HEROES = [
    {
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
        "short_bio": "Matangini Hazra was an Indian revolutionary who participated in the Indian independence movement until she was shot dead by the British Indian police in front of the Tamluk Police Station on 29 September 1942. Affectionately known as 'Gandhi Buri' (Old Lady Gandhi), she led a procession of six thousand volunteers, mostly women, to take over the Tamluk police station during the Quit India movement.",
        "is_unsung_reason": "Despite her supreme sacrifice holding the tricolor aloft until her last breath, her story is rarely taught in mainstream national school curricula outside West Bengal.",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/4/4b/Matangini_Hazra.jpg",
        "image_license": "PUBLIC_DOMAIN",
        "image_attribution": "Public Domain (Photograph circa 1942 in British India, copyright expired)",
        "image_source_page_url": "https://commons.wikimedia.org/wiki/File:Matangini_Hazra.jpg",
        "contributions": [
            {"display_order": 1, "title": "Quit India Movement Martyrdom", "description": "Led a peaceful procession of 6,000 freedom fighters in Tamluk at age 72, continuing to chant Vande Mataram even after being shot multiple times."},
            {"display_order": 2, "title": "Salt Satyagraha Participant", "description": "Active participant in the 1930 Civil Disobedience and Salt Satyagraha movements, enduring multiple arrests and physical imprisonment."},
            {"display_order": 3, "title": "First Woman Statue in Independent Kolkata", "description": "Recognized posthumously as the first woman freedom fighter to have a statue erected in Kolkata Maidan in independent India (1977)."}
        ],
        "sources": [
            {"title": "Press Information Bureau: Women in India’s Freedom Struggle", "source_type": SourceType.GOVERNMENT_PORTAL, "url": "https://pib.gov.in", "publisher_or_institution": "Press Information Bureau, Ministry of Information and Broadcasting", "is_primary_reference": True},
            {"title": "National Archives of India Freedom Struggle Records", "source_type": SourceType.GOVERNMENT_ARCHIVE, "url": "https://www.abhilekhpatal.in", "publisher_or_institution": "National Archives of India", "is_primary_reference": False}
        ]
    },
    {
        "slug": "tirot-sing",
        "name": "U Tirot Sing Syiem",
        "name_local": "ইউ তিৰত সিং",
        "name_local_lang": "as",
        "birth_year": 1802,
        "death_year": 1835,
        "era": "Anglo-Khasi War (1829-1833)",
        "state": "Meghalaya",
        "district": "Khasi Hills",
        "primary_domain": "Freedom Struggle",
        "tagline": "The Khasi tribal chief who declared war against the British East India Company to protect indigenous sovereignty.",
        "short_bio": "U Tirot Sing Syiem was a native Khasi chief of Nongkhlaw in the Khasi Hills of Meghalaya who led the Anglo-Khasi War against the British East India Company from 1829 to 1833. He resisted British attempts to control the Khasi hills and construct a military road through tribal land, famously fighting with traditional indigenous weaponry against modern colonial artillery.",
        "is_unsung_reason": "Tribal resistance movements in North-East India predating the 1857 Revolt by decades are often omitted from standard colonial history surveys.",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/U_Tirot_Sing.jpg/800px-U_Tirot_Sing.jpg",
        "image_license": "PUBLIC_DOMAIN",
        "image_attribution": "Public Domain (Official postage stamp depiction, Department of Posts, GoI)",
        "image_source_page_url": "https://commons.wikimedia.org/wiki/File:U_Tirot_Sing.jpg",
        "contributions": [
            {"display_order": 1, "title": "Anglo-Khasi Resistance", "description": "Led an indigenous mountain guerrilla warfare campaign against British colonial forces from 1829 to 1833."},
            {"display_order": 2, "title": "Defense of Tribal Autonomy", "description": "Refused British surrender terms stating he preferred dying as a common freeman than living as an enslaved king."},
            {"display_order": 3, "title": "State Hero of Meghalaya", "description": "Celebrated across the North-East with 17 July observed annually as U Tirot Sing Day."}
        ],
        "sources": [
            {"title": "PIB: Tribal Freedom Fighters of India", "source_type": SourceType.GOVERNMENT_PORTAL, "url": "https://pib.gov.in", "publisher_or_institution": "Press Information Bureau", "is_primary_reference": True}
        ]
    },
    {
        "slug": "janaki-ammal",
        "name": "E. K. Janaki Ammal",
        "name_local": "ஜானகி அம்மாள்",
        "name_local_lang": "ta",
        "birth_year": 1897,
        "death_year": 1984,
        "era": "Early 20th Century Science",
        "state": "Kerala",
        "district": "Thalassery, Kannur",
        "primary_domain": "Science & Tech",
        "tagline": "India’s pioneering cytogeneticist and botanist who developed sweet indigenous sugarcane hybrids and co-authored the Chromosome Atlas.",
        "short_bio": "Edavalath Kakkat Janaki Ammal was a pioneering Indian botanist and cytogeneticist who conducted scientific research in cytogenetics and phytogeography. She obtained a PhD from the University of Michigan in 1931, becoming one of the first women in the world to do so, and engineered high-yield sweet sugarcane varieties indigenous to India.",
        "is_unsung_reason": "Despite foundational contributions to Indian agriculture and the Botanical Survey of India, her scientific legacy is overshadowed by contemporary Western scientists.",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/4/4e/Janaki_Ammal_%281897%E2%80%931984%29.jpg",
        "image_license": "PUBLIC_DOMAIN",
        "image_attribution": "Public Domain (Botanical Survey of India archival portrait)",
        "image_source_page_url": "https://commons.wikimedia.org/wiki/File:Janaki_Ammal_(1897%E2%80%931984).jpg",
        "contributions": [
            {"display_order": 1, "title": "Indigenous Sugarcane Hybrids", "description": "Developed the high-sucrose sugarcane variety cross (Saccharum-Zea) enabling India to produce sweet sugarcane domestically without imports."},
            {"display_order": 2, "title": "Chromosome Atlas of Cultivated Plants", "description": "Co-authored the landmark international Chromosome Atlas with C.D. Darlington in 1945."},
            {"display_order": 3, "title": "Botanical Survey of India Reorganization", "description": "Served as Officer on Special Duty to restructure and revitalize the Botanical Survey of India (BSI) under Jawaharlal Nehru."}
        ],
        "sources": [
            {"title": "CSIR Science Reporter: Pioneering Indian Women in Science", "source_type": SourceType.ACADEMIC_PUBLICATION, "url": "https://sciencereporter.niscpr.res.in", "publisher_or_institution": "CSIR-NIScPR", "is_primary_reference": True}
        ]
    }
]


async def seed_database():
    print("Connecting to database...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # 1. Create Default Admin User
        admin_stmt = select(User).where(User.email == settings.INITIAL_ADMIN_EMAIL)
        admin_user = (await session.execute(admin_stmt)).scalar_one_or_none()

        if not admin_user:
            print(f"Creating default admin: {settings.INITIAL_ADMIN_EMAIL}")
            admin_user = User(
                email=settings.INITIAL_ADMIN_EMAIL,
                hashed_password=get_password_hash(settings.INITIAL_ADMIN_PASSWORD),
                full_name="National Archive Chief Editor",
                role=UserRole.ADMIN,
                is_active=True,
            )
            session.add(admin_user)
            await session.commit()
            print("Admin user created successfully.")
        else:
            print("Admin user already exists.")

        # 2. Seed Heroes
        for h_data in SEED_HEROES:
            hero_stmt = select(Hero).where(Hero.slug == h_data["slug"])
            existing_hero = (await session.execute(hero_stmt)).scalar_one_or_none()

            if not existing_hero:
                print(f"Seeding hero: {h_data['name']}")
                hero = Hero(
                    slug=h_data["slug"],
                    name=h_data["name"],
                    name_local=h_data.get("name_local"),
                    name_local_lang=h_data.get("name_local_lang"),
                    birth_year=h_data.get("birth_year"),
                    death_year=h_data.get("death_year"),
                    era=h_data.get("era"),
                    state=h_data["state"],
                    district=h_data.get("district"),
                    primary_domain=h_data["primary_domain"],
                    short_bio=h_data["short_bio"],
                    tagline=h_data["tagline"],
                    is_unsung_reason=h_data["is_unsung_reason"],
                    image_url=h_data["image_url"],
                    image_license=h_data["image_license"],
                    image_attribution=h_data["image_attribution"],
                    image_source_page_url=h_data.get("image_source_page_url"),
                    is_verified=True,
                    is_published=True,
                )
                for c in h_data["contributions"]:
                    hero.contributions.append(Contribution(**c))
                for s in h_data["sources"]:
                    hero.sources.append(Source(**s))

                session.add(hero)
                await session.commit()
                print(f"Hero '{h_data['name']}' seeded.")
            else:
                print(f"Hero '{h_data['name']}' already exists.")

    print("\nDatabase seeding completed successfully!")


if __name__ == "__main__":
    asyncio.run(seed_database())
