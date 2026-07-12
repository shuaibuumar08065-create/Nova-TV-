from datetime import timedelta

from fastapi import APIRouter, HTTPException
from sqlalchemy import select

from app.core.config import settings
from app.core.security import create_access_token
from app.database.db import AsyncSessionLocal
from app.models.user import User
from app.services.telegram_auth import TelegramAuthService

router = APIRouter()


@router.post("/login")
async def telegram_login(payload: dict):
    init_data = payload.get("initData")

    if not init_data:
        raise HTTPException(status_code=400, detail="initData is required")

    tg_user = TelegramAuthService.validate_init_data(init_data)

    if tg_user is None:
        raise HTTPException(status_code=401, detail="Invalid Telegram data")

    telegram_id = int(tg_user["id"])

    async with AsyncSessionLocal() as session:

        result = await session.execute(
            select(User).where(User.telegram_id == telegram_id)
        )

        user = result.scalar()

        if user is None:
            user = User(
                telegram_id=telegram_id,
                username=tg_user.get("username"),
                first_name=tg_user.get("first_name"),
                last_name=tg_user.get("last_name"),
                photo_url=tg_user.get("photo_url"),
                hashed_password=None,
                is_admin=(telegram_id == settings.ADMIN_TELEGRAM_ID),
            )

            session.add(user)

        else:
            user.username = tg_user.get("username")
            user.first_name = tg_user.get("first_name")
            user.last_name = tg_user.get("last_name")
            user.photo_url = tg_user.get("photo_url")
            user.is_admin = (telegram_id == settings.ADMIN_TELEGRAM_ID)

        await session.commit()
        await session.refresh(user)

        token = create_access_token(
            {"sub": str(user.id)},
            timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        )

        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "telegram_id": user.telegram_id,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "photo_url": user.photo_url,
                "is_admin": user.is_admin,
            },
        }
