import math
import uuid
from typing import Optional, Tuple, List
from sqlalchemy import select, func, or_, desc, asc
from sqlalchemy.ext.asyncio import AsyncSession
from app.heroes.models import Hero, Contribution, TimelineEvent, Source
from app.heroes.schemas import HeroCreate, HeroUpdate


class HeroService:
    @staticmethod
    async def get_heroes(
        db: AsyncSession,
        q: Optional[str] = None,
        state: Optional[str] = None,
        domain: Optional[str] = None,
        era: Optional[str] = None,
        page: int = 1,
        limit: int = 12,
        sort_by: str = "created_at",
        sort_order: str = "desc",
    ) -> Tuple[List[Hero], int, int]:
        query = select(Hero).where(Hero.is_published == True)

        if q:
            search_filter = or_(
                Hero.name.ilike(f"%{q}%"),
                Hero.name_local.ilike(f"%{q}%"),
                Hero.tagline.ilike(f"%{q}%"),
                Hero.short_bio.ilike(f"%{q}%"),
                Hero.state.ilike(f"%{q}%"),
                Hero.primary_domain.ilike(f"%{q}%"),
            )
            query = query.where(search_filter)

        if state:
            query = query.where(Hero.state.ilike(f"%{state}%"))
        if domain:
            query = query.where(Hero.primary_domain.ilike(f"%{domain}%"))
        if era:
            query = query.where(Hero.era.ilike(f"%{era}%"))

        # Count total records
        count_stmt = select(func.count()).select_from(query.subquery())
        total_records = (await db.execute(count_stmt)).scalar() or 0
        total_pages = math.ceil(total_records / limit) if total_records > 0 else 1

        # Sorting
        sort_column = getattr(Hero, sort_by, Hero.created_at)
        if sort_order.lower() == "asc":
            query = query.order_by(asc(sort_column))
        else:
            query = query.order_by(desc(sort_column))

        # Pagination offset & limit
        offset = (page - 1) * limit
        query = query.offset(offset).limit(limit)

        result = await db.execute(query)
        heroes = result.scalars().all()
        return list(heroes), total_records, total_pages

    @staticmethod
    async def get_hero_by_slug_or_id(
        db: AsyncSession, slug_or_id: str, increment_view: bool = True
    ) -> Optional[Hero]:
        is_uuid = False
        try:
            val_uuid = uuid.UUID(slug_or_id)
            is_uuid = True
        except ValueError:
            is_uuid = False

        if is_uuid:
            stmt = select(Hero).where(Hero.id == val_uuid)
        else:
            stmt = select(Hero).where(Hero.slug == slug_or_id)

        result = await db.execute(stmt)
        hero = result.scalar_one_or_none()

        if hero and increment_view:
            hero.view_count += 1
            await db.commit()
            await db.refresh(hero)

        return hero

    @staticmethod
    async def create_hero(db: AsyncSession, hero_in: HeroCreate) -> Hero:
        hero_data = hero_in.model_dump(
            exclude={"contributions", "timeline_events", "sources"}
        )
        hero = Hero(**hero_data)

        # Add child relationships
        for c in hero_in.contributions:
            hero.contributions.append(Contribution(**c.model_dump()))
        for t in hero_in.timeline_events:
            hero.timeline_events.append(TimelineEvent(**t.model_dump()))
        for s in hero_in.sources:
            hero.sources.append(Source(**s.model_dump()))

        db.add(hero)
        await db.commit()
        await db.refresh(hero)
        return hero

    @staticmethod
    async def update_hero(
        db: AsyncSession, hero: Hero, hero_in: HeroUpdate
    ) -> Hero:
        update_data = hero_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(hero, field, value)

        await db.commit()
        await db.refresh(hero)
        return hero

    @staticmethod
    async def delete_hero(db: AsyncSession, hero: Hero) -> None:
        await db.delete(hero)
        await db.commit()
