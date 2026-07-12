from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import db
from app.database.db import engine, AsyncSessionLocal
from app.models import (
    user,
    video,
    category,
    ad,
    settings,
    watch_history,
    like,
    favorite,
)

from app.api import (
    auth,
    telegram_auth,
    videos,
    categories,
    users,
    admin,
    ads,
    settings as settings_api,
    analytics,
)

from app.middleware.auth import AuthMiddleware
from app.middleware.rate_limit import RateLimitMiddleware
from app.core.config import settings as app_settings
from app.services.auth_service import AuthService


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(db.Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        await AuthService.create_admin(session)

    yield

    await engine.dispose()


app = FastAPI(
    title="NOVA TV API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(AuthMiddleware)
app.add_middleware(RateLimitMiddleware)

# Authentication
app.include_router(
    auth.router,
    prefix="/api/auth",
    tags=["Authentication"],
)

app.include_router(
    telegram_auth.router,
    prefix="/api/telegram",
    tags=["Telegram Authentication"],
)

# API
app.include_router(
    videos.router,
    prefix="/api/videos",
    tags=["Videos"],
)

app.include_router(
    categories.router,
    prefix="/api/categories",
    tags=["Categories"],
)

app.include_router(
    users.router,
    prefix="/api/users",
    tags=["Users"],
)

app.include_router(
    admin.router,
    prefix="/api/admin",
    tags=["Admin"],
)

app.include_router(
    ads.router,
    prefix="/api/ads",
    tags=["Advertisements"],
)

app.include_router(
    settings_api.router,
    prefix="/api/settings",
    tags=["Settings"],
)

app.include_router(
    analytics.router,
    prefix="/api/analytics",
    tags=["Analytics"],
)

app.mount(
    "/uploads",
    StaticFiles(directory=app_settings.UPLOAD_DIR),
    name="uploads",
)


@app.get("/")
async def root():
    return {
        "app": "NOVA TV API",
        "status": "running",
    }


@app.get("/health")
async def health():
    return {
        "status": "ok",
    }
