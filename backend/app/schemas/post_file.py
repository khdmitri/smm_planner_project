from typing import Optional

from pydantic import BaseModel


class PostFileBase(BaseModel):
    filepath: Optional[str] = None
    content_type: Optional[str] = None
    filesize: Optional[int] = None
    save_result: Optional[dict] = None


# Properties to receive via API on creation
class PostFileCreate(PostFileBase):
    post_id: int


# Properties to receive via API on update
class PostFileUpdate(PostFileBase):
    id: int


class PostFileInDBBase(PostFileBase):
    id: Optional[int] = None

    class Config:
        from_attributes = True


# Additional properties stored in DB
class PostFileInDB(PostFileInDBBase):
    pass


class PostFile(PostFileInDBBase):
    pass
