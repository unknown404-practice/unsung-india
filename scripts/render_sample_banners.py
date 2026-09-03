import asyncio
import os
import sys

# Ensure backend/src is on the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend", "src")))

from app.banners.service import BannerFactoryService, TEMPLATES
from app.banners.schemas import BannerRenderRequest
from app.heroes.models import Hero, Contribution
from scripts.seed_heroes import SEED_HEROES


async def generate_all_samples():
    output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "output_banners"))
    os.makedirs(output_dir, exist_ok=True)
    print(f"Generating sample banners to directory: {output_dir}\n")

    for hero_data in SEED_HEROES:
        hero = Hero(
            slug=hero_data["slug"],
            name=hero_data["name"],
            name_local=hero_data.get("name_local"),
            state=hero_data["state"],
            primary_domain=hero_data["primary_domain"],
            tagline=hero_data["tagline"],
            short_bio=hero_data["short_bio"],
            birth_year=hero_data.get("birth_year"),
            death_year=hero_data.get("death_year"),
            image_url=hero_data["image_url"],
            image_license=hero_data["image_license"],
            image_attribution=hero_data["image_attribution"],
        )
        for c in hero_data["contributions"]:
            hero.contributions.append(Contribution(**c))

        for template_id in TEMPLATES.keys():
            for fmt in ["png", "pdf"]:
                req = BannerRenderRequest(
                    hero_id=hero.slug,
                    template_id=template_id,
                    language_pair="en-hi",
                    theme="saffron_navy",
                    format=fmt,
                )
                print(f"Rendering [{template_id}] [{fmt.upper()}] for {hero.name}...")
                try:
                    buffer = await BannerFactoryService.render_banner(hero, req)
                    out_path = os.path.join(output_dir, f"{hero.slug}_{template_id}.{fmt}")
                    with open(out_path, "wb") as f:
                        f.write(buffer.getvalue())
                    print(f"  -> Saved: {out_path}")
                except Exception as e:
                    print(f"  -> Error rendering {hero.name}: {e}")

    print("\nAll sample banners rendered successfully!")


if __name__ == "__main__":
    asyncio.run(generate_all_samples())
