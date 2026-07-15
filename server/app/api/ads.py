from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.db import get_session
from app.middleware.auth import get_current_user
from app.models.user import User
from app.schemas.ad import AdCreate, AdUpdate, AdResponse
from app.services.ad_service import AdService

router = APIRouter()


@router.get("/", response_model=List[AdResponse])
async def list_ads(session: AsyncSession = Depends(get_session)):
    return await AdService.get_all(session)


@router.post("/", response_model=AdResponse, status_code=201)
async def create_ad(
    ad: AdCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")

    return await AdService.create(session, ad.model_dump())


@router.put("/{ad_id}", response_model=AdResponse)
async def update_ad(
    ad_id: int,
    ad: AdUpdate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")

    db_ad = await AdService.get_by_id(session, ad_id)

    if not db_ad:
        raise HTTPException(status_code=404, detail="Ad not found")

    return await AdService.update(
        session,
        db_ad,
        ad.model_dump(exclude_unset=True),
    )


@router.delete("/{ad_id}")
async def delete_ad(
    ad_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")

    db_ad = await AdService.get_by_id(session, ad_id)

    if not db_ad:
        raise HTTPException(status_code=404, detail="Ad not found")

    await AdService.delete(session, db_ad)

    return {"detail": "Ad deleted"}


@router.post("/{ad_id}/view")
async def add_view(
    ad_id: int,
    session: AsyncSession = Depends(get_session),
):
    db_ad = await AdService.get_by_id(session, ad_id)

    if not db_ad:
        raise HTTPException(status_code=404, detail="Ad not found")

    await AdService.add_view(session, db_ad)

    return {
        "success": True,
        "views": db_ad.views,
    }


@router.post("/{ad_id}/click")
async def add_click(
    ad_id: int,
    session: AsyncSession = Depends(get_session),
):
    db_ad = await AdService.get_by_id(session, ad_id)

    if not db_ad:
        raise HTTPException(status_code=404, detail="Ad not found")

    await AdService.add_click(session, db_ad)

    return {
        "success": True,
        "clicks": db_ad.clicks,
    }
