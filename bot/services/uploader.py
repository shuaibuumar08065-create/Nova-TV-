import os
from typing import Optional, Dict

import aiofiles

from services.backend import backend
from services.auth import AuthService
from config import settings

DOWNLOAD_DIR = "downloads"


async def ensure_download_dir():
    os.makedirs(DOWNLOAD_DIR, exist_ok=True)


async def download_file(bot, file_id: str, filename: str) -> str:
    await ensure_download_dir()

    file = await bot.get_file(file_id)
    file_path = os.path.join(DOWNLOAD_DIR, filename)

    await bot.download_file(file.file_path, file_path)

    return file_path


async def upload_video_from_telegram(
    bot,
    user_id: int,
    title: str,
    description: str,
    category_id: int,
    file_id: str,
    filename: str,
    thumbnail_id: Optional[str] = None,
) -> Dict:

    token = AuthService.get_token(user_id)

    if not token:
        raise Exception("User not authenticated. Please /login first.")

    video_path = await download_file(bot, file_id, filename)

    thumb_path = None

    if thumbnail_id:
        thumb_filename = f"thumb_{filename}.jpg"
        thumb_path = await download_file(
            bot,
            thumbnail_id,
            thumb_filename,
        )

    try:
        result = await backend.upload_video(
            token=token,
            title=title,
            description=description,
            category_id=category_id,
            file_path=video_path,
            thumbnail_path=thumb_path,
        )

        return result

    finally:
        if os.path.exists(video_path):
            os.remove(video_path)

        if thumb_path and os.path.exists(thumb_path):
            os.remove(thumb_path)
