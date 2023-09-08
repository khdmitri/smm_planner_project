from typing import Optional, List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.base import CRUDBase
from app.models import TelegramQueue
from app.schemas import TelegramQueueCreate, TelegramQueueUpdate


class CRUDTelegramQueue(CRUDBase[TelegramQueue, TelegramQueueCreate, TelegramQueueUpdate]):
    async def get_multi_by_user(self, db: AsyncSession, *, user_id: str) -> Optional[List[TelegramQueue]]:
        result = await db.execute(select(TelegramQueue).filter(TelegramQueue.user_id == user_id,
                                                               TelegramQueue.is_posted.is_(False)))
        return result.scalars().first()


crud_telegram_queue = CRUDTelegramQueue(TelegramQueue)
