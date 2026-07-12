from sqlalchemy import Column, Integer, String, Boolean, Text
from app.database.db import Base

class Ad(Base):
    __tablename__ = "ads"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    image_url = Column(String)
    link_url = Column(String)
    active = Column(Boolean, default=True)
    position = Column(String, default="sidebar")
