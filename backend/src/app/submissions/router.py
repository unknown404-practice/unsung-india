import re
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import get_db
from app.auth.models import User, UserRole
from app.auth.security import require_roles, get_current_user
from app.submissions.models import Submission, SubmissionStatus
from app.submissions.schemas import (
    SubmissionCreate,
    SubmissionRead,
    SubmissionApproveRequest,
    SubmissionRejectRequest,
)
from app.heroes.models import Hero, Contribution, Source, SourceType

router = APIRouter(tags=["Community Submissions & Moderation"])


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    return re.sub(r"[-\s]+", "-", text)


# Public Endpoint to Submit
@router.post(
    "/submissions",
    response_model=SubmissionRead,
    status_code=status.HTTP_201_CREATED,
)
async def submit_hero_proposal(
    submission_in: SubmissionCreate,
    db: AsyncSession = Depends(get_db),
):
    submission = Submission(**submission_in.model_dump())
    db.add(submission)
    await db.commit()
    await db.refresh(submission)
    return submission


# Protected Admin Moderation Endpoints
@router.get(
    "/admin/submissions",
    response_model=List[SubmissionRead],
    dependencies=[Depends(require_roles(UserRole.ADMIN, UserRole.MODERATOR))],
)
async def list_submissions(
    status_filter: Optional[SubmissionStatus] = Query(None, alias="status"),
    db: AsyncSession = Depends(get_db),
):
    query = select(Submission).order_by(desc(Submission.created_at))
    if status_filter:
        query = query.where(Submission.status == status_filter)

    result = await db.execute(query)
    submissions = result.scalars().all()
    return list(submissions)


@router.post(
    "/admin/submissions/{submission_id}/approve",
    dependencies=[Depends(require_roles(UserRole.ADMIN, UserRole.MODERATOR))],
)
async def approve_submission(
    submission_id: uuid.UUID,
    approve_in: SubmissionApproveRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = select(Submission).where(Submission.id == submission_id)
    submission = (await db.execute(stmt)).scalar_one_or_none()

    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found"
        )
    if submission.status == SubmissionStatus.APPROVED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Already approved"
        )

    # Generate or use provided slug
    slug = approve_in.slug or slugify(submission.hero_name)

    # Create live Hero entry
    hero = Hero(
        slug=slug,
        name=submission.hero_name,
        name_local=submission.hero_name_local,
        birth_year=submission.birth_year,
        death_year=submission.death_year,
        state=submission.state,
        primary_domain=submission.primary_domain,
        short_bio=submission.short_bio,
        tagline=approve_in.tagline,
        is_unsung_reason=approve_in.is_unsung_reason
        or "Documented through community archival submission and verified by the editorial board.",
        image_url=submission.image_url
        or "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/India_Emblem.svg/600px-India_Emblem.svg.png",
        image_license=submission.image_license_declared or "PUBLIC_DOMAIN",
        image_attribution=f"Submitted by {submission.submitter_name}",
        is_verified=True,
        is_published=True,
    )

    # Add bullet contributions
    for idx, c_text in enumerate(submission.key_contributions):
        hero.contributions.append(
            Contribution(display_order=idx + 1, description=c_text)
        )

    # Add source citation
    hero.sources.append(
        Source(
            title="Community Verified Reference",
            source_type=SourceType.GOVERNMENT_PORTAL,
            url=submission.sources_text[:500],
            is_primary_reference=True,
        )
    )

    # Update submission status
    submission.status = SubmissionStatus.APPROVED
    submission.reviewed_by = current_user.id

    db.add(hero)
    await db.commit()
    await db.refresh(hero)

    return {
        "message": "Submission successfully approved and published to catalog.",
        "hero_id": str(hero.id),
        "hero_slug": hero.slug,
    }


@router.post(
    "/admin/submissions/{submission_id}/reject",
    dependencies=[Depends(require_roles(UserRole.ADMIN, UserRole.MODERATOR))],
)
async def reject_submission(
    submission_id: uuid.UUID,
    reject_in: SubmissionRejectRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = select(Submission).where(Submission.id == submission_id)
    submission = (await db.execute(stmt)).scalar_one_or_none()

    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found"
        )

    submission.status = SubmissionStatus.REJECTED
    submission.rejection_reason = reject_in.reason
    submission.reviewed_by = current_user.id

    await db.commit()
    return {"message": "Submission marked as rejected.", "reason": reject_in.reason}
