from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.database.db import get_session
from app.middleware.auth import get_current_user

from app.models.user import User
from app.models.video import Video
from app.models.category import Category
from app.models.ad import Ad

router = APIRouter()


@router.get("/dashboard")
async def dashboard(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")

    total_videos = await session.scalar(
        select(func.count(Video.id))
    ) or 0

    total_users = await session.scalar(
        select(func.count(User.id))
    ) or 0

    total_categories = await session.scalar(
        select(func.count(Category.id))
    ) or 0

    total_views = await session.scalar(
        select(func.sum(Video.views))
    ) or 0

    total_ads = await session.scalar(
        select(func.count(Ad.id))
    ) or 0

    total_ad_views = await session.scalar(
        select(func.sum(Ad.views))
    ) or 0

    total_ad_clicks = await session.scalar(
        select(func.sum(Ad.clicks))
    ) or 0

    return {
        "total_videos": total_videos,
        "total_users": total_users,
        "total_categories": total_categories,
        "total_views": total_views,
        "total_ads": total_ads,
        "total_ad_views": total_ad_views,
        "total_ad_clicks": total_ad_clicks,
    }
