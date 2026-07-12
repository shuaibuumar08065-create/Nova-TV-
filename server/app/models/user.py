from sqlalchemy import Column, Integer, BigInteger, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.database.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    telegram_id = Column(BigInteger, unique=True, index=True, nullable=True)

    username = Column(String, unique=True, index=True, nullable=True)

    first_name = Column(String, nullable=True)

    last_name = Column(String, nullable=True)

    photo_url = Column(String, nullable=True)

    hashed_password = Column(String, nullable=True)

    is_admin = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
