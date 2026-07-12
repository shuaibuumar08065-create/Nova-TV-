import logging
from aiogram import Router
from aiogram.types import ErrorEvent

router = Router()
logger = logging.getLogger(__name__)

@router.errors()
async def handle_errors(event: ErrorEvent):
    logger.exception("An error occurred: %s", event.exception)
    # Optionally notify admin
