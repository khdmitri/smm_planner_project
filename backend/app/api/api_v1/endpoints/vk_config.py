import logging
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app import schemas, models
from app.api import deps
from app.common.logger import get_logger
from app.crud.crud_vk_config import crud_vk_config

router = APIRouter()
logger = get_logger(logging.INFO)


@router.get("/", response_model=List[schemas.VkConfig])
async def read_configs(
    db: AsyncSession = Depends(deps.get_db_async),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve configs.
    """
    configs = await crud_vk_config.get_multi_by_user(db, user_id=current_user.id)
    return configs if configs is not None else []


@router.get("/{config_id}", response_model=schemas.VkConfig)
async def read_user_by_id(
    config_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db_async),
) -> Any:
    """
    Get a specific config by id.
    """
    config = await crud_vk_config.get_full(db, config_id=config_id, user_id=current_user.id)

    if not config.user_id == current_user.id:
        raise HTTPException(
            status_code=400, detail="The user can get self config only"
        )

    return config


@router.post("/", response_model=schemas.VkConfig)
async def new_vk(
        *,
        db: AsyncSession = Depends(deps.get_db_async),
        vk_config_in: schemas.VkConfigCreate,
        current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    try:
        # Create New Vk Config
        vk_config_in.user_id = current_user.id
        new_vk_config = await crud_vk_config.create(db, obj_in=vk_config_in)
    except AssertionError as ae:
        raise HTTPException(
            status_code=500,
            detail=str(ae),
        )

    return new_vk_config


@router.put("/", response_model=schemas.VkConfig)
async def update_config(
    *,
    db: AsyncSession = Depends(deps.get_db_async),
    config_in: schemas.VkConfigUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update config.
    """
    config = await crud_vk_config.get(db, id=config_in.id)
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

    config = await crud_vk_config.update(db, db_obj=config, obj_in=config_in)
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
    config = await crud_vk_config.get(db=db, id=id)
    if not config:
        raise HTTPException(status_code=404, detail="Config not found")
    if not config.user_id == current_user.id:
        raise HTTPException(status_code=400, detail="User can delete only self configuration")
    await crud_vk_config.remove(db=db, id=id)
    return {"msg": "VK config was successfully deleted"}
