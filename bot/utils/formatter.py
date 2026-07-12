from typing import List, Dict, Any

def format_video_list(videos: List[Dict[str, Any]]) -> str:
    if not videos:
        return "📭 No videos found."
    lines = []
    for v in videos[:10]:  # limit for readability
        lines.append(
            f"🎬 <b>{v['title']}</b>\n"
            f"ID: {v['id']} | Views: {v['views']} | Likes: {v['likes']}\n"
            f"📅 {v['created_at'][:10]}\n"
        )
    if len(videos) > 10:
        lines.append(f"... and {len(videos)-10} more.")
    return "\n".join(lines)

def format_stats(stats: Dict[str, Any]) -> str:
    return (
        f"📊 <b>Dashboard</b>\n"
        f"📹 Videos: {stats.get('total_videos', 0)}\n"
        f"👤 Users: {stats.get('total_users', 0)}\n"
        f"📂 Categories: {stats.get('total_categories', 0)}\n"
        f"👀 Views: {stats.get('total_views', 0)}"
    )

def format_analytics(data: Dict[str, Any]) -> str:
    top = data.get('top_videos', [])
    top_lines = "\n".join(
        f"  #{i+1} {v['title']} – {v['views']} views"
        for i, v in enumerate(top[:5])
    ) or "None"
    return (
        f"📈 <b>Analytics</b>\n"
        f"📹 Videos: {data.get('total_videos', 0)}\n"
        f"👤 Users: {data.get('total_users', 0)}\n"
        f"👀 Views: {data.get('total_views', 0)}\n"
        f"❤️ Likes: {data.get('total_likes', 0)}\n"
        f"⭐ Favorites: {data.get('total_favorites', 0)}\n"
        f"🆕 New Users (7d): {data.get('new_users_week', 0)}\n"
        f"🆕 New Videos (7d): {data.get('new_videos_week', 0)}\n"
        f"🏆 Top Videos:\n{top_lines}"
    )
