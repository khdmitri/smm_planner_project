from typing import Optional, List

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.base import CRUDBase
from app.models import TelegramQueue
from app.schemas import TelegramQueueCreate, TelegramQueueUpdate


class CRUDTelegramQueue(CRUDBase[TelegramQueue, TelegramQueueCreate, TelegramQueueUpdate]):
    async def get_multi_by_user(self, db: AsyncSession, *, user_id: int) -> Optional[List[TelegramQueue]]:
        result = await db.execute(select(
            TelegramQueue).filter(
            TelegramQueue.user_id == user_id).order_by(
            TelegramQueue.when.desc()
        ).limit(100))
        return result.scalars().all()

    async def get_max_date(self, db: AsyncSession, *, user_id: int, config_id: int):
        result = await db.execute(select(func.max(TelegramQueue.when)).filter(
            TelegramQueue.user_id == user_id,
            TelegramQueue.telegram_config_id == config_id))
        return result.fetchone()


crud_telegram_queue = CRUDTelegramQueue(TelegramQueue)
