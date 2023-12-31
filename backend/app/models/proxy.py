from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base_class import Base


class Proxy(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    address: Mapped[str] = mapped_column(String)
    protocol: Mapped[str] = mapped_column(String)
    is_success: Mapped[bool] = mapped_column(Boolean, default=False)
