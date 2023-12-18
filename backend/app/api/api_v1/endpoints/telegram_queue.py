import logging
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app import schemas, models
from app.api import deps
from app.common.logger import get_logger
from app.core.utils import update_time_2_server
from app.crud.crud_telegram_queue import crud_telegram_queue

router = APIRouter()
logger = get_logger(logging.INFO)


@router.get("/", response_model=List[schemas.TelegramQueue])
async def read_queues(
        db: AsyncSession = Depends(deps.get_db_async),
        current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve queues.
    """
    posts = await crud_telegram_queue.get_multi_by_user(db, user_id=current_user.id)
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
    result = await crud_telegram_queue.get_max_date(db, user_id=current_user.id, config_id=config_id)
    return {"post_date": result[0]}


@router.post("/", response_model=schemas.TelegramQueue)
async def new_post(
        *,
        db: AsyncSession = Depends(deps.get_db_async),
        telegram_queue_in: schemas.TelegramQueueCreate,
        current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    try:
        # Create New Telegram Post
        telegram_queue_in.user_id = current_user.id
        telegram_queue_in.when = update_time_2_server(telegram_queue_in.when, telegram_queue_in.tz_offset)
        new_telegram_post = await crud_telegram_queue.create(db, obj_in=telegram_queue_in)
    except AssertionError as ae:
        raise HTTPException(
            status_code=500,
            detail=str(ae),
        )

    return new_telegram_post


@router.put("/", response_model=schemas.TelegramQueue)
async def update_queue(
        *,
        db: AsyncSession = Depends(deps.get_db_async),
        post_in: schemas.TelegramQueueUpdate,
        current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update queue.
    """
    post = await crud_telegram_queue.get(db, id=post_in.id)
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

    post = await crud_telegram_queue.update(db, db_obj=post, obj_in=post_in)
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
    post = await crud_telegram_queue.get(db=db, id=id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.user_id != current_user.id:
        raise HTTPException(
            status_code=400,
            detail="User can delete only self queued posts",
        )
    await crud_telegram_queue.remove(db=db, id=id)
    return {"msg": "Telegram queued post was successfully deleted"}
