from datetime import timedelta, datetime
from typing import Optional, List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app import schemas
from app.crud.crud_instagram_queue import crud_instagram_queue
from app.crud.base import CRUDBase
from app.models import InstagramConfig
from app.schemas import InstagramConfigCreate, InstagramConfigUpdate


class CRUDInstagramConfig(CRUDBase[InstagramConfig, InstagramConfigCreate, InstagramConfigUpdate]):
    async def get_multi_by_user(self, db: AsyncSession, *, user_id: int) -> Optional[List[InstagramConfig]]:
        result = await db.execute(select(InstagramConfig).filter(InstagramConfig.user_id == user_id))
        return result.scalars().all()

    async def get_full(self, db: AsyncSession, *, config_id: int, user_id: int) -> Optional[schemas.InstagramConfig]:
        config = await self.get(db, id=config_id)
        schema_config: schemas.InstagramConfig = schemas.InstagramConfig.model_validate(config)
        max_date = await crud_instagram_queue.get_max_date(db, user_id=user_id, config_id=config_id)
        if max_date is not None and max_date[0] is not None:
            schema_config.next_post_time = max_date[0] + timedelta(**schema_config.schedule)
        else:
            schema_config.next_post_time = datetime.now()

        return schema_config


crud_instagram_config = CRUDInstagramConfig(InstagramConfig)
