from aiogram import Router, F
from aiogram.types import CallbackQuery

from keyboards.inline import admin_panel
from services.auth import AuthService

router = Router()


@router.callback_query(F.data == "admin_login")
async def admin_login(callback: CallbackQuery, is_admin: bool):
    if not is_admin:
        await callback.answer(
            "You are not an administrator.",
            show_alert=True,
        )
        return

    if AuthService.is_authenticated(callback.from_user.id):
        await callback.message.edit_text(
            "✅ Admin Panel",
            reply_markup=admin_panel(),
        )
        await callback.answer()
        return

    miniapp_url = f"{callback.bot.get('miniapp_url', '')}/login"

    await callback.answer()

    await callback.message.answer(
        "🔐 Open the Admin Login page below.",
        reply_markup=None,
    )

    await callback.message.answer(
        f"<a href='{miniapp_url}'>👉 Open Admin Login</a>",
        disable_web_page_preview=True,
    )
