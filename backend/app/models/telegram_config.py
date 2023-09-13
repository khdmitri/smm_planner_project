from typing import TYPE_CHECKING, List

from sqlalchemy import String, ForeignKey, JSON, BigInteger
from sqlalchemy.orm import mapped_column, Mapped, relationship

from app.db.base_class import Base

if TYPE_CHECKING:
    from .user import User  # Noqa
    from .telegram_queue import TelegramQueue


class TelegramConfig(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    chat_id: Mapped[int] = mapped_column(BigInteger, unique=True)
    description: Mapped[str] = mapped_column(String)
    schedule: Mapped[dict] = mapped_column(JSON, default={"minutes": 0, "hours": 0, "days": 0})
    queued_posts: Mapped[List["TelegramQueue"]] = relationship(back_populates="telegram_config",
                                                               cascade="all, delete-orphan",
                                                               lazy="selectin")
