from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class VideoBase(BaseModel):
    title: str
    description: Optional[str] = None
    category_id: int

class VideoCreate(VideoBase):
    pass

class VideoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None

class VideoResponse(VideoBase):
    id: int
    filename: str
    file_path: str
    thumbnail_path: Optional[str]
    duration: int
    resolution: str
    file_size: int
    views: int
    likes: int
    uploaded_by: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
