import os
import uuid
from fastapi import UploadFile
import aiofiles
from app.core.config import settings
from app.services.ffmpeg_service import FFmpegService

class UploadService:
    @staticmethod
    async def save_video(file: UploadFile, title: str) -> dict:
        ext = os.path.splitext(file.filename)[1]
        new_filename = f"{uuid.uuid4().hex}{ext}"
        file_path = os.path.join(settings.UPLOAD_DIR, new_filename)
        async with aiofiles.open(file_path, "wb") as out_file:
            content = await file.read()
            await out_file.write(content)
        file_size = os.path.getsize(file_path)
        duration, resolution = FFmpegService.get_video_info(file_path)
        thumb_name = f"{uuid.uuid4().hex}.jpg"
        thumb_path = os.path.join(settings.UPLOAD_DIR, thumb_name)
        FFmpegService.generate_thumbnail(file_path, thumb_path)
        return {
            "filename": new_filename,
            "file_path": file_path,
            "file_size": file_size,
            "duration": duration,
            "resolution": resolution,
            "thumbnail": thumb_path
        }

    @staticmethod
    async def save_thumbnail(file: UploadFile, video_filename: str) -> str:
        ext = os.path.splitext(file.filename)[1]
        thumb_name = f"{uuid.uuid4().hex}{ext}"
        thumb_path = os.path.join(settings.UPLOAD_DIR, thumb_name)
        async with aiofiles.open(thumb_path, "wb") as out_file:
            content = await file.read()
            await out_file.write(content)
        return thumb_path
