from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class AdBase(BaseModel):
    title: str
    description: Optional[str] = None

    image_url: Optional[str] = None
    link_url: Optional[str] = None

    active: bool = True
    position: str = "sidebar"

    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class AdCreate(AdBase):
    pass


class AdUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

    image_url: Optional[str] = None
    link_url: Optional[str] = None

    active: Optional[bool] = None
    position: Optional[str] = None

    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class AdResponse(AdBase):
    id: int

    views: int
    clicks: int

    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
