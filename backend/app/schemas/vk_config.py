from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class VkConfigBase(BaseModel):
    access_token: Optional[str] = None
    chat_id: Optional[int] = None
    description: Optional[str] = None
    schedule: Optional[dict] = {"minutes": 0, "hours": 0, "days": 0}
    user_id: int = None


# Properties to receive via API on creation
class VkConfigCreate(VkConfigBase):
    access_token: str
    chat_id: int
    description: str


# Properties to receive via API on update
class VkConfigUpdate(VkConfigBase):
    id: int


class VkConfigInDBBase(VkConfigBase):
    id: Optional[int] = None

    class Config:
        from_attributes = True


# Additional properties stored in DB
class VkConfigInDB(VkConfigInDBBase):
    pass


class VkConfig(VkConfigInDBBase):
    next_post_time: datetime = None
