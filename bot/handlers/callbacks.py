from aiogram import Router, types, F
from aiogram.types import CallbackQuery

from services.auth import AuthService
from services.statistics import get_dashboard, get_analytics
from services.backend import backend
from utils.formatter import format_stats, format_analytics
from keyboards.inline import admin_panel, start_menu

router = Router()

@router.callback_query(F.data == "stats")
async def cb_stats(callback: CallbackQuery):
    user_id = callback.from_user.id
    token = AuthService.get_token(user_id)
    if not token:
        await callback.answer("Please /login first.", show_alert=True)
        return
    try:
        stats = await get_dashboard(user_id)
        await callback.message.edit_text(
            format_stats(stats),
            reply_markup=admin_panel()
        )
    except Exception as e:
        await callback.message.edit_text(f"❌ Error: {str(e)}")
    await callback.answer()

@router.callback_query(F.data == "analytics")
async def cb_analytics(callback: CallbackQuery):
    user_id = callback.from_user.id
    token = AuthService.get_token(user_id)
    if not token:
        await callback.answer("Please /login first.", show_alert=True)
        return
    try:
        data = await get_analytics(user_id)
        await callback.message.edit_text(
            format_analytics(data),
            reply_markup=admin_panel()
        )
    except Exception as e:
        await callback.message.edit_text(f"❌ Error: {str(e)}")
    await callback.answer()

@router.callback_query(F.data == "upload")
async def cb_upload(callback: CallbackQuery):
    user_id = callback.from_user.id
    token = AuthService.get_token(user_id)
    if not token:
        await callback.answer("Please /login first.", show_alert=True)
        return
    # Trigger upload command
    await callback.message.answer("Use /upload command to start uploading.")
    await callback.answer()

@router.callback_query(F.data == "categories")
async def cb_categories(callback: CallbackQuery):
    user_id = callback.from_user.id
    token = AuthService.get_token(user_id)
    if not token:
        await callback.answer("Please /login first.", show_alert=True)
        return
    try:
        cats = await backend.get_categories(token)
        lines = ["📂 Categories:"]
        for c in cats:
            lines.append(f"  • {c['name']} (ID: {c['id']})")
        await callback.message.edit_text(
            "\n".join(lines),
            reply_markup=admin_panel()
        )
    except Exception as e:
        await callback.message.edit_text(f"❌ Error: {str(e)}")
    await callback.answer()

@router.callback_query(F.data == "ads")
async def cb_ads(callback: CallbackQuery):
    user_id = callback.from_user.id
    token = AuthService.get_token(user_id)
    if not token:
        await callback.answer("Please /login first.", show_alert=True)
        return
    try:
        ads = await backend.get_ads(token)
        lines = ["📰 Ads:"]
        for ad in ads:
            status = "🟢 Active" if ad['active'] else "🔴 Inactive"
            lines.append(f"  • {ad['title']} ({status}) – ID: {ad['id']}")
        await callback.message.edit_text(
            "\n".join(lines),
            reply_markup=admin_panel()
        )
    except Exception as e:
        await callback.message.edit_text(f"❌ Error: {str(e)}")
    await callback.answer()

@router.callback_query(F.data == "users")
async def cb_users(callback: CallbackQuery):
    user_id = callback.from_user.id
    token = AuthService.get_token(user_id)
    if not token:
        await callback.answer("Please /login first.", show_alert=True)
        return
    try:
        users = await backend.get_users(token)
        lines = ["👥 Users:"]
        for u in users[:20]:
            admin_mark = " (admin)" if u['is_admin'] else ""
            lines.append(f"  • {u['username']}{admin_mark} – ID: {u['id']}")
        await callback.message.edit_text(
            "\n".join(lines),
            reply_markup=admin_panel()
        )
    except Exception as e:
        await callback.message.edit_text(f"❌ Error: {str(e)}")
    await callback.answer()

@router.callback_query(F.data == "settings")
async def cb_settings(callback: CallbackQuery):
    user_id = callback.from_user.id
    token = AuthService.get_token(user_id)
    if not token:
        await callback.answer("Please /login first.", show_alert=True)
        return
    try:
        settings = await backend.get_settings(token)
        text = (
            f"⚙️ <b>Current Settings</b>\n"
            f"Site Name: {settings.get('site_name', 'N/A')}\n"
            f"Description: {settings.get('site_description', 'N/A')}\n"
            f"Maintenance: {'🟢 On' if settings.get('maintenance_mode') else '🔴 Off'}"
        )
        await callback.message.edit_text(text, reply_markup=admin_panel())
    except Exception as e:
        await callback.message.edit_text(f"❌ Error: {str(e)}")
    await callback.answer()

@router.callback_query(F.data == "logout")
async def cb_logout(callback: CallbackQuery):
    user_id = callback.from_user.id
    if AuthService.logout(user_id):
        await callback.message.edit_text(
            "✅ Logged out successfully.",
            reply_markup=start_menu()
        )
    else:
        await callback.message.edit_text("⚠️ You were not logged in.")
    await callback.answer()

# Generic cancel handler (optional)
@router.callback_query(F.data == "cancel")
async def cb_cancel(callback: CallbackQuery):
    await callback.message.delete()
    await callback.answer("Cancelled.")
