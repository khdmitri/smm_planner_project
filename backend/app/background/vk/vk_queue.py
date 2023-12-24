import asyncio
import json
import logging
import os
import re
from datetime import datetime
from typing import List

import vk_api
from asyncpg import Record
from httpx import AsyncClient
from vk_api import VkUpload
from vk_api.vk_api import VkApiMethod

from app.background.db.database import database_instance
from app.background.proxy import ProxyManager
from app.background.utils import read_query
from app.common.logger import get_logger
from app.definitions import QUERIES_ROOT_DIR, MEDIA_ROOT_DIR

FILE_BASE_PATH = os.path.join(QUERIES_ROOT_DIR, "vk/queries")
BASE_FILE_DIRECTORY = MEDIA_ROOT_DIR

# FILE_BASE_PATH = "./queries"

logger = get_logger(logging.INFO)


def text_wrapper(vk_core: VkApiMethod, chat_id: int, message: str):
    vk_core.wall.post(owner_id=chat_id, message=message)


def photo_wrapper(vk_core: VkApiMethod, vk_upload: VkUpload, chat_id: int, message: str, files: str | list):
    result = vk_upload.photo_wall(photos=files, caption=message, group_id=-chat_id)
    attachments = []
    for ind, item in enumerate(result):
        attachments.append(f"photo{item['owner_id']}_{item['id']}")
    vk_core.wall.post(owner_id=chat_id, message=message, attachments=attachments)


def video_wrapper(vk_upload: VkUpload, chat_id: int, name: str, message: str, files: list, link=None):
    if link:
        vk_upload.video(link=link, name=name, description=message, wallpost=True, group_id=-chat_id)
    else:
        for ind, file in enumerate(files):
            if ind == 0:
                vk_upload.video(video_file=file, name=name, description=message, wallpost=True, group_id=-chat_id)
            else:
                vk_upload.video(video_file=file, wallpost=True, group_id=-chat_id)


class VkQueue:
    INSERT_IS_POSTED = '''UPDATE vkqueue 
                          SET is_posted=TRUE, post_result={post_result} 
                          WHERE id={post_id}'''

    def __init__(self):
        self.current_proxy = None
        self.proxy_success = False
        self.async_client = AsyncClient()
        self.proxy_manager = None

    def _format_text(self, text):
        text = re.sub(r"([\r\n]+)", "\n", text)
        return text

    def _get_session(self, access_token):
        vk_session = vk_api.VkApi(token=access_token)
        return vk_session.get_api(), VkUpload(vk_session)

    async def send_all(self):
        stmt = read_query(os.path.join(FILE_BASE_PATH, "queue.sql"))
        posts: List[Record] = await database_instance.fetch_rows(stmt)
        for post in posts:
            result = {}
            try:
                formatted_text = self._format_text(post["text"])
                if post["link"]:
                    result = await self._send_video(access_token=post["access_token"],
                                                    files=None,
                                                    title=post["title"],
                                                    chat_id=post["chat_id"],
                                                    text=formatted_text,
                                                    link=post["link"])
                else:
                    stmt = read_query(os.path.join(FILE_BASE_PATH, "postfiles.sql"))
                    postfiles: List[Record] = await database_instance.fetch_rows(stmt, {"post_id": post["post_id"]})
                    content_type = None
                    files = []
                    if len(postfiles) > 0:
                        for ind, postfile in enumerate(postfiles):
                            filepath = os.path.join(BASE_FILE_DIRECTORY, str(post["user_id"]), postfile["filepath"])
                            if ind == 0:
                                content_type = postfile["content_type"].split("/")[0]
                            files.append(filepath)

                    if content_type is None:
                        content_type = "text"

                    match content_type:
                        case "image":
                            message = post["title"] + "\n\n" + formatted_text if post["title"] else formatted_text
                            result = await self._send_photo(access_token=post["access_token"],
                                                            filepath=files,
                                                            chat_id=post["chat_id"],
                                                            text=message)
                        case "video":
                            result = await self._send_video(access_token=post["access_token"],
                                                            files=files,
                                                            title=post["title"],
                                                            chat_id=post["chat_id"],
                                                            text=formatted_text)
                        case "text":
                            message = post["title"] + "\n\n" + formatted_text if post["title"] else formatted_text
                            result = await self._send_text(access_token=post["access_token"], chat_id=post["chat_id"],
                                                           text=message)

                await database_instance.execute(self.INSERT_IS_POSTED,
                                                {"post_id": post["id"],
                                                 "post_result": json.dumps(result)
                                                 }
                                                )
            except Exception as e:
                template = "An exception of type {0} occurred. Arguments:\n{1!r}"
                message = template.format(type(e).__name__, e.args)
                await database_instance.execute(self.INSERT_IS_POSTED,
                                                {"post_id": post["id"],
                                                 "post_result": json.dumps({"success": False, "msg": message,
                                                                            "when": datetime.now().strftime(
                                                                                "%Y-%m-%d %H:%M:%S")})}
                                                )

    async def _remove_proxy(self):
        if isinstance(self.current_proxy, dict) and self.current_proxy.get("https", None):
            await self.proxy_manager.remove_proxy(self.current_proxy["https"])
            logger.warning(f"Proxy removed: {self.current_proxy['https']}")
        self.current_proxy = None

    async def _send_text(self, *, access_token, chat_id, text):
        result = {"success": True}
        try:
            vk_core, _ = self._get_session(access_token)
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(None, text_wrapper, vk_core, chat_id, text)
        except Exception as e:
            template = "An exception of type {0} occurred. Arguments:\n{1!r}"
            message = template.format(type(e).__name__, e.args)
            logger.error(f"_send_text: {message}")
            result["success"] = False
            result["msg"] = message

        result["when"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        return result

    async def _send_photo(self, *, access_token, chat_id, text, filepath):
        result = {"success": True}
        try:
            vk_core, vk_upload = self._get_session(access_token)
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(None, photo_wrapper, vk_core, vk_upload, chat_id, text, filepath)
        except Exception as e:
            template = "An exception of type {0} occurred. Arguments:\n{1!r}"
            message = template.format(type(e).__name__, e.args)
            logger.error(f"_send_text: {message}")
            result["success"] = False
            result["msg"] = message

        result["when"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        return result

    async def _send_video(self, *, access_token, chat_id, title, text, files, link=None):
        result = {"success": True}
        try:
            _, vk_upload = self._get_session(access_token)
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(None, video_wrapper, vk_upload, chat_id, title, text, files, link)
        except Exception as e:
            template = "An exception of type {0} occurred. Arguments:\n{1!r}"
            message = template.format(type(e).__name__, e.args)
            logger.error(f"_send_text: {message}")
            result["success"] = False
            result["msg"] = message

        result["when"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        return result


if __name__ == '__main__':
    vq = VkQueue()
    asyncio.run(vq.send_all())
