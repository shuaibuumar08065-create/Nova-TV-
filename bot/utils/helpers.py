import re
from typing import Optional

def extract_video_id(text: str) -> Optional[int]:
    """Extract numeric ID from text like 'delete 42' or '/delete 42'."""
    match = re.search(r'\b(\d+)\b', text)
    return int(match.group(1)) if match else None

def format_size(bytes_: int) -> str:
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes_ < 1024.0:
            return f"{bytes_:.1f} {unit}"
        bytes_ /= 1024.0
    return f"{bytes_:.1f} TB"
