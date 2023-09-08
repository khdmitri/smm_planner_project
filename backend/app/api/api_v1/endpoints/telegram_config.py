import logging
from typing import Any, List, Optional
from fastapi import APIRouter, Depends, Form, UploadFile, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app import schemas, models
from app.api import deps
from app.api.deps import get_db_async
from app.common.logger import get_logger
from app.core.file_processing import FileProcessing
from app.crud import crud_post, crud_post_file
from app.crud.crud_telegram_config import crud_telegram_config
from app.schemas import TelegramConfigCreate
from app.schemas.post import PostCreate
from app.schemas.post_file import PostFileCreate

router = APIRouter()
logger = get_logger(logging.INFO)


@router.get("/", response_model=List[schemas.TelegramConfig])
async def read_configs(
    db: AsyncSession = Depends(deps.get_db_async),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Retrieve users.
    """
    configs = await crud_telegram_config.get_multi_by_user(db, user_id=current_user.id)
    return configs


@router.post("/", response_model=schemas.TelegramConfig)
async def new_telegram(
        *,
        db: AsyncSession = Depends(deps.get_db_async),
        telegram_config_in: schemas.TelegramConfigCreate,
        current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    try:
        # Create New Telegram Config
        new_telegram_config = await crud_telegram_config.create(db, obj_in=telegram_config_in)
    except AssertionError as ae:
        raise HTTPException(
            status_code=500,
            detail=str(ae),
        )

    return new_telegram_config


@router.put("/{config_id}", response_model=schemas.TelegramConfig)
async def update_config(
    *,
    db: AsyncSession = Depends(deps.get_db_async),
    config_in: schemas.TelegramConfigUpdate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Update config.
    """
    config = await crud_telegram_config.get(db, id=config_in.id)
    if not config:
        raise HTTPException(
            status_code=404,
            detail="The configuration with this ID does not exist in the system",
        )
    if config.user_id != current_user.id:
        raise HTTPException(
            status_code=400,
            detail="User can update only self configuration",
        )

    config = await crud_telegram_config.update(db, db_obj=config, obj_in=config_in)
    return config


@router.delete("/{id}", response_model=schemas.Msg)
async def delete_config(
    *,
    db: AsyncSession = Depends(deps.get_db_async),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete config.
    """
    config = await crud_telegram_config.get(db=db, id=id)
    if not config:
        raise HTTPException(status_code=404, detail="Config not found")
    if not config.user_id == current_user.id:
        raise HTTPException(status_code=400, detail="User can delete only self configuration")
    await crud_telegram_config.remove(db=db, id=id)
    return {"msg": "Telegram config was successfully deleted"}
