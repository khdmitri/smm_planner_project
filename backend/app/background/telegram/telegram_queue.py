import asyncio
import json
import logging
import os
import re
from datetime import datetime
from typing import List

from aiogram import Bot
from aiogram.client.session.aiohttp import AiohttpSession
from aiogram.types import InputFile, FSInputFile, InputMediaVideo, InputMediaPhoto
from asyncpg import Record

from app.background.db.database import database_instance
from app.background.utils import read_query
from app.common.logger import get_logger
from app.core.config import settings
from app.definitions import QUERIES_ROOT_DIR, MEDIA_ROOT_DIR

FILE_BASE_PATH = os.path.join(QUERIES_ROOT_DIR, "telegram/queries")
BASE_FILE_DIRECTORY = MEDIA_ROOT_DIR
# FILE_BASE_PATH = "./queries"

logger = get_logger(logging.INFO)
SUPPORTED_VIDEO_FORMATS = (".mp4", ".avi", )


class TelegramQueue:
    INSERT_IS_POSTED = '''UPDATE telegramqueue 
                          SET is_posted=TRUE, post_result={post_result} 
                          WHERE id={post_id}'''

    def __init__(self):
        self._session = AiohttpSession()
        self.bot = Bot(token=settings.TELEGRAM_BOT_TOKEN, parse_mode="HTML", session=self._session)

    def _format_html(self, text, title, link=None):
        title = "<b>"+title+"</b>\n\n"
        if link is not None:
            text = title + link + link + "\n" + text
        else:
            text = title + text
        text = re.sub(r"(<p.*?>)", "", text)
        text = re.sub(r"(<\/p.*?>)", "\n", text)
        text = re.sub(r"(<\/?span.*?>)", "", text)
        text = re.sub(r"(<\/?span.*?>)", "", text)
        text = re.sub(r"(\s+rel=\".*?\")", "", text)
        text = re.sub(r"(\s+class=\".*?\")", "", text)
        return text

    async def close(self):
        await self._session.close()

    @staticmethod
    def _check_video_type(link: str):
        if not link:
            return None, None
        else:
            if link.endswith(SUPPORTED_VIDEO_FORMATS):
                return link, None
            else:
                return None, link

    async def send_all(self):
        stmt = read_query(os.path.join(FILE_BASE_PATH, "queue.sql"))
        posts: List[Record] = await database_instance.fetch_rows(stmt)
        for post in posts:
            try:
                video_url, video_embed = TelegramQueue._check_video_type(post["link"])
                formatted_text = self._format_html(post["text"], post["title"], video_embed)
                stmt = read_query(os.path.join(FILE_BASE_PATH, "postfiles.sql"))
                postfiles: List[Record] = await database_instance.fetch_rows(stmt, {"post_id": post["post_id"]})
                media_group = []
                content_type = None
                for ind, postfile in enumerate(postfiles):
                    filepath = os.path.join(BASE_FILE_DIRECTORY, str(post["user_id"]), postfile["filepath"])
                    if ind == 0:
                        content_type = postfile["content_type"].split("/")[0]
                    media_group.append(filepath)

                await self._send_media_group(post["chat_id"], markdown_text=formatted_text, filenames=media_group,
                                             content_type=content_type, video_url=video_url)
                await database_instance.execute(self.INSERT_IS_POSTED,
                                                {"post_id": post["id"],
                                                 "post_result": json.dumps({"success": True,
                                                                            "when": datetime.now().strftime(
                                                                                "%Y-%m-%d %H:%M:%S")})
                                                 }
                                                )
            except Exception as e:
                await database_instance.execute(self.INSERT_IS_POSTED,
                                                {"post_id": post["id"],
                                                 "post_result": json.dumps({"success": False, "msg": str(e),
                                                                            "when": datetime.now().strftime("%Y-%m-%d %H:%M:%S")})}
                                                )

    async def _send_text(self, chat_id, markdown_text):
        await self.bot.send_message(chat_id=chat_id, text=markdown_text)

    async def _send_media(self, chat_id, *, markdown_text, filename, content_type, video_url=None):
        if video_url:
            await self.bot.send_video(chat_id, video_url, caption=markdown_text, protect_content=True)
        else:
            input_file: FSInputFile = FSInputFile(filename)
            match content_type:
                case "video":
                    await self.bot.send_video(chat_id, input_file, caption=markdown_text, protect_content=True)
                case "image":
                    await self.bot.send_photo(chat_id, input_file, caption=markdown_text, protect_content=True)

    async def _send_media_group(self, chat_id, *, markdown_text, filenames, content_type, video_url=None):
        if video_url:
            await self._send_media(chat_id, markdown_text=markdown_text, filename=filenames, content_type=None,
                                   video_url=video_url)
        else:
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
