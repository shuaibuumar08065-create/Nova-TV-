from aiogram.types import (
    InlineKeyboardMarkup,
    InlineKeyboardButton,
    WebAppInfo,
)

from config import settings


def user_menu() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="📺 OPEN NOVA TV",
                    web_app=WebAppInfo(
                        url=settings.MINIAPP_URL
                    ),
                )
            ]
        ]
    )


def start_menu() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="📺 OPEN NOVA TV",
                    web_app=WebAppInfo(
                        url=settings.MINIAPP_URL
                    ),
                )
            ],
            [
                InlineKeyboardButton(
                    text="🔐 ADMIN LOGIN",
                    web_app=WebAppInfo(
                        url=f"{settings.MINIAPP_URL}/login"
                    ),
                )
            ]
        ]
    )


def admin_panel() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="📊 Dashboard",
                    callback_data="stats",
                ),
                InlineKeyboardButton(
                    text="📈 Analytics",
                    callback_data="analytics",
                ),
            ],
            [
                InlineKeyboardButton(
                    text="📹 Upload Video",
                    callback_data="upload",
                ),
                InlineKeyboardButton(
                    text="📂 Categories",
                    callback_data="categories",
                ),
            ],
            [
                InlineKeyboardButton(
                    text="📰 Ads",
                    callback_data="ads",
                ),
                InlineKeyboardButton(
                    text="👥 Users",
                    callback_data="users",
                ),
            ],
            [
                InlineKeyboardButton(
                    text="⚙️ Settings",
                    callback_data="settings",
                ),
                InlineKeyboardButton(
                    text="🚪 Logout",
                    callback_data="logout",
                ),
            ],
        ]
    )


def category_list(categories, page=0):
    buttons = []

    for cat in categories[:10]:
        buttons.append(
            [
                InlineKeyboardButton(
                    text=cat["name"],
                    callback_data=f"cat_{cat['id']}",
                )
            ]
        )

    return InlineKeyboardMarkup(
        inline_keyboard=buttons
    )
