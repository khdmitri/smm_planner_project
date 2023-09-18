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
from httpx import AsyncClient
from requests.exceptions import ProxyError

from app.background.db.database import database_instance
from app.background.proxy import ProxyManager
from app.background.utils import read_query
from app.common.logger import get_logger
from app.core.config import settings

# FILE_BASE_PATH = "app/background/meta/queries"
FILE_BASE_PATH = "./queries"

logger = get_logger(logging.INFO)

proxy_http = [""]
proxy_https = [""]

MAX_ATTEMPTS = 10


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
            try:
                formatted_text = self._format_text(post["text"])
                stmt = read_query(os.path.join(FILE_BASE_PATH, "postfiles.sql"))
                postfiles: List[Record] = await database_instance.fetch_rows(stmt, {"post_id": post["post_id"]})
                if len(postfiles) > 0:
                    for postfile in postfiles:
                        filepath = os.path.join(settings.BASE_FILE_DIRECTORY, str(post["user_id"]),
                                                postfile["filepath"])
                        content_type = postfile["content_type"].split("/")[0]
                        match content_type:
                            case "image":
                                await self._send_photo()
                            case "video":
                                await self._send_video()
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

    async def _send_text(self, *, marker_token, chat_id, text, link=""):
        graph = await self._get_graph(marker_token)
        current_attempt = 1
        result = {"success": True}
        while current_attempt <= MAX_ATTEMPTS:
            try:
                loop = asyncio.get_event_loop()
                result = result = await loop.run_in_executor(None,
                                                             functools.partial(graph.put_object, *(chat_id, "feed", text)))
                break
            except ProxyError:
                if isinstance(self.current_proxy, dict) and self.current_proxy.get("https", None):
                    await self.proxy_manager.remove_proxy(self.current_proxy["https"])
                    logger.warning(f"Proxy removed: {self.current_proxy['https']}")
                self.current_proxy = None
                current_attempt += 1
                graph = self._get_graph(marker_token)
            # except Exception as e:
            #     logger.error(f"_send_text: {str(e)}")
            #     result = {
            #         "success": False,
            #         "msg": str(e)
            #     }
            #     break

        result["when"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        return result

    async def _send_photo(self, chat_id, *, markdown_text, filename, content_type):
        pass

    async def _send_video(self, chat_id, *, markdown_text, filenames, content_type):
        pass


if __name__ == '__main__':
    tq = MetaQueue()
    asyncio.run(tq.send_all())
