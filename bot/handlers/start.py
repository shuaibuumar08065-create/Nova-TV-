from aiogram import Router, types
from aiogram.filters import Command

from keyboards.inline import start_menu, user_menu

router = Router()


@router.message(Command("start"))
async def cmd_start(message: types.Message, is_admin: bool):
    text = (
        "🎬 <b>Welcome to NOVA TV</b>\n\n"
        "Watch unlimited videos inside Telegram."
    )

    if is_admin:
        await message.answer(
            text,
            reply_markup=start_menu(),
        )
    else:
        await message.answer(
            text,
            reply_markup=user_menu(),
        )
