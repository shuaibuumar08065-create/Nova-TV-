from sqlalchemy import Column, Integer, String, Boolean
from app.database.db import Base

class Settings(Base):
    __tablename__ = "settings"
    id = Column(Integer, primary_key=True, index=True)
    site_name = Column(String, default="NOVA TV")
    site_description = Column(String, default="")
    maintenance_mode = Column(Boolean, default=False)
    allow_registration = Column(Boolean, default=False)
