from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.schemas.facebook_config import FacebookConfig


class FacebookQueueBase(BaseModel):
    title: Optional[str] = None
    link: Optional[str] = None
    text: Optional[str] = None
    post_result: Optional[dict] = {}
    is_posted: Optional[bool] = None
    when: Optional[datetime] = None


# Properties to receive via API on creation
class FacebookQueueCreate(FacebookQueueBase):
    post_id: int
    user_id: int = None
    facebook_config_id: int
    is_posted: bool = False


# Properties to receive via API on update
class FacebookQueueUpdate(FacebookQueueBase):
    id: int


class FacebookQueueInDBBase(FacebookQueueBase):
    id: Optional[int] = None

    class Config:
        from_attributes = True


# Additional properties stored in DB
class FacebookQueueInDB(FacebookQueueInDBBase):
    pass


class FacebookQueue(FacebookQueueInDBBase):
    facebook_config: FacebookConfig
