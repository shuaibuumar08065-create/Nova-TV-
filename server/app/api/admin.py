from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.database.db import get_session
from app.models.video import Video
from app.models.user import User
from app.models.category import Category
from app.middleware.auth import get_current_user
from app.models.user import User as UserModel

router = APIRouter()

@router.get("/dashboard")
async def dashboard_stats(
    current_user: UserModel = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")
    total_videos = await session.scalar(select(func.count(Video.id)))
    total_users = await session.scalar(select(func.count(User.id)))
    total_categories = await session.scalar(select(func.count(Category.id)))
    total_views = await session.scalar(select(func.sum(Video.views))) or 0
    return {
        "total_videos": total_videos,
        "total_users": total_users,
        "total_categories": total_categories,
        "total_views": total_views
    }
