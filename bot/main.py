import asyncio
import logging
from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode

from config import settings
from handlers import start, admin, upload, callbacks, login, errors
from middlewares.admin import AdminMiddleware
from utils.logger import setup_logging


async def main():
    setup_logging(settings.LOG_LEVEL)
    logger = logging.getLogger(__name__)

    bot = Bot(
        token=settings.BOT_TOKEN,
        default=DefaultBotProperties(parse_mode=ParseMode.HTML)
    )
    dp = Dispatcher()

    # Register middlewares
    dp.message.middleware(AdminMiddleware())
    dp.callback_query.middleware(AdminMiddleware())

    # Include routers
    dp.include_router(start.router)
    dp.include_router(admin.router)
    dp.include_router(upload.router)
    dp.include_router(callbacks.router)
    dp.include_router(login.router)
    dp.include_router(errors.router)

    logger.info("Starting bot polling...")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
