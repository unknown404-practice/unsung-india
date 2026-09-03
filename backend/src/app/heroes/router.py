from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import get_db
from app.auth.models import User, UserRole
from app.auth.security import require_roles
from app.heroes.schemas import (
    HeroListResponse,
    HeroDetail,
    HeroCreate,
    HeroUpdate,
    PaginationMeta,
    HeroListItem,
)
from app.heroes.service import HeroService

router = APIRouter(tags=["Heroes"])


@router.get("/heroes", response_model=HeroListResponse)
async def list_heroes(
    q: Optional[str] = Query(None, description="Search term across name, bio, state"),
    state: Optional[str] = Query(None, description="Filter by Indian State"),
    domain: Optional[str] = Query(None, description="Filter by primary domain"),
    era: Optional[str] = Query(None, description="Filter by era"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(12, ge=1, le=50, description="Items per page"),
    sort_by: str = Query("created_at", description="Field to sort by"),
    sort_order: str = Query("desc", description="Sort order: asc or desc"),
    db: AsyncSession = Depends(get_db),
):
    heroes, total_records, total_pages = await HeroService.get_heroes(
        db=db,
        q=q,
        state=state,
        domain=domain,
        era=era,
        page=page,
        limit=limit,
        sort_by=sort_by,
        sort_order=sort_order,
    )

    items = [HeroListItem.model_validate(h) for h in heroes]
    return HeroListResponse(
        data=items,
        pagination=PaginationMeta(
            total_records=total_records,
            total_pages=total_pages,
            current_page=page,
            limit=limit,
        ),
    )


@router.get("/heroes/{slug_or_id}", response_model=HeroDetail)
async def get_hero_profile(
    slug_or_id: str,
    db: AsyncSession = Depends(get_db),
):
    hero = await HeroService.get_hero_by_slug_or_id(db, slug_or_id)
    if not hero:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hero '{slug_or_id}' was not found in the national catalog.",
        )
    return HeroDetail.model_validate(hero)


# Admin Endpoints
@router.post(
    "/admin/heroes",
    response_model=HeroDetail,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_roles(UserRole.ADMIN, UserRole.EDITOR))],
)
async def create_hero_record(
    hero_in: HeroCreate,
    db: AsyncSession = Depends(get_db),
):
    existing = await HeroService.get_hero_by_slug_or_id(
        db, hero_in.slug, increment_view=False
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Hero with slug '{hero_in.slug}' already exists.",
        )
    hero = await HeroService.create_hero(db, hero_in)
    return HeroDetail.model_validate(hero)


@router.put(
    "/admin/heroes/{slug_or_id}",
    response_model=HeroDetail,
    dependencies=[Depends(require_roles(UserRole.ADMIN, UserRole.EDITOR))],
)
async def update_hero_record(
    slug_or_id: str,
    hero_in: HeroUpdate,
    db: AsyncSession = Depends(get_db),
):
    hero = await HeroService.get_hero_by_slug_or_id(
        db, slug_or_id, increment_view=False
    )
    if not hero:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hero '{slug_or_id}' not found.",
        )
    updated = await HeroService.update_hero(db, hero, hero_in)
    return HeroDetail.model_validate(updated)


@router.delete(
    "/admin/heroes/{slug_or_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_roles(UserRole.ADMIN))],
)
async def delete_hero_record(
    slug_or_id: str,
    db: AsyncSession = Depends(get_db),
):
    hero = await HeroService.get_hero_by_slug_or_id(
        db, slug_or_id, increment_view=False
    )
    if not hero:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hero '{slug_or_id}' not found.",
        )
    await HeroService.delete_hero(db, hero)
    return None
