from typing import Optional, List

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.base import CRUDBase
from app.models import TelegramQueue, FacebookQueue
from app.schemas import FacebookQueueCreate, FacebookQueueUpdate


class CRUDFacebookQueue(CRUDBase[FacebookQueue, FacebookQueueCreate, FacebookQueueUpdate]):
    async def get_multi_by_user(self, db: AsyncSession, *, user_id: int) -> Optional[List[TelegramQueue]]:
        result = await db.execute(select(
            FacebookQueue).filter(
            FacebookQueue.user_id == user_id,
            FacebookQueue.is_posted.is_(False)).group_by(
            FacebookQueue.when
        ).limit(100))
        return result.scalars().first()

    async def get_max_date(self, db: AsyncSession, *, user_id: int, config_id: int):
        result = await db.execute(select(func.max(FacebookQueue.when)).filter(
            FacebookQueue.user_id == user_id,
            FacebookQueue.telegram_config_id == config_id))
        return result.fetchone()


crud_facebook_queue = CRUDFacebookQueue(FacebookQueue)
