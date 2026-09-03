from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import get_db
from app.heroes.service import HeroService
from app.banners.schemas import (
    BannerTemplateListResponse,
    BannerTemplateRead,
    BannerRenderRequest,
)
from app.banners.service import BannerFactoryService

router = APIRouter(prefix="/banners", tags=["Banner Factory"])


@router.get("/templates", response_model=BannerTemplateListResponse)
async def list_templates():
    templates = BannerFactoryService.get_templates()
    return BannerTemplateListResponse(
        templates=[BannerTemplateRead(**t) for t in templates]
    )


@router.post("/render")
async def render_banner_endpoint(
    request: BannerRenderRequest,
    db: AsyncSession = Depends(get_db),
):
    hero = await HeroService.get_hero_by_slug_or_id(
        db, request.hero_id, increment_view=False
    )
    if not hero:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hero '{request.hero_id}' not found.",
        )

    # Increment banner download metric
    hero.banner_download_count += 1
    await db.commit()

    # Generate banner stream
    buffer = await BannerFactoryService.render_banner(hero, request)

    filename = f"unsung-hero-{hero.slug}-{request.template_id}.{request.format.lower()}"
    media_type = "application/pdf" if request.format.lower() == "pdf" else "image/png"

    return StreamingResponse(
        buffer,
        media_type=media_type,
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Cache-Control": "public, max-age=86400",
        },
    )
