from typing import TYPE_CHECKING, List

from sqlalchemy import Column, String, ForeignKey, Integer, DateTime, func, Boolean, JSON
from sqlalchemy.orm import mapped_column, Mapped, relationship

from app.db.base_class import Base

if TYPE_CHECKING:
    from .user import User # Noqa


class Post(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = Column(String, index=True)
    markdown_text: Mapped[str] = Column(String)
    json_text = Column(JSON, default={})
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    when = Column(DateTime, server_default=func.now())
    is_posted: Mapped[bool] = Column(Boolean, default=False)
    post_date = Column(DateTime, nullable=True)
    post_files: Mapped[List["PostFile"]] = relationship(lazy="selectin")


class PostFile(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    filepath: Mapped[str] = mapped_column(String, index=True)
    content_type: Mapped[str] = mapped_column(String)
    filesize: Mapped[int] = mapped_column(Integer)
    post_id: Mapped[int] = mapped_column(ForeignKey("post.id"))
    save_result = Column(JSON, default={})
