import uuid
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr
from app.submissions.models import SubmissionStatus


class SubmissionCreate(BaseModel):
    submitter_name: str
    submitter_email: EmailStr
    hero_name: str
    hero_name_local: Optional[str] = None
    state: str
    primary_domain: str
    birth_year: Optional[int] = None
    death_year: Optional[int] = None
    short_bio: str
    key_contributions: List[str]
    sources_text: str
    image_url: Optional[str] = None
    image_license_declared: Optional[str] = "PUBLIC_DOMAIN"


class SubmissionRead(SubmissionCreate):
    id: uuid.UUID
    status: SubmissionStatus
    rejection_reason: Optional[str] = None
    reviewed_by: Optional[uuid.UUID] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SubmissionApproveRequest(BaseModel):
    slug: Optional[str] = None
    tagline: str
    is_unsung_reason: Optional[str] = None
    editorial_notes: Optional[str] = None


class SubmissionRejectRequest(BaseModel):
    reason: str
