from pydantic import BaseModel
from typing import Optional

class SettingsBase(BaseModel):
    site_name: str = "NOVA TV"
    site_description: str = ""
    maintenance_mode: bool = False

class SettingsResponse(SettingsBase):
    id: int

    class Config:
        from_attributes = True

class SettingsUpdate(BaseModel):
    site_name: Optional[str] = None
    site_description: Optional[str] = None
    maintenance_mode: Optional[bool] = None
