import asyncio
import functools
import json
import logging
import os
import re
from datetime import datetime
from typing import List

from asyncpg import Record
from facebook import GraphAPI
from httpx import AsyncClient, ProtocolError
from requests.exceptions import ProxyError, SSLError

from app.background.db.database import database_instance
from app.background.proxy import ProxyManager
from app.background.utils import read_query
from app.common.logger import get_logger
from app.core.config import settings

# FILE_BASE_PATH = "app/background/meta/queries"
FILE_BASE_PATH = "./queries"
BASE_FILE_DIRECTORY = "../../media"

logger = get_logger(logging.INFO)

proxy_http = [""]
proxy_https = [""]

MAX_ATTEMPTS = 20


def put_text_wrapper(graph, parent_object, connection_name, message):
    graph.put_object(parent_object, connection_name, message=message)


def put_photo_wrapper(graph: GraphAPI, parent_object, photo, message):
    graph.put_photo(image=open(photo, 'rb'), message=message)


class MetaQueue:
    INSERT_IS_POSTED = '''UPDATE facebookqueue 
                          SET is_posted=TRUE, post_result={post_result} 
                          WHERE id={post_id}'''

    def __init__(self, use_proxy=True):
        self.current_proxy = None
        self.async_client = AsyncClient()
        if use_proxy:
            self.proxy_manager: ProxyManager = ProxyManager(self.async_client)
        else:
            self.proxy_manager = None

    def _format_text(self, text):
        text = re.sub(r"([\r\n]+)", "\n", text)
        return text

    async def _get_graph(self, marker_token):
        if self.proxy_manager is not None and self.current_proxy is None:
            self.current_proxy = {
                "https": await self.proxy_manager.get_random_proxy("https"),
                "http": await self.proxy_manager.get_random_proxy("http"),
            }
        if self.current_proxy:
            return GraphAPI(
                access_token=marker_token,
                proxies=self.current_proxy
            )
        else:
            return GraphAPI(
                access_token=marker_token
            )

    async def send_all(self):
        stmt = read_query(os.path.join(FILE_BASE_PATH, "queue.sql"))
        posts: List[Record] = await database_instance.fetch_rows(stmt)
        for post in posts:
            result = {}
            try:
                formatted_text = self._format_text(post["text"])
                stmt = read_query(os.path.join(FILE_BASE_PATH, "postfiles.sql"))
                postfiles: List[Record] = await database_instance.fetch_rows(stmt, {"post_id": post["post_id"]})
                if len(postfiles) > 0:
                    for postfile in postfiles:
                        filepath = os.path.join(BASE_FILE_DIRECTORY, str(post["user_id"]), postfile["filepath"])
                        content_type = postfile["content_type"].split("/")[0]
                        match content_type:
                            case "image":
                                result = await self._send_photo(marker_token=post["marker_token"], filepath=filepath,
                                                                chat_id=post["chat_id"],
                                                                text=formatted_text)
                            case "video":
                                result = await self._send_video()
                else:
                    result = await self._send_text(marker_token=post["marker_token"], chat_id=post["chat_id"],
                                                   text=formatted_text)

                await database_instance.execute(self.INSERT_IS_POSTED,
                                                {"post_id": post["id"],
                                                 "post_result": json.dumps(result)
                                                 }
                                                )
            except Exception as e:
                await database_instance.execute(self.INSERT_IS_POSTED,
                                                {"post_id": post["id"],
                                                 "post_result": json.dumps({"success": False, "msg": str(e),
                                                                            "when": datetime.now().strftime(
                                                                                "%Y-%m-%d %H:%M:%S")})}
                                                )

    async def _remove_proxy(self):
        if isinstance(self.current_proxy, dict) and self.current_proxy.get("https", None):
            await self.proxy_manager.remove_proxy(self.current_proxy["https"])
            logger.warning(f"Proxy removed: {self.current_proxy['https']}")
        self.current_proxy = None

    async def _send_text(self, *, marker_token, chat_id, text, link=""):
        graph = await self._get_graph(marker_token)
        current_attempt = 1
        result = {"success": True}
        last_error = None
        while current_attempt <= MAX_ATTEMPTS:
            try:
                loop = asyncio.get_event_loop()
                await loop.run_in_executor(None, put_text_wrapper, graph, chat_id, "feed", text)
                logger.info(f"Proxy is successfully worked: {self.current_proxy}")
                break
            except [ProxyError, SSLError, ConnectionError]:
                await self._remove_proxy()
                current_attempt += 1
                graph = await self._get_graph(marker_token)
            except Exception as e:
                logger.error(f"_send_text: {str(e)}")
                last_error = str(e)
                break

        if current_attempt > MAX_ATTEMPTS:
            result["success"] = False
            result["msg"] = "Max attempts is exceeded"
        elif last_error is not None:
            result["success"] = False
            result["msg"] = last_error

        result["when"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        return result

    async def _send_photo(self, *, marker_token, chat_id, text, filepath, link=""):
        graph = await self._get_graph(marker_token)
        current_attempt = 1
        result = {"success": True}
        last_error = None
        while current_attempt <= MAX_ATTEMPTS:
            try:
                loop = asyncio.get_event_loop()
                await loop.run_in_executor(None, put_photo_wrapper, graph, chat_id, filepath, text)
                logger.info(f"Proxy is successfully worked: {self.current_proxy}")
                break
            except (ProxyError, SSLError, ProtocolError):
                await self._remove_proxy()
                current_attempt += 1
                graph = await self._get_graph(marker_token)
            except Exception as e:
                template = "An exception of type {0} occurred. Arguments:\n{1!r}"
                message = template.format(type(e).__name__, e.args)
                logger.error(f"_send_text: {message}")
                last_error = str(e)
                if type(e).__name__ in ["ConnectionError", ]:
                    await self._remove_proxy()
                    current_attempt += 1
                    graph = await self._get_graph(marker_token)
                else:
                    break

        if current_attempt > MAX_ATTEMPTS:
            result["success"] = False
            result["msg"] = "Max attempts is exceeded"
        elif last_error is not None:
            result["success"] = False
            result["msg"] = last_error

        result["when"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        return result

    async def _send_video(self, chat_id, *, markdown_text, filenames, content_type):
        pass


if __name__ == '__main__':
    tq = MetaQueue()
    asyncio.run(tq.send_all())
