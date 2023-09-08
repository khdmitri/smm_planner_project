from typing import TYPE_CHECKING

from sqlalchemy import String, ForeignKey, Integer, JSON
from sqlalchemy.orm import mapped_column, Mapped

from app.db.base_class import Base

if TYPE_CHECKING:
    from .user import User # Noqa


class TelegramConfig(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    chat_id: Mapped[int] = mapped_column(Integer)
    description: Mapped[str] = mapped_column(String)
    schedule: Mapped[dict] = mapped_column(JSON)

