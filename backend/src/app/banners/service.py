import io
import qrcode
import httpx
from PIL import Image, ImageDraw, ImageFont
from app.heroes.models import Hero
from app.banners.schemas import BannerRenderRequest

TEMPLATES = {
    "metro_pillar": {
        "id": "metro_pillar",
        "name": "Metro Pillar Vertical Signage",
        "aspect_ratio": "9:16",
        "width_px": 1080,
        "height_px": 1920,
        "format_type": "DIGITAL_RASTER",
        "supported_themes": ["saffron_navy", "tricolor_minimal", "vintage_sepia"],
    },
    "roadside_billboard": {
        "id": "roadside_billboard",
        "name": "Roadside Landscape Billboard",
        "aspect_ratio": "16:9",
        "width_px": 1920,
        "height_px": 1080,
        "format_type": "DIGITAL_RASTER",
        "supported_themes": ["saffron_navy", "tricolor_minimal"],
    },
    "bus_stop": {
        "id": "bus_stop",
        "name": "Bus Stop Panel",
        "aspect_ratio": "4:3",
        "width_px": 1200,
        "height_px": 1600,
        "format_type": "DIGITAL_RASTER",
        "supported_themes": ["saffron_navy", "vintage_sepia"],
    },
    "college_board_a3": {
        "id": "college_board_a3",
        "name": "College Notice Board Print A3",
        "aspect_ratio": "1:1.414",
        "width_px": 2480,
        "height_px": 3508,
        "format_type": "PRINT_VECTOR_PDF",
        "supported_themes": ["print_clean_white", "saffron_navy"],
    },
}


class BannerFactoryService:
    @staticmethod
    def get_templates():
        return list(TEMPLATES.values())

    @staticmethod
    async def render_banner(hero: Hero, request: BannerRenderRequest) -> io.BytesIO:
        template = TEMPLATES.get(request.template_id, TEMPLATES["metro_pillar"])
        width = template["width_px"]
        height = template["height_px"]

        # Color Palette Themes
        bg_color = (18, 24, 38)  # Deep midnight navy
        card_bg = (28, 36, 56)
        accent_saffron = (255, 122, 0)
        text_primary = (255, 255, 255)
        text_secondary = (190, 205, 225)
        accent_green = (18, 136, 7)

        if request.theme == "tricolor_minimal":
            bg_color = (248, 250, 252)
            card_bg = (255, 255, 255)
            text_primary = (15, 23, 42)
            text_secondary = (71, 85, 105)
        elif request.theme == "print_clean_white":
            bg_color = (255, 255, 255)
            card_bg = (245, 245, 245)
            text_primary = (0, 0, 0)
            text_secondary = (60, 60, 60)

        # Create canvas
        image = Image.new("RGB", (width, height), color=bg_color)
        draw = ImageDraw.Draw(image)

        # Top saffron tricolor strip
        draw.rectangle([(0, 0), (width, 24)], fill=accent_saffron)
        draw.rectangle([(0, 24), (width, 36)], fill=(255, 255, 255))
        draw.rectangle([(0, 36), (width, 60)], fill=accent_green)

        # Header Title
        try:
            font_title = ImageFont.load_default(size=42)
            font_hero_name = ImageFont.load_default(size=56)
            font_sub = ImageFont.load_default(size=28)
            font_body = ImageFont.load_default(size=24)
            font_small = ImageFont.load_default(size=18)
        except TypeError:
            # Fallback for older PIL versions
            font_title = ImageFont.load_default()
            font_hero_name = font_title
            font_sub = font_title
            font_body = font_title
            font_small = font_title

        # Platform Header
        draw.text(
            (60, 90),
            "UNSUNG HEROES OF INDIA — NATIONAL PUBLIC ARCHIVE",
            fill=accent_saffron,
            font=font_title,
        )

        # Hero Name & Local Script
        name_display = hero.name
        if hero.name_local:
            name_display = f"{hero.name} ({hero.name_local})"

        draw.text((60, 160), name_display, fill=text_primary, font=font_hero_name)

        era_str = f"{hero.state} | {hero.primary_domain}"
        if hero.birth_year and hero.death_year:
            era_str += f" ({hero.birth_year} – {hero.death_year})"
        draw.text((60, 230), era_str, fill=text_secondary, font=font_sub)

        # Tagline box
        draw.rectangle([(60, 280), (width - 60, 370)], fill=card_bg)
        draw.text((80, 310), f"“{hero.tagline}”", fill=text_primary, font=font_sub)

        # Download and composite hero portrait
        portrait_box_size = (width - 120, int(height * 0.40))
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                resp = await client.get(hero.image_url)
                if resp.status_code == 200:
                    hero_img = Image.open(io.BytesIO(resp.content)).convert("RGB")
                    hero_img.thumbnail(portrait_box_size, Image.Resampling.LANCZOS)
                    image.paste(hero_img, (60, 400))
        except Exception:
            # Fallback placeholder frame if remote fetch fails
            draw.rectangle([(60, 400), (width - 60, 400 + int(height * 0.35))], fill=card_bg)
            draw.text((80, 440), f"[Portrait of {hero.name}]", fill=text_secondary, font=font_sub)

        # Contributions Section
        contrib_y = int(height * 0.65)
        draw.text((60, contrib_y), "KEY HISTORICAL CONTRIBUTIONS:", fill=accent_saffron, font=font_sub)
        contrib_y += 50

        if hero.contributions:
            for idx, c in enumerate(hero.contributions[:3]):
                bullet_text = f"• {c.title}: {c.description}" if c.title else f"• {c.description}"
                # Truncate if too long
                if len(bullet_text) > 130:
                    bullet_text = bullet_text[:127] + "..."
                draw.text((60, contrib_y), bullet_text, fill=text_secondary, font=font_body)
                contrib_y += 45
        else:
            draw.text((60, contrib_y), f"• {hero.short_bio[:180]}...", fill=text_secondary, font=font_body)
            contrib_y += 45

        # Generate Dynamic QR Code
        qr_url = f"https://unsung-heroes.vercel.app/heroes/{hero.slug}"
        qr = qrcode.QRCode(box_size=4, border=1)
        qr.add_data(qr_url)
        qr.make(fit=True)
        qr_img = qr.make_image(fill_color="black", back_color="white").convert("RGB")
        qr_w, qr_h = qr_img.size

        qr_x = width - 60 - qr_w
        qr_y = height - 150 - qr_h
        image.paste(qr_img, (qr_x, qr_y))
        draw.text((qr_x, qr_y - 25), "Scan for Full Biography & Sources", fill=text_secondary, font=font_small)

        # Footer Source Attribution & Copyright Hygiene Watermark
        draw.line([(60, height - 80), (width - 60, height - 80)], fill=(80, 95, 120), width=1)
        attribution_str = (
            f"Sources: PIB / National Archives / Indian Culture Portal | "
            f"Image License: {hero.image_license} ({hero.image_attribution[:60]}) | DPI Public Asset"
        )
        draw.text((60, height - 55), attribution_str, fill=text_secondary, font=font_small)

        # Save buffer
        buffer = io.BytesIO()
        if request.format.lower() == "pdf":
            image.save(buffer, format="PDF", resolution=150.0)
        else:
            image.save(buffer, format="PNG", optimize=True)
        buffer.seek(0)
        return buffer
