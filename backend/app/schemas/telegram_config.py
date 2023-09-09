from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, EmailStr

from app.schemas.post_file import PostFile


class TelegramConfigBase(BaseModel):
    chat_id: Optional[int] = None
    description: Optional[str] = None
    schedule: Optional[dict] = {"minutes": 0, "hours": 0, "days": 0}


# Properties to receive via API on creation
class TelegramConfigCreate(TelegramConfigBase):
    user_id: int = None


# Properties to receive via API on update
class TelegramConfigUpdate(TelegramConfigBase):
    id: int


class TelegramConfigInDBBase(TelegramConfigBase):
    id: Optional[int] = None

    class Config:
        from_attributes = True


# Additional properties stored in DB
class TelegramConfigInDB(TelegramConfigInDBBase):
    pass


class TelegramConfig(TelegramConfigInDBBase):
    pass
