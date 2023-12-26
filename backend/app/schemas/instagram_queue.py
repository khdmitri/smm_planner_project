from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.core.config import settings
from app.schemas.instagram_config import InstagramConfig


class InstagramQueueBase(BaseModel):
    title: Optional[str] = None
    link: Optional[str] = None
    text: Optional[str] = None
    post_result: Optional[dict] = {}
    is_posted: Optional[bool] = None
    when: Optional[datetime] = None
    tz_offset: int = settings.SERVER_TZ_OFFSET


# Properties to receive via API on creation
class InstagramQueueCreate(InstagramQueueBase):
    post_id: int
    user_id: int = None
    instagram_config_id: int
    is_posted: bool = False


# Properties to receive via API on update
class InstagramQueueUpdate(InstagramQueueBase):
    id: int


class InstagramQueueInDBBase(InstagramQueueBase):
    id: Optional[int] = None

    class Config:
        from_attributes = True


# Additional properties stored in DB
class InstagramQueueInDB(InstagramQueueInDBBase):
    pass


class InstagramQueue(InstagramQueueInDBBase):
    instagram_config: InstagramConfig
