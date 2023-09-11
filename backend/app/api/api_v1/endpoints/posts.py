import json
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
from app.schemas.post import PostCreate
from app.schemas.post_file import PostFileCreate

router = APIRouter()
logger = get_logger(logging.INFO)


@router.post("/", response_model=schemas.Post)
async def new_post(
        title: Optional[str] = Form(None),
        markdown_text: Optional[str] = Form(None),
        json_text: Optional[str] = Form(None),
        files: List[UploadFile] = Form(None),
        db: AsyncSession = Depends(get_db_async),
        current_user: models.User = Depends(deps.get_current_user)
) -> Any:
    if title is None and markdown_text is None:
        raise HTTPException(
            status_code=422,
            detail="The title and message text can not be empty at the same time",
        )

    try:
        # Create New Post
        new_post = PostCreate(
            user_id=current_user.id,
            title=title,
            markdown_text=markdown_text,
            json_text=json.loads(json_text)
        )
        new_post = await crud_post.create(db, obj_in=new_post)

        # Create PostFiles
        assert new_post is not None, "Post was not created for unknown reason"
        if isinstance(files, list):
            file_processing = FileProcessing(current_user, files)
            saved_files = await file_processing.run()
            for saved_file_key in saved_files.keys():
                new_post_file = PostFileCreate(post_id=new_post.id,
                                               filepath=saved_file_key,
                                               content_type=saved_files[saved_file_key]["content_type"],
                                               filesize=saved_files[saved_file_key]["filesize"],
                                               save_result=saved_files[saved_file_key]["save_result"])
                await crud_post_file.create(db, obj_in=new_post_file)
    except AssertionError as ae:
        raise HTTPException(
            status_code=500,
            detail=str(ae),
        )

    return new_post


@router.get("/{post_id}", response_model=schemas.Post)
async def read_post(
        post_id: int,
        current_user: models.User = Depends(deps.get_current_active_user),
        db: AsyncSession = Depends(deps.get_db_async),
) -> Any:
    """
    Get a specific post by id.
    """
    post = await crud_post.get(db, id=post_id)

    if not post.user_id == current_user.id:
        raise HTTPException(
            status_code=400, detail="The user can get self post only"
        )

    return post


@router.get("/", response_model=List[schemas.Post])
async def read_configs(
    db: AsyncSession = Depends(deps.get_db_async),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve posts by user.
    """
    posts = await crud_post.get_multi_by_user(db, user_id=current_user.id)
    return posts if posts is not None else []
