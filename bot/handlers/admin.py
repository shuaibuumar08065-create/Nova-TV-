from aiogram import Router, types, F
from aiogram.filters import Command
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton

from filters.admin import AdminFilter
from services.auth import AuthService
from services.statistics import get_dashboard, get_analytics
from services.backend import backend
from utils.formatter import format_stats, format_analytics
from keyboards.inline import admin_panel

router = Router()

@router.message(Command("stats"), AdminFilter())
async def cmd_stats(message: types.Message):
    user_id = message.from_user.id
    token = AuthService.get_token(user_id)
    if not token:
        await message.answer("⚠️ Please /login first.")
        return

    try:
        stats = await get_dashboard(user_id)
        await message.answer(format_stats(stats))
    except Exception as e:
        await message.answer(f"❌ Error: {str(e)}")

@router.message(Command("analytics"), AdminFilter())
async def cmd_analytics(message: types.Message):
    user_id = message.from_user.id
    token = AuthService.get_token(user_id)
    if not token:
        await message.answer("⚠️ Please /login first.")
        return

    try:
        data = await get_analytics(user_id)
        await message.answer(format_analytics(data))
    except Exception as e:
        await message.answer(f"❌ Error: {str(e)}")

@router.message(Command("categories"), AdminFilter())
async def cmd_categories(message: types.Message):
    user_id = message.from_user.id
    token = AuthService.get_token(user_id)
    if not token:
        await message.answer("⚠️ Please /login first.")
        return

    try:
        cats = await backend.get_categories(token)
        if not cats:
            await message.answer("📭 No categories found.")
            return
        lines = ["📂 <b>Categories</b>:"]
        for c in cats:
            lines.append(f"  • {c['name']} (ID: {c['id']})")
        await message.answer("\n".join(lines))
    except Exception as e:
        await message.answer(f"❌ Error: {str(e)}")

@router.message(Command("ads"), AdminFilter())
async def cmd_ads(message: types.Message):
    user_id = message.from_user.id
    token = AuthService.get_token(user_id)
    if not token:
        await message.answer("⚠️ Please /login first.")
        return

    try:
        ads = await backend.get_ads(token)
        if not ads:
            await message.answer("📭 No ads found.")
            return
        lines = ["📰 <b>Ads</b>:"]
        for ad in ads:
            status = "🟢 Active" if ad['active'] else "🔴 Inactive"
            lines.append(f"  • {ad['title']} ({status}) – ID: {ad['id']}")
        await message.answer("\n".join(lines))
    except Exception as e:
        await message.answer(f"❌ Error: {str(e)}")

@router.message(Command("users"), AdminFilter())
async def cmd_users(message: types.Message):
    user_id = message.from_user.id
    token = AuthService.get_token(user_id)
    if not token:
        await message.answer("⚠️ Please /login first.")
        return

    try:
        users = await backend.get_users(token)
        if not users:
            await message.answer("📭 No users found.")
            return
        lines = ["👥 <b>Users</b>:"]
        for u in users[:20]:
            admin_mark = " (admin)" if u['is_admin'] else ""
            lines.append(f"  • {u['username']}{admin_mark} – ID: {u['id']}")
        await message.answer("\n".join(lines))
    except Exception as e:
        await message.answer(f"❌ Error: {str(e)}")

@router.message(Command("settings"), AdminFilter())
async def cmd_settings(message: types.Message):
    user_id = message.from_user.id
    token = AuthService.get_token(user_id)
    if not token:
        await message.answer("⚠️ Please /login first.")
        return

    try:
        settings = await backend.get_settings(token)
        text = (
            f"⚙️ <b>Current Settings</b>\n"
            f"Site Name: {settings.get('site_name', 'N/A')}\n"
            f"Description: {settings.get('site_description', 'N/A')}\n"
            f"Maintenance: {'🟢 On' if settings.get('maintenance_mode') else '🔴 Off'}"
        )
        await message.answer(text)
    except Exception as e:
        await message.answer(f"❌ Error: {str(e)}")
