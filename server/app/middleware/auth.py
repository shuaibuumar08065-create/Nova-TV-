from fastapi import Request, HTTPException, status
from fastapi.security.utils import get_authorization_scheme_param
from starlette.middleware.base import BaseHTTPMiddleware
from sqlalchemy import select

from app.core.security import decode_access_token
from app.database.db import AsyncSessionLocal
from app.models.user import User


class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):

        public_paths = {
            "/",
            "/health",
            "/docs",
            "/openapi.json",
            "/redoc",
            "/api/auth/login",
            "/api/auth/login/json",
            "/api/telegram/login",
        }

        # uploads public ne
        if request.url.path.startswith("/uploads/"):
            return await call_next(request)

        # Exact match kawai
        if request.url.path in public_paths:
            return await call_next(request)

        authorization = request.headers.get("Authorization")

        scheme, token = get_authorization_scheme_param(authorization)

        if scheme.lower() == "bearer" and token:
            payload = decode_access_token(token)

            if payload:
                user_id = payload.get("sub")

                if user_id:
                    async with AsyncSessionLocal() as session:
                        result = await session.execute(
                            select(User).where(User.id == int(user_id))
                        )

                        user = result.scalar_one_or_none()

                        if user:
                            request.state.user = user

        return await call_next(request)


async def get_current_user(request: Request):
    user = getattr(request.state, "user", None)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized",
        )

    return user
