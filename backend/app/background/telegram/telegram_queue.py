import os
from typing import List

from aiogram import Bot
from aiogram.types import InputFile, FSInputFile
from asyncpg import Record

from app.background.db.database import database_instance
from app.background.utils import read_query
from app.core.config import settings

FILE_BASE_PATH = "background/telegram/queries"


class TelegramQueue:
    def __init__(self):
        self.bot = Bot(token=settings.TELEGRAM_BOT_TOKEN, parse_mode="MarkdownV2")

    def send_all(self):
        stmt = read_query(os.path.join(FILE_BASE_PATH, "queue.sql"))
        posts: List[Record] = database_instance.fetch_rows(stmt)
        for post in posts:
            self._send_text(post["chat_id"], post["title"])
            stmt = read_query(os.path.join(FILE_BASE_PATH, "postfiles.sql"))
            postfiles: List[Record] = database_instance.fetch_rows(stmt, {"post_id": post["post_id"]})
            for postfile in postfiles:
                self._send_media(post["chat_id"], postfile["filepath"], postfile["content_type"].split("/")[0])

            self._send_text(post["chat_id"], post["text"])

    def _send_text(self, chat_id, markdown_text):
        self.bot.send_message(chat_id=chat_id, text=markdown_text)

    def _send_media(self, chat_id, filename, content_type):
        input_file: FSInputFile = FSInputFile(os.path.join(FILE_BASE_PATH, filename))
        match content_type:
            case "video":
                self.bot.send_video(chat_id, input_file)
            case "image":
                self.bot.send_photo(chat_id, input_file)

