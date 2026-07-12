from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timedelta

from app.database.db import get_session
from app.models.video import Video
from app.models.user import User
from app.models.watch_history import WatchHistory
from app.models.like import Like
from app.models.favorite import Favorite
from app.middleware.auth import get_current_user
from app.models.user import User as UserModel

router = APIRouter()

@router.get("/stats")
async def get_analytics(
    current_user: UserModel = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")
    week_ago = datetime.utcnow() - timedelta(days=7)
    total_videos = await session.scalar(select(func.count(Video.id)))
    total_users = await session.scalar(select(func.count(User.id)))
    total_views = await session.scalar(select(func.sum(Video.views))) or 0
    total_likes = await session.scalar(select(func.count(Like.id)))
    total_favorites = await session.scalar(select(func.count(Favorite.id)))
    new_users_week = await session.scalar(select(func.count(User.id)).where(User.created_at >= week_ago))
    new_videos_week = await session.scalar(select(func.count(Video.id)).where(Video.created_at >= week_ago))
    top_videos_result = await session.execute(select(Video).order_by(Video.views.desc()).limit(5))
    top_videos = top_videos_result.scalars().all()
    return {
        "total_videos": total_videos,
        "total_users": total_users,
        "total_views": total_views,
        "total_likes": total_likes,
        "total_favorites": total_favorites,
        "new_users_week": new_users_week,
        "new_videos_week": new_videos_week,
        "top_videos": [{"id": v.id, "title": v.title, "views": v.views} for v in top_videos]
    }
