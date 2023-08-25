from typing import Optional

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = True
    is_superuser: bool = False
    is_new: bool = False
    username: Optional[str] = None
    full_name: Optional[str] = None


# Properties to receive via API on creation
class UserCreate(UserBase):
    username: str
    email: EmailStr
    password: str


# Properties to receive via API on update
class UserUpdate(UserBase):
    id: int
    password: Optional[str] = None
    full_name: Optional[str] = None
    is_new: Optional[bool] = None
    use_two_factor: Optional[bool] = None
    can_export: Optional[bool] = None
    can_gtr_history: Optional[bool] = None
    can_gtr_export: Optional[bool] = None


class UserInDBBase(UserBase):
    id: Optional[int] = None

    class Config:
        from_attributes = True


# Additional properties stored in DB
class UserInDB(UserInDBBase):
    hashed_password: str


class User(UserInDBBase):
    pass

