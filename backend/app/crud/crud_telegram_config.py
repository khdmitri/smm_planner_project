from datetime import timedelta, datetime
from typing import Optional, List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app import schemas
from app.crud.base import CRUDBase
from app.crud.crud_telegram_queue import crud_telegram_queue
from app.models import Post, TelegramConfig
from app.schemas import TelegramConfigCreate, TelegramConfigUpdate
from app.schemas.post import PostCreate, PostUpdate


class CRUDTelegramConfig(CRUDBase[TelegramConfig, TelegramConfigCreate, TelegramConfigUpdate]):
    async def get_multi_by_user(self, db: AsyncSession, *, user_id: int) -> Optional[List[TelegramConfig]]:
        result = await db.execute(select(TelegramConfig).filter(TelegramConfig.user_id == user_id))
        return result.scalars().all()

    async def get_full(self, db: AsyncSession, *, config_id: int, user_id: int) -> Optional[schemas.TelegramConfig]:
        config = self.get(db, id=config_id)
        schema_config: schemas.TelegramConfig = schemas.TelegramConfig.model_validate(config)
        max_date = crud_telegram_queue.get_max_date(db, user_id=user_id, config_id=config_id)
        if max_date is not None and max_date[0] is not None:
            schema_config.next_post_time = max_date[0] + timedelta(**max_date)
        else:
            schema_config.next_post_time = datetime.now()

        return schema_config


crud_telegram_config = CRUDTelegramConfig(TelegramConfig)
