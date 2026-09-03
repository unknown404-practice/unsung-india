import uuid
from datetime import datetime
import enum
from typing import List, Optional
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db import Base


class SourceType(str, enum.Enum):
    GOVERNMENT_ARCHIVE = "GOVERNMENT_ARCHIVE"
    GOVERNMENT_PORTAL = "GOVERNMENT_PORTAL"
    ACADEMIC_PUBLICATION = "ACADEMIC_PUBLICATION"
    HISTORICAL_BOOK = "HISTORICAL_BOOK"
    COMMONS_MEDIA = "COMMONS_MEDIA"


class Hero(Base):
    __tablename__ = "heroes"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(200), index=True, nullable=False)
    name_local: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    name_local_lang: Mapped[Optional[str]] = mapped_column(String(10), default="hi")
    birth_year: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    death_year: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    era: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    state: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    district: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    primary_domain: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    short_bio: Mapped[str] = mapped_column(Text, nullable=False)
    tagline: Mapped[str] = mapped_column(String(200), nullable=False)
    is_unsung_reason: Mapped[str] = mapped_column(Text, nullable=False)

    # Portrait and Safe Licensing
    image_url: Mapped[str] = mapped_column(Text, nullable=False)
    image_license: Mapped[str] = mapped_column(String(50), nullable=False)
    image_attribution: Mapped[str] = mapped_column(String(300), nullable=False)
    image_source_page_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    is_verified: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    view_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    banner_download_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    # Relationships
    contributions: Mapped[List["Contribution"]] = relationship(
        "Contribution", back_populates="hero", cascade="all, delete-orphan", lazy="selectin"
    )
    timeline_events: Mapped[List["TimelineEvent"]] = relationship(
        "TimelineEvent", back_populates="hero", cascade="all, delete-orphan", lazy="selectin"
    )
    sources: Mapped[List["Source"]] = relationship(
        "Source", back_populates="hero", cascade="all, delete-orphan", lazy="selectin"
    )


class Contribution(Base):
    __tablename__ = "contributions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    hero_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("heroes.id", ondelete="CASCADE"), nullable=False
    )
    display_order: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    title: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )

    hero: Mapped["Hero"] = relationship("Hero", back_populates="contributions")


class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    hero_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("heroes.id", ondelete="CASCADE"), nullable=False
    )
    event_year: Mapped[int] = mapped_column(Integer, nullable=False)
    event_date: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    display_order: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )

    hero: Mapped["Hero"] = relationship("Hero", back_populates="timeline_events")


class Source(Base):
    __tablename__ = "sources"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    hero_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("heroes.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    source_type: Mapped[SourceType] = mapped_column(
        Enum(SourceType, name="source_type"), default=SourceType.GOVERNMENT_PORTAL, nullable=False
    )
    url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    archive_ref_no: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    publisher_or_institution: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    is_primary_reference: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )

    hero: Mapped["Hero"] = relationship("Hero", back_populates="sources")
