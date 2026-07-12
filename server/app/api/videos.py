from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from typing import List, Optional

from app.database.db import get_session
from app.models.video import Video
from app.models.category import Category
from app.models.user import User
from app.models.like import Like
from app.models.favorite import Favorite
from app.models.watch_history import WatchHistory
from app.schemas.video import VideoUpdate, VideoResponse
from app.services.upload_service import UploadService
from app.services.video_service import VideoService
from app.middleware.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=VideoResponse, status_code=201)
async def create_video(
    title: str = Form(...),
    description: str = Form(...),
    category_id: int = Form(...),
    file: UploadFile = File(...),
    thumbnail: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")
    cat = await session.get(Category, category_id)
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    video_data = await UploadService.save_video(file, title)
    thumb_path = video_data["thumbnail"]
    if thumbnail:
        thumb_path = await UploadService.save_thumbnail(thumbnail, video_data["filename"])
    new_video = Video(
        title=title,
        description=description,
        category_id=category_id,
        filename=video_data["filename"],
        file_path=video_data["file_path"],
        thumbnail_path=thumb_path,
        duration=video_data.get("duration", 0),
        resolution=video_data.get("resolution", "unknown"),
        file_size=video_data["file_size"],
        uploaded_by=current_user.id
    )
    session.add(new_video)
    await session.commit()
    await session.refresh(new_video)
    return new_video

@router.put("/{video_id}", response_model=VideoResponse)
async def update_video(
    video_id: int,
    video_update: VideoUpdate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")
    video = await session.get(Video, video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    for key, value in video_update.dict(exclude_unset=True).items():
        setattr(video, key, value)
    await session.commit()
    await session.refresh(video)
    return video

@router.delete("/{video_id}")
async def delete_video(
    video_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")
    video = await session.get(Video, video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    await VideoService.delete_video_files(video)
    await session.delete(video)
    await session.commit()
    return {"detail": "Video deleted"}

@router.get("/", response_model=List[VideoResponse])
async def list_videos(
    skip: int = 0,
    limit: int = 20,
    category: Optional[int] = None,
    search: Optional[str] = None,
    session: AsyncSession = Depends(get_session)
):
    query = select(Video)
    if category:
        query = query.where(Video.category_id == category)
    if search:
        query = query.where(or_(
            Video.title.ilike(f"%{search}%"),
            Video.description.ilike(f"%{search}%")
        ))
    query = query.offset(skip).limit(limit).order_by(Video.created_at.desc())
    result = await session.execute(query)
    return result.scalars().all()

@router.get("/{video_id}", response_model=VideoResponse)
async def get_video(video_id: int, session: AsyncSession = Depends(get_session)):
    video = await session.get(Video, video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    video.views += 1
    await session.commit()
    return video

@router.post("/{video_id}/like")
async def like_video(
    video_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    video = await session.get(Video, video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    existing = await session.execute(select(Like).where(Like.video_id == video_id, Like.user_id == current_user.id))
    if existing.scalar():
        return {"detail": "Already liked"}
    like = Like(video_id=video_id, user_id=current_user.id)
    session.add(like)
    video.likes += 1
    await session.commit()
    return {"detail": "Liked"}

@router.delete("/{video_id}/like")
async def unlike_video(
    video_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    video = await session.get(Video, video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    like = await session.execute(select(Like).where(Like.video_id == video_id, Like.user_id == current_user.id))
    like_obj = like.scalar()
    if not like_obj:
        raise HTTPException(status_code=404, detail="Not liked")
    await session.delete(like_obj)
    video.likes -= 1
    await session.commit()
    return {"detail": "Unliked"}

@router.post("/{video_id}/favorite")
async def favorite_video(
    video_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    video = await session.get(Video, video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    existing = await session.execute(select(Favorite).where(Favorite.video_id == video_id, Favorite.user_id == current_user.id))
    if existing.scalar():
        return {"detail": "Already in favorites"}
    fav = Favorite(video_id=video_id, user_id=current_user.id)
    session.add(fav)
    await session.commit()
    return {"detail": "Added to favorites"}

@router.delete("/{video_id}/favorite")
async def unfavorite_video(
    video_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    fav = await session.execute(select(Favorite).where(Favorite.video_id == video_id, Favorite.user_id == current_user.id))
    fav_obj = fav.scalar()
    if not fav_obj:
        raise HTTPException(status_code=404, detail="Not in favorites")
    await session.delete(fav_obj)
    await session.commit()
    return {"detail": "Removed from favorites"}

@router.post("/{video_id}/watch")
async def watch_video(
    video_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    video = await session.get(Video, video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    history = await session.execute(select(WatchHistory).where(WatchHistory.video_id == video_id, WatchHistory.user_id == current_user.id))
    history_obj = history.scalar()
    if history_obj:
        history_obj.watched_at = datetime.utcnow()
    else:
        history_obj = WatchHistory(video_id=video_id, user_id=current_user.id)
        session.add(history_obj)
    await session.commit()
    return {"detail": "Watch recorded"}
