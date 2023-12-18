from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.core.config import settings
from app.schemas.vk_config import VkConfig


class VkQueueBase(BaseModel):
    title: Optional[str] = None
    link: Optional[str] = None
    text: Optional[str] = None
    post_result: Optional[dict] = {}
    is_posted: Optional[bool] = None
    when: Optional[datetime] = None
    tz_offset: int = settings.SERVER_TZ_OFFSET


# Properties to receive via API on creation
class VkQueueCreate(VkQueueBase):
    post_id: int
    user_id: int = None
    vk_config_id: int
    is_posted: bool = False


# Properties to receive via API on update
class VkQueueUpdate(VkQueueBase):
    id: int


class VkQueueInDBBase(VkQueueBase):
    id: Optional[int] = None

    class Config:
        from_attributes = True


# Additional properties stored in DB
class VkQueueInDB(VkQueueInDBBase):
    pass


class VkQueue(VkQueueInDBBase):
    vk_config: VkConfig
