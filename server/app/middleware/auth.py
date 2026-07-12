from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from sqlalchemy import select

from app.core.security import decode_access_token
from app.database.db import AsyncSessionLocal
from app.models.user import User


class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):

        public_paths = [
            "/",
            "/health",
            "/docs",
            "/openapi.json",
            "/redoc",
            "/uploads",
            "/api/auth/login",
            "/api/auth/login/json",
            "/api/telegram/login",
        ]

        if any(request.url.path.startswith(p) for p in public_paths):
            return await call_next(request)

        auth = request.headers.get("Authorization")

        if auth and auth.startswith("Bearer "):

            token = auth.replace("Bearer ", "")

            payload = decode_access_token(token)

            if payload:

                user_id = payload.get("sub")

                if user_id:

                    async with AsyncSessionLocal() as session:

                        result = await session.execute(
                            select(User).where(User.id == int(user_id))
                        )

                        user = result.scalar()

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
