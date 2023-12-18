from typing import TYPE_CHECKING, List

from sqlalchemy import Column, String, ForeignKey, Integer, DateTime, func, Boolean, JSON
from sqlalchemy.orm import mapped_column, Mapped, relationship

from app.db.base_class import Base

if TYPE_CHECKING:
    from .post import Post # Noqa
    from .facebook_config import FacebookConfig  # Noqa
    from .user import User  # Noqa


class FacebookQueue(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    post_id: Mapped[int] = mapped_column(ForeignKey("post.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    facebook_config_id: Mapped[int] = mapped_column(ForeignKey("facebookconfig.id"))
    facebook_config = relationship("FacebookConfig", back_populates="queued_posts", lazy="selectin")
    text: Mapped[str] = Column(String, index=True)
    title: Mapped[str] = Column(String, index=True)
    link: Mapped[str] = Column(String)
    post_result = Column(JSON, default={})
    when = Column(DateTime, nullable=True)
    tz_offset: Mapped[int] = Column(Integer)
    is_posted: Mapped[bool] = Column(Boolean, default=False)
