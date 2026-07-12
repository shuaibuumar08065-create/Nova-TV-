from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SECRET_KEY: str = "change_this_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "admin123"

    ADMIN_TELEGRAM_ID: int = 7221370967

    BOT_TOKEN: str = ""

    DATABASE_URL: str = "sqlite+aiosqlite:///./nova.db"

    UPLOAD_DIR: str = "./app/uploads"
    LOG_DIR: str = "./app/logs"

    class Config:
        env_file = ".env"


settings = Settings()
