from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.db import get_session
from app.schemas.auth import Token, LoginRequest
from app.services.auth_service import AuthService
from app.core.security import create_access_token
from app.core.config import settings
from app.middleware.auth import get_current_user
from app.models.user import User

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login"
)


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: AsyncSession = Depends(get_session),
):
    user = await AuthService.authenticate(
        session,
        form_data.username,
        form_data.password,
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
        )

    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES,
        ),
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.post("/login/json", response_model=Token)
async def login_json(
    req: LoginRequest,
    session: AsyncSession = Depends(get_session),
):
    user = await AuthService.authenticate(
        session,
        req.username,
        req.password,
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
        )

    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES,
        ),
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.get("/me")
async def get_me(
    current_user: User = Depends(get_current_user),
):
    return {
        "id": current_user.id,
        "telegram_id": current_user.telegram_id,
        "username": current_user.username,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "photo_url": current_user.photo_url,
        "is_admin": current_user.is_admin,
    }
