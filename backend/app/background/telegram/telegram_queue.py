import asyncio
import os
from typing import List

from aiogram import Bot
from aiogram.types import InputFile, FSInputFile
from asyncpg import Record

from app.background.db.database import database_instance
from app.background.utils import read_query
from app.core.config import settings

FILE_BASE_PATH = "app/background/telegram/queries"
#FILE_BASE_PATH = "./queries"


class TelegramQueue:
    def __init__(self):
        self.bot = Bot(token=settings.TELEGRAM_BOT_TOKEN, parse_mode="MarkdownV2")

    async def send_all(self):
        stmt = read_query(os.path.join(FILE_BASE_PATH, "queue.sql"))
        posts: List[Record] = await database_instance.fetch_rows(stmt)
        for post in posts:
            await self._send_text(post["chat_id"], post["title"])
            stmt = read_query(os.path.join(FILE_BASE_PATH, "postfiles.sql"))
            postfiles: List[Record] = await database_instance.fetch_rows(stmt, {"post_id": post["post_id"]})
            for postfile in postfiles:
                filepath = os.path.join(settings.BASE_FILE_DIRECTORY, str(post["user_id"]), postfile["filepath"])
                await self._send_media(post["chat_id"], filepath, postfile["content_type"].split("/")[0])

            await self._send_text(post["chat_id"], post["text"])

    async def _send_text(self, chat_id, markdown_text):
        await self.bot.send_message(chat_id=chat_id, text=markdown_text)

    async def _send_media(self, chat_id, filename, content_type):
        input_file: FSInputFile = FSInputFile(filename)
        match content_type:
            case "video":
                await self.bot.send_video(chat_id, input_file)
            case "image":
                await self.bot.send_photo(chat_id, input_file)


if __name__ == '__main__':
    tq = TelegramQueue()
    asyncio.run(tq.send_all())
