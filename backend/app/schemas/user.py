from typing import Optional

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    allow_extra_emails: Optional[bool] = True
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_superuser: Optional[bool] = None
    is_active: Optional[bool] = None
    disk_usage_limit: int = 0


# Properties to receive via API on creation
class UserCreate(UserBase):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    allow_extra_emails: bool = True


# Properties to receive via API on update
class UserUpdate(UserBase):
    id: int
    password: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    allow_extra_emails: Optional[bool] = None


class UserInDBBase(UserBase):
    id: Optional[int] = None

    class Config:
        from_attributes = True


# Additional properties stored in DB
class UserInDB(UserInDBBase):
    hashed_password: str


class User(UserInDBBase):
    is_superuser: bool
    is_active: bool
