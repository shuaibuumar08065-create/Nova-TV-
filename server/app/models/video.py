from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, BigInteger
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.db import Base

class Video(Base):
    __tablename__ = "videos"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, default="")
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    thumbnail_path = Column(String)
    duration = Column(Integer, default=0)
    resolution = Column(String, default="unknown")
    file_size = Column(BigInteger, default=0)
    views = Column(Integer, default=0)
    likes = Column(Integer, default=0)
    category_id = Column(Integer, ForeignKey("categories.id"))
    uploaded_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    category = relationship("Category")
    uploader = relationship("User")
