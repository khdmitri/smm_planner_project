import json
import logging
import os
import re
from datetime import datetime
from typing import List

from asyncpg import Record
from httpx import AsyncClient

from app.background.db.database import database_instance
from app.background.meta.instagram.instagram_api import igApi
from app.background.utils import read_query
from app.common.logger import get_logger
from app.core.config import settings
from app.definitions import QUERIES_ROOT_DIR, MEDIA_ROOT_DIR
from app.schemas import InstagramConfig
from app.schemas.post_file import PostFile

FILE_BASE_PATH = os.path.join(QUERIES_ROOT_DIR, "meta/queries")
BASE_FILE_DIRECTORY = MEDIA_ROOT_DIR

# FILE_BASE_PATH = "./queries"
FACEBOOK_BASE_URL = settings.FACEBOOK_BASE_URL

logger = get_logger(logging.INFO)


class MetaInstQueue:
    INSERT_IS_POSTED = '''UPDATE instagramqueue 
                          SET is_posted=TRUE, post_result={post_result} 
                          WHERE id={post_id}'''

    def __init__(self, session: AsyncClient):
        self.session = session

    def _format_text(self, text):
        text = re.sub(r"([\r\n]+)", "\n", text)
        return text

    async def send_all(self):
        stmt = read_query(os.path.join(FILE_BASE_PATH, "inst_queue.sql"))
        posts: List[Record] = await database_instance.fetch_rows(stmt)
        for post in posts:
            result = {}
            instagram_config = InstagramConfig(marker_token=post["marker_token"], chat_id=post["chat_id"])
            try:
                formatted_text = self._format_text(post["text"])
                formatted_text = post["title"] + "\n\n" + formatted_text

                stmt = read_query(os.path.join(FILE_BASE_PATH, "postfiles.sql"))
                postfiles: List[Record] = await database_instance.fetch_rows(stmt, {"post_id": post["post_id"]})
                if len(postfiles) > 0:
                    postfile_collection = []
                    for postfile in postfiles:
                        post_file_schema = PostFile(filepath=postfile["filepath"],
                                                    content_type=postfile["content_type"])
                        postfile_collection.append(post_file_schema)
                    result = igApi.send_files(self.session, instagram_config, formatted_text, post["user_id"],
                                              postfile_collection)
                    if not isinstance(result, dict):
                        result = {}

                await database_instance.execute(self.INSERT_IS_POSTED, {"post_id": post["id"],
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
