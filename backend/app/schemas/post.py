from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, EmailStr

from app.schemas.post_file import PostFile


class PostBase(BaseModel):
    title: Optional[str] = None
    markdown_text: Optional[str] = None
    html_text: Optional[str] = None
    json_text: Optional[dict] = {}
    is_posted: Optional[bool] = None
    when: Optional[datetime] = None


# Properties to receive via API on creation
class PostCreate(PostBase):
    user_id: int
    is_posted: bool = False


# Properties to receive via API on update
class PostUpdate(PostBase):
    id: int


class PostInDBBase(PostBase):
    id: Optional[int] = None

    class Config:
        from_attributes = True


# Additional properties stored in DB
class PostInDB(PostInDBBase):
    pass


class Post(PostInDBBase):
    pass


class PostFull(Post):
    post_files: Optional[List[PostFile]] = None
