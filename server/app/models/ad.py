from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime
from sqlalchemy.sql import func
from app.database.db import Base


class Ad(Base):
    __tablename__ = "ads"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    image_url = Column(String, nullable=True)
    link_url = Column(String, nullable=True)

    active = Column(Boolean, default=True)
    position = Column(String, default="sidebar")

    views = Column(Integer, default=0)
    clicks = Column(Integer, default=0)

    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
