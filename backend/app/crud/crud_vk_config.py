from datetime import timedelta, datetime
from typing import Optional, List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app import schemas
from app.crud.base import CRUDBase
from app.crud.crud_vk_queue import crud_vk_queue
from app.models import VkConfig
from app.schemas.vk_config import VkConfigCreate, VkConfigUpdate


class CRUDVkConfig(CRUDBase[VkConfig, VkConfigCreate, VkConfigUpdate]):
    async def get_multi_by_user(self, db: AsyncSession, *, user_id: int) -> Optional[List[VkConfig]]:
        result = await db.execute(select(VkConfig).filter(VkConfig.user_id == user_id))
        return result.scalars().all()

    async def get_full(self, db: AsyncSession, *, config_id: int, user_id: int) -> Optional[schemas.VkConfig]:
        config = await self.get(db, id=config_id)
        schema_config: schemas.VkConfig = schemas.VkConfig.model_validate(config)
        max_date = await crud_vk_queue.get_max_date(db, user_id=user_id, config_id=config_id)
        if max_date is not None and max_date[0] is not None:
            schema_config.next_post_time = max_date[0] + timedelta(**schema_config.schedule)
        else:
            schema_config.next_post_time = datetime.now()

        return schema_config


crud_vk_config = CRUDVkConfig(VkConfig)
