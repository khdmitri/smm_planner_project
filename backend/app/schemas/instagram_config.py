from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class InstagramConfigBase(BaseModel):
    marker_token: Optional[str] = None
    chat_id: Optional[str] = None
    description: Optional[str] = None
    schedule: Optional[dict] = {"minutes": 0, "hours": 0, "days": 0}
    user_id: int = None


# Properties to receive via API on creation
class InstagramConfigCreate(InstagramConfigBase):
    marker_token: str
    chat_id: str
    description: str


# Properties to receive via API on update
class InstagramConfigUpdate(InstagramConfigBase):
    id: int


class InstagramConfigInDBBase(InstagramConfigBase):
    id: Optional[int] = None

    class Config:
        from_attributes = True


# Additional properties stored in DB
class InstagramConfigInDB(InstagramConfigInDBBase):
    pass


class InstagramConfig(InstagramConfigInDBBase):
    next_post_time: datetime = None
