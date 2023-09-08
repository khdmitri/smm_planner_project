from typing import Optional, List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.base import CRUDBase
from app.models import Post, TelegramConfig
from app.schemas import TelegramConfigCreate, TelegramConfigUpdate
from app.schemas.post import PostCreate, PostUpdate


class CRUDTelegramConfig(CRUDBase[TelegramConfig, TelegramConfigCreate, TelegramConfigUpdate]):
    async def get_multi_by_user(self, db: AsyncSession, *, user_id: str) -> Optional[List[TelegramConfig]]:
        result = await db.execute(select(TelegramConfig).filter(TelegramConfig.user_id == user_id))
        return result.scalars().first()


crud_telegram_config = CRUDTelegramConfig(TelegramConfig)
