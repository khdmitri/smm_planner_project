from typing import TYPE_CHECKING, List

from sqlalchemy import Column, String, ForeignKey, Integer, DateTime, func, Boolean, JSON
from sqlalchemy.orm import mapped_column, Mapped, relationship

from app.db.base_class import Base

if TYPE_CHECKING:
    from .user import User # Noqa
    from .telegram_queue import TelegramQueue
    from .facebook_queue import FacebookQueue
    from .instagram_queue import InstagramQueue
    from .vk_queue import VkQueue


class Post(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = Column(String, index=True)
    video_url: Mapped[str] = Column(String)
    markdown_text: Mapped[str] = Column(String)
    html_text: Mapped[str] = Column(String)
    plain_text: Mapped[str] = Column(String)
    json_text = Column(JSON, default={})
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    when = Column(DateTime, server_default=func.now())
    is_posted: Mapped[bool] = Column(Boolean, default=False)
    post_date = Column(DateTime, nullable=True)
    post_files: Mapped[List["PostFile"]] = relationship(lazy="selectin", cascade="all, delete-orphan")
    tg_queue: Mapped[List["TelegramQueue"]] = relationship(lazy="selectin", cascade="all, delete-orphan")
    fb_queue: Mapped[List["FacebookQueue"]] = relationship(lazy="selectin", cascade="all, delete-orphan")
    ig_queue: Mapped[List["InstagramQueue"]] = relationship(lazy="selectin", cascade="all, delete-orphan")
    vk_queue: Mapped[List["VkQueue"]] = relationship(lazy="selectin", cascade="all, delete-orphan")


class PostFile(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    filepath: Mapped[str] = mapped_column(String, index=True)
    content_type: Mapped[str] = mapped_column(String)
    filesize: Mapped[int] = mapped_column(Integer)
    post_id: Mapped[int] = mapped_column(ForeignKey("post.id"))
    post: Mapped[Post] = relationship("Post", lazy="selectin", viewonly=True)
    save_result = Column(JSON, default={})
