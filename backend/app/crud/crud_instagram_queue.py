from typing import Optional, List

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.base import CRUDBase
from app.models import InstagramQueue
from app.schemas import InstagramQueueCreate, InstagramQueueUpdate


class CRUDInstagramQueue(CRUDBase[InstagramQueue, InstagramQueueCreate, InstagramQueueUpdate]):
    async def get_multi_by_user(self, db: AsyncSession, *, user_id: int) -> Optional[List[InstagramQueue]]:
        result = await db.execute(select(
            InstagramQueue).filter(
            InstagramQueue.user_id == user_id,
            InstagramQueue.is_posted.is_(False)).group_by(
            InstagramQueue.when
        ).limit(100))
        return result.scalars().first()

    async def get_max_date(self, db: AsyncSession, *, user_id: int, config_id: int):
        result = await db.execute(select(func.max(InstagramQueue.when)).filter(
            InstagramQueue.user_id == user_id,
            InstagramQueue.instagram_config_id == config_id))
        return result.fetchone()


crud_instagram_queue = CRUDInstagramQueue(InstagramQueue)
