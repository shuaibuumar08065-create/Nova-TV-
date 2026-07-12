from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database.db import get_session
from app.models.settings import Settings
from app.models.user import User
from app.schemas.settings import SettingsResponse, SettingsUpdate
from app.middleware.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=SettingsResponse)
async def get_settings(session: AsyncSession = Depends(get_session)):
    settings = await session.scalar(select(Settings))
    if not settings:
        settings = Settings()
        session.add(settings)
        await session.commit()
        await session.refresh(settings)
    return settings

@router.put("/", response_model=SettingsResponse)
async def update_settings(
    settings_update: SettingsUpdate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")
    settings = await session.scalar(select(Settings))
    if not settings:
        settings = Settings()
        session.add(settings)
    for key, value in settings_update.dict(exclude_unset=True).items():
        setattr(settings, key, value)
    await session.commit()
    await session.refresh(settings)
    return settings
