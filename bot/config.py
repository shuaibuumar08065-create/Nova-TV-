import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    BOT_TOKEN: str
    BACKEND_URL: str
    MINIAPP_URL: str
    ADMIN_IDS: str  # comma separated
    REQUEST_TIMEOUT: int = 60
    LOG_LEVEL: str = "INFO"

    @property
    def admin_list(self) -> List[int]:
        return [int(id.strip()) for id in self.ADMIN_IDS.split(",") if id.strip()]

    class Config:
        env_file = ".env"

settings = Settings()
