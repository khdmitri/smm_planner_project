import asyncio
import functools
import json
import logging
import os
import re
from datetime import datetime
from typing import List

import requests
import vk_api
from asyncpg import Record
from facebook import GraphAPI
from httpx import AsyncClient, ProtocolError
from requests.exceptions import ProxyError, SSLError
from vk_api import VkUpload, VkApi
from vk_api.vk_api import VkApiMethod

from app.background.db.database import database_instance
from app.background.proxy import ProxyManager
from app.background.utils import read_query
from app.common.logger import get_logger
from app.core.config import settings

# FILE_BASE_PATH = "app/background/meta/queries"
FILE_BASE_PATH = "./queries"
BASE_FILE_DIRECTORY = "../../media"

logger = get_logger(logging.INFO)


def text_wrapper(vk_core: VkApiMethod, chat_id: int, message: str):
    vk_core.wall.post(owner_id=chat_id, message=message)


def photo_wrapper(vk_core: VkApiMethod, vk_upload: VkUpload, chat_id: int, title: str, message: str, files: str | list):
    albums = vk_core.photos.getAlbums(owner_id=chat_id)
    print(albums)
    vk_upload.photo(photos=files, description=message, caption=title, group_id=chat_id, album_id=albums["items"][0]["id"])


def video_wrapper(vk_upload: VkUpload, chat_id: int, name: str, message: str, file: str):
    vk_upload.video(video_file=file, group_id=chat_id, description=message, name=name)


class VkQueue:
    INSERT_IS_POSTED = '''UPDATE vkqueue 
                          SET is_posted=TRUE, post_result={post_result} 
                          WHERE id={post_id}'''

    def __init__(self, use_proxy=True):
        self.current_proxy = None
        self.proxy_success = False
        self.async_client = AsyncClient()
        if use_proxy:
            self.proxy_manager: ProxyManager = ProxyManager(self.async_client)
        else:
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
                        result = await self._send_photo(access_token=post["access_token"],
                                                        filepath=files,
                                                        title=post["title"],
                                                        chat_id=post["chat_id"],
                                                        text=formatted_text)
                    case "video":
                        for ind, file in enumerate(files):
                            result = await self._send_video(access_token=post["access_token"],
                                                            filepath=file,
                                                            title=post["title"] if ind == 0 else "",
                                                            chat_id=post["chat_id"],
                                                            text=formatted_text if ind == 0 else "")
                    case "text":
                        result = await self._send_text(access_token=post["access_token"], chat_id=post["chat_id"],
                                                       text=formatted_text)

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

    async def _send_photo(self, *, access_token, chat_id, title, text, filepath):
        result = {"success": True}
        try:
            vk_core, vk_upload = self._get_session(access_token)
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(None, photo_wrapper, vk_core, vk_upload, chat_id, title, text, filepath)
        except Exception as e:
            template = "An exception of type {0} occurred. Arguments:\n{1!r}"
            message = template.format(type(e).__name__, e.args)
            logger.error(f"_send_text: {message}")
            result["success"] = False
            result["msg"] = message

        result["when"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        return result

    async def _send_video(self, *, access_token, chat_id, title, text, filepath):
        result = {"success": True}
        try:
            _, vk_upload = self._get_session(access_token)
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(None, video_wrapper, vk_upload, chat_id, title, text, filepath)
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
