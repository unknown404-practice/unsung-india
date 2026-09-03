import uuid
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, HttpUrl
from app.heroes.models import SourceType


# Contribution Schemas
class ContributionBase(BaseModel):
    display_order: int = 1
    title: Optional[str] = None
    description: str


class ContributionCreate(ContributionBase):
    pass


class ContributionRead(ContributionBase):
    id: uuid.UUID

    class Config:
        from_attributes = True


# Timeline Event Schemas
class TimelineEventBase(BaseModel):
    event_year: int
    event_date: Optional[str] = None
    title: str
    description: str
    display_order: int = 1


class TimelineEventCreate(TimelineEventBase):
    pass


class TimelineEventRead(TimelineEventBase):
    id: uuid.UUID

    class Config:
        from_attributes = True


# Source Schemas
class SourceBase(BaseModel):
    title: str
    source_type: SourceType
    url: Optional[str] = None
    archive_ref_no: Optional[str] = None
    publisher_or_institution: Optional[str] = None
    is_primary_reference: bool = False


class SourceCreate(SourceBase):
    pass


class SourceRead(SourceBase):
    id: uuid.UUID

    class Config:
        from_attributes = True


# Hero Schemas
class HeroBase(BaseModel):
    slug: str
    name: str
    name_local: Optional[str] = None
    name_local_lang: Optional[str] = "hi"
    birth_year: Optional[int] = None
    death_year: Optional[int] = None
    era: Optional[str] = None
    state: str
    district: Optional[str] = None
    primary_domain: str
    short_bio: str
    tagline: str
    is_unsung_reason: str
    image_url: str
    image_license: str
    image_attribution: str
    image_source_page_url: Optional[str] = None


class HeroCreate(HeroBase):
    contributions: List[ContributionCreate] = []
    timeline_events: List[TimelineEventCreate] = []
    sources: List[SourceCreate] = []


class HeroUpdate(BaseModel):
    name: Optional[str] = None
    name_local: Optional[str] = None
    birth_year: Optional[int] = None
    death_year: Optional[int] = None
    state: Optional[str] = None
    primary_domain: Optional[str] = None
    short_bio: Optional[str] = None
    tagline: Optional[str] = None
    is_unsung_reason: Optional[str] = None
    image_url: Optional[str] = None
    image_license: Optional[str] = None
    image_attribution: Optional[str] = None


class HeroListItem(BaseModel):
    id: uuid.UUID
    slug: str
    name: str
    name_local: Optional[str] = None
    name_local_lang: Optional[str] = None
    birth_year: Optional[int] = None
    death_year: Optional[int] = None
    state: str
    primary_domain: str
    tagline: str
    image_url: str
    image_license: str
    image_attribution: str
    view_count: int
    created_at: datetime

    class Config:
        from_attributes = True


class HeroDetail(HeroBase):
    id: uuid.UUID
    is_verified: bool
    is_published: bool
    view_count: int
    banner_download_count: int
    created_at: datetime
    updated_at: datetime
    contributions: List[ContributionRead] = []
    timeline_events: List[TimelineEventRead] = []
    sources: List[SourceRead] = []

    class Config:
        from_attributes = True


class PaginationMeta(BaseModel):
    total_records: int
    total_pages: int
    current_page: int
    limit: int


class HeroListResponse(BaseModel):
    data: List[HeroListItem]
    pagination: PaginationMeta
