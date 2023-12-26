import json
import logging
import os.path
from typing import List

from httpx import AsyncClient

from app.common.logger import get_logger
from app.core.config import settings
from app.schemas import InstagramConfig
from app.schemas.post_file import PostFile

logger = get_logger(logging.INFO)

INSTAGRAM_BASE_URL = settings.INSTAGRAM_BASE_URL


class InstagramApi:
    @staticmethod
    async def send_files(session: AsyncClient, ig_config: InstagramConfig, caption, db_data: List[PostFile]):
        containers: List[str] = []
        server_media_base_url = settings.SERVER_API_URL

        def add_2_container(new_item):
            containers.append(new_item)

        media_count = len(db_data)
        if media_count < 1:
            logger.warning("IG: no media files were found...")
            return {
                "success": False,
                "message": "No media files found"
            }
        else:
            if media_count > 1:
                for db_item in db_data:
                    await InstagramApi._create_container(
                        session, ig_config, add_2_container,
                        os.path.join(server_media_base_url, f"document/get_media/{db_item.id}"),
                        db_item, caption, True)
                if len(containers) > 1:
                    res = await InstagramApi._create_ring_container(session, ig_config, containers.copy())
                    if isinstance(res, dict):
                        if res["success"]:
                            container_id = json.loads(res["text"]["id"])
                            return await InstagramApi._publish_container(session, container_id, ig_config)
                        else:
                            return res
                    else:
                        logger.error(f"Unprocessed error: {str(res)}")
                        return {
                            "success": False,
                            "message": "Unprocessed error"
                        }
            else:
                res = await InstagramApi._create_container(
                    session, ig_config, add_2_container,
                    os.path.join(server_media_base_url, f"document/get_media/{db_data[0].id}"),
                    db_data[0], caption)
                if isinstance(res, dict):
                    if res["success"]:
                        return await InstagramApi._publish_container(session, containers[0], ig_config)
                    else:
                        logger.error(f"Wrong result: {str(res)}")
                        return res

    @staticmethod
    async def _publish_container(session: AsyncClient, container_id, ig_config: InstagramConfig):
        params = {
            "access_token": ig_config.marker_token,
            "creation_id": container_id,
        }
        res = await session.post(os.path.join(INSTAGRAM_BASE_URL, ig_config.chat_id, "media_publish"), params=params)
        if res.status_code in [200, 201]:
            return {
                "success": True,
                "message": "Container was successfully published"
            }
        else:
            logger.error(f"Wrong result: {str(res)}")
            return {
                "success": False,
                "message": f"Server returned status code {res.status_code} and text {res.text}"
            }

    @staticmethod
    async def _create_ring_container(session: AsyncClient, ig_config: InstagramConfig, ids: list):
        params = {
            "access_token": ig_config.marker_token,
            "media_type": "CAROUSEL",
            "children": ids
        }
        res = await session.post(os.path.join(INSTAGRAM_BASE_URL, ig_config.chat_id, "media"), params=params)
        if res.status_code in [200, 201]:
            return {
                "success": True,
                "message": "Ring container was successfully created",
                "text": res.text
            }
        else:
            logger.error(f"Wrong result: {str(res)}")
            return {
                "success": False,
                "message": f"Server returned status code {res.status_code} and text {res.text}"
            }

    @staticmethod
    async def _create_container(session: AsyncClient, ig_config: InstagramConfig, setter, media_url: str,
                                media: PostFile, caption="", is_carousel_item=False):
        media_full_url = os.path.join(media_url, media.filepath)
        params = {
            "access_token": ig_config.marker_token,
            "caption": caption,
        }
        if is_carousel_item:
            params["is_carousel_item"] = True
        if "image" in media.content_type:
            params["image_url"] = media_full_url
        elif "video" in media.content_type:
            params["video_url"] = media_full_url
            params["media_type"] = "REELS"
        res = await session.post(os.path.join(INSTAGRAM_BASE_URL, ig_config.chat_id, "media"), params=params)
        if res.status_code in [200, 201]:
            res_dict: dict = json.loads(res.text)
            if res_dict.get("id", None) is not None:
                setter(res_dict["id"])
                return {
                    "success": True,
                    "message": f"Container successfully created with id: {res_dict['id']}"
                }
            else:
                logger.error(f"Wrong result: {str(res)}")
                return {
                    "success": False,
                    "message": "No ID attribute found"
                }
        else:
            logger.error(f"Wrong result: {str(res)}")
            return {
                "success": False,
                "message": f"Status code: {res.status_code}, text: {res.text}"
            }


igApi = InstagramApi()
