import subprocess
import json

class FFmpegService:
    @staticmethod
    def get_video_info(file_path: str):
        try:
            cmd = [
                "ffprobe", "-v", "error", "-select_streams", "v:0",
                "-show_entries", "stream=duration,width,height",
                "-of", "json", file_path
            ]
            result = subprocess.run(cmd, capture_output=True, text=True)
            data = json.loads(result.stdout)
            streams = data.get("streams", [])
            if streams:
                stream = streams[0]
                duration = int(float(stream.get("duration", 0)))
                width = stream.get("width", 0)
                height = stream.get("height", 0)
                resolution = f"{width}x{height}" if width and height else "unknown"
                return duration, resolution
            return 0, "unknown"
        except Exception:
            return 0, "unknown"

    @staticmethod
    def generate_thumbnail(input_path: str, output_path: str, time_offset: int = 5):
        cmd = [
            "ffmpeg", "-i", input_path, "-ss", str(time_offset), "-vframes", "1",
            "-vf", "scale=320:-1", output_path, "-y"
        ]
        subprocess.run(cmd, capture_output=True, text=True)
