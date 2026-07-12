from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.database.db import get_session
from app.models.ad import Ad
from app.models.user import User
from app.schemas.ad import AdCreate, AdUpdate, AdResponse
from app.middleware.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[AdResponse])
async def list_ads(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Ad))
    return result.scalars().all()

@router.post("/", response_model=AdResponse, status_code=201)
async def create_ad(
    ad: AdCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")
    new_ad = Ad(**ad.dict())
    session.add(new_ad)
    await session.commit()
    await session.refresh(new_ad)
    return new_ad

@router.put("/{ad_id}", response_model=AdResponse)
async def update_ad(
    ad_id: int,
    ad: AdUpdate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")
    db_ad = await session.get(Ad, ad_id)
    if not db_ad:
        raise HTTPException(status_code=404, detail="Ad not found")
    for key, value in ad.dict(exclude_unset=True).items():
        setattr(db_ad, key, value)
    await session.commit()
    await session.refresh(db_ad)
    return db_ad

@router.delete("/{ad_id}")
async def delete_ad(
    ad_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")
    db_ad = await session.get(Ad, ad_id)
    if not db_ad:
        raise HTTPException(status_code=404, detail="Ad not found")
    await session.delete(db_ad)
    await session.commit()
    return {"detail": "Ad deleted"}
