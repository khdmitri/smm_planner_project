import logging
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app import schemas, models
from app.api import deps
from app.common.logger import get_logger
from app.crud.crud_telegram_queue import crud_telegram_queue
from app.crud.crud_vk_queue import crud_vk_queue

router = APIRouter()
logger = get_logger(logging.INFO)


@router.get("/", response_model=List[schemas.VkQueue])
async def read_queues(
        db: AsyncSession = Depends(deps.get_db_async),
        current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve queues.
    """
    posts = await crud_vk_queue.get_multi_by_user(db, user_id=current_user.id)
    return posts


@router.get("/max_date/{config_id}", response_model=schemas.PostDate)
async def read_max_date(
        config_id: int,
        db: AsyncSession = Depends(deps.get_db_async),
        current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve max date.
    """
    result = await crud_vk_queue.get_max_date(db, user_id=current_user.id, config_id=config_id)
    return {"post_date": result[0]}


@router.post("/", response_model=schemas.VkQueue)
async def new_post(
        *,
        db: AsyncSession = Depends(deps.get_db_async),
        vk_queue_in: schemas.VkQueueCreate,
        current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    try:
        # Create New VK Post
        vk_queue_in.user_id = current_user.id
        new_vk_post = await crud_vk_queue.create(db, obj_in=vk_queue_in)
    except AssertionError as ae:
        raise HTTPException(
            status_code=500,
            detail=str(ae),
        )

    return new_vk_post


@router.put("/", response_model=schemas.VkQueue)
async def update_queue(
        *,
        db: AsyncSession = Depends(deps.get_db_async),
        post_in: schemas.VkQueueUpdate,
        current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update queue.
    """
    post = await crud_vk_queue.get(db, id=post_in.id)
    if not post:
        raise HTTPException(
            status_code=404,
            detail="The post with this ID does not exist in the system",
        )
    if post.user_id != current_user.id:
        raise HTTPException(
            status_code=400,
            detail="User can update only self queued posts",
        )

    post = await crud_vk_queue.update(db, db_obj=post, obj_in=post_in)
    return post


@router.delete("/{id}", response_model=schemas.Msg)
async def delete_queue(
        *,
        db: AsyncSession = Depends(deps.get_db_async),
        id: int,
        current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete post.
    """
    post = await crud_vk_queue.get(db=db, id=id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.user_id != current_user.id:
        raise HTTPException(
            status_code=400,
            detail="User can delete only self queued posts",
        )
    await crud_vk_queue.remove(db=db, id=id)
    return {"msg": "Telegram queued post was successfully deleted"}
