import os
from app.models.video import Video

class VideoService:
    @staticmethod
    async def delete_video_files(video: Video):
        if video.file_path and os.path.exists(video.file_path):
            os.remove(video.file_path)
        if video.thumbnail_path and os.path.exists(video.thumbnail_path):
            os.remove(video.thumbnail_path)
