from typing import Optional, List

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.base import CRUDBase
from app.models import VkQueue
from app.schemas import VkQueueCreate, VkQueueUpdate


class CRUDVkQueue(CRUDBase[VkQueue, VkQueueCreate, VkQueueUpdate]):
    async def get_multi_by_user(self, db: AsyncSession, *, user_id: int) -> Optional[List[VkQueue]]:
        result = await db.execute(select(
            VkQueue).filter(
            VkQueue.user_id == user_id,
            VkQueue.is_posted.is_(False)).group_by(
            VkQueue.when
        ).limit(100))
        return result.scalars().first()

    async def get_max_date(self, db: AsyncSession, *, user_id: int, config_id: int):
        result = await db.execute(select(func.max(VkQueue.when)).filter(
            VkQueue.user_id == user_id,
            VkQueue.vk_config_id == config_id))
        return result.fetchone()


crud_vk_queue = CRUDVkQueue(VkQueue)
