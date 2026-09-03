from typing import Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import get_db
from app.heroes.service import HeroService
from app.heroes.schemas import HeroListItem, HeroListResponse, PaginationMeta
from app.search.duckduckgo import DuckDuckGoSearchService

router = APIRouter(prefix="/search", tags=["National Search Engine"])


@router.get("/query")
async def global_search_query(
    q: str = Query(..., min_length=2, description="Search query for any Indian contributor"),
    enable_ddg_fallback: bool = Query(True, description="Enable DuckDuckGo fallback discovery"),
    db: AsyncSession = Depends(get_db),
):
    """
    Search endpoint:
    1. First queries local PostgreSQL full-text index with trigram tolerance.
    2. If fewer than 1 match is found and enable_ddg_fallback is True, executes DuckDuckGo + Wikimedia live discovery!
    """
    # 1. Local Database Search
    heroes, total_records, total_pages = await HeroService.get_heroes(
        db=db, q=q, page=1, limit=12
    )

    if heroes and len(heroes) > 0:
        return {
            "source": "LOCAL_INDEX",
            "count": len(heroes),
            "data": [HeroListItem.model_validate(h) for h in heroes],
        }

    # 2. DuckDuckGo + Wikimedia Discovery Fallback
    if enable_ddg_fallback:
        discovered = await DuckDuckGoSearchService.discover_hero(q)
        if discovered:
            return {
                "source": "DUCKDUCKGO_WIKIMEDIA_DISCOVERY",
                "count": 1,
                "data": [discovered],
            }

    return {
        "source": "NO_MATCH",
        "count": 0,
        "data": [],
    }
