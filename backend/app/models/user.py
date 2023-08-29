from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Column, Integer, String

from app.db.base_class import Base

if TYPE_CHECKING:
    pass


class User(Base):
    id: int = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True, nullable=False)
    last_name = Column(String, index=True)
    email: str = Column(String, unique=True, index=True, nullable=False)
    hashed_password: str = Column(String, nullable=False)
    allow_extra_emails: bool = Column(Boolean(), default=True)
    is_superuser: bool = Column(Boolean(), default=False)
    is_active: bool = Column(Boolean(), default=True)
