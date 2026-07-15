from pydantic import BaseModel
from typing import Optional


class AdBase(BaseModel):
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    link_url: Optional[str] = None
    active: bool = True
    position: str = "sidebar"


class AdCreate(AdBase):
    pass


class AdUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    link_url: Optional[str] = None
    active: Optional[bool] = None
    position: Optional[str] = None


class AdResponse(AdBase):
    id: int
    views: int
    clicks: int

    class Config:
        from_attributes = True
