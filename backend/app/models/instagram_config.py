from typing import TYPE_CHECKING, List

from sqlalchemy import String, ForeignKey, JSON, BigInteger
from sqlalchemy.orm import mapped_column, Mapped, relationship

from app.db.base_class import Base

if TYPE_CHECKING:
    from .user import User  # Noqa
    from .instagram_queue import InstagramQueue  # Noqa


class InstagramConfig(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    marker_token: Mapped[str] = mapped_column(String, unique=True)
    chat_id: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(String)
    schedule: Mapped[dict] = mapped_column(JSON, default={"minutes": 0, "hours": 0, "days": 0})
    queued_posts: Mapped[List["InstagramQueue"]] = relationship(back_populates="instagram_config",
                                                                cascade="all, delete-orphan",
                                                                lazy="selectin")
