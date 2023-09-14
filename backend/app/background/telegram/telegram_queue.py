import asyncio
import os
from typing import List

from aiogram import Bot
from aiogram.types import InputFile, FSInputFile, InputMediaVideo, InputMediaPhoto
from asyncpg import Record

from app.background.db.database import database_instance
from app.background.utils import read_query
from app.core.config import settings

FILE_BASE_PATH = "app/background/telegram/queries"


# FILE_BASE_PATH = "./queries"


class TelegramQueue:
    def __init__(self):
        self.bot = Bot(token=settings.TELEGRAM_BOT_TOKEN, parse_mode="Markdown")

    async def send_all(self):
        stmt = read_query(os.path.join(FILE_BASE_PATH, "queue.sql"))
        posts: List[Record] = await database_instance.fetch_rows(stmt)
        for post in posts:
            stmt = read_query(os.path.join(FILE_BASE_PATH, "postfiles.sql"))
            postfiles: List[Record] = await database_instance.fetch_rows(stmt, {"post_id": post["post_id"]})
            media_group = []
            content_type = None
            for ind, postfile in enumerate(postfiles):
                filepath = os.path.join(settings.BASE_FILE_DIRECTORY, str(post["user_id"]), postfile["filepath"])
                if ind == 0:
                    content_type = postfile["content_type"].split("/")[0]
                media_group.append(filepath)

            await self._send_media_group(post["chat_id"], markdown_text=post["text"], filenames=media_group,
                                         content_type=content_type)

    async def _send_text(self, chat_id, markdown_text):
        await self.bot.send_message(chat_id=chat_id, text=markdown_text)

    async def _send_media(self, chat_id, *, markdown_text, filename, content_type):
        input_file: FSInputFile = FSInputFile(filename)
        match content_type:
            case "video":
                await self.bot.send_video(chat_id, input_file, caption=markdown_text, protect_content=True)
            case "image":
                await self.bot.send_photo(chat_id, input_file, caption=markdown_text, protect_content=True)

    async def _send_media_group(self, chat_id, *, markdown_text, filenames, content_type):
        media_group = []
        for ind, filename in enumerate(filenames):
            match content_type:
                case "video":
                    if ind == 0:
                        media_group.append(InputMediaVideo(media=FSInputFile(filename), caption=markdown_text))
                    else:
                        media_group.append(InputMediaVideo(media=FSInputFile(filename)))
                case "image":
                    if ind == 0:
                        media_group.append(InputMediaPhoto(media=FSInputFile(filename), caption=markdown_text))
                    else:
                        media_group.append(InputMediaPhoto(media=FSInputFile(filename)))
        if len(media_group) == 0:
            await self._send_text(chat_id, markdown_text)
        elif len(media_group) == 1:
            await self._send_media(chat_id, markdown_text=markdown_text, filename=filenames[0],
                                   content_type=content_type)
        else:
            await self.bot.send_media_group(chat_id, media_group, protect_content=True)


if __name__ == '__main__':
    tq = TelegramQueue()
    asyncio.run(tq.send_all())
