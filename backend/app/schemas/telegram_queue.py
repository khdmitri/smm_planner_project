from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.schemas.telegram_config import TelegramConfig


class TelegramQueueBase(BaseModel):
    title: Optional[str] = None
    text: Optional[str] = None
    post_result: Optional[dict] = {}
    is_posted: Optional[bool] = None
    when: Optional[datetime] = None


# Properties to receive via API on creation
class TelegramQueueCreate(TelegramQueueBase):
    post_id: int
    user_id: int
    telegram_config_id: int
    is_posted: bool = False


# Properties to receive via API on update
class TelegramQueueUpdate(TelegramQueueBase):
    id: int


class TelegramQueueInDBBase(TelegramQueueBase):
    id: Optional[int] = None

    class Config:
        from_attributes = True


# Additional properties stored in DB
class TelegramQueueInDB(TelegramQueueInDBBase):
    pass


class TelegramQueue(TelegramQueueInDBBase):
    telegram_config: TelegramConfig
