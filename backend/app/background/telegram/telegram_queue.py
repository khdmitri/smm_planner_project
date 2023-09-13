from aiogram import Bot
from app.background.db.database import database_instance
from app.core.config import settings


class TelegramQueue:
    def __init__(self):
        self.bot = Bot(token=settings.TELEGRAM_BOT_TOKEN, parse_mode="MarkdownV2")

    def send_from_queue(self):
        pass
