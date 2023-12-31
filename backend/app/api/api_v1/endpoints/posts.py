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
from app.crud import crud_post_inst, crud_post_file
from app.schemas.post import PostCreate
from app.schemas.post_file import PostFileCreate

router = APIRouter()
logger = get_logger(logging.INFO)


@router.post("/", response_model=schemas.Post)
async def new_post(
        title: Optional[str] = Form(...),
        markdown_text: Optional[str] = Form(None),
        json_text: Optional[str] = Form(None),
        html_text: Optional[str] = Form(None),
        plain_text: Optional[str] = Form(None),
        video_url: Optional[str] = Form(None),
        files: List[UploadFile] = Form(None),
        db: AsyncSession = Depends(get_db_async),
        current_user: models.User = Depends(deps.get_current_user)
) -> Any:
    if markdown_text is None and files is None:
        raise HTTPException(
            status_code=422,
            detail="No content found: either media content or message text must be given",
        )

    content_type = None
    if files is not None and len(files) > 1:
        for ind, file in enumerate(files):
            if ind == 0:
                content_type = file.content_type.split("/")[0]
            else:
                if content_type != file.content_type.split("/")[0]:
                    raise HTTPException(
                        status_code=422,
                        detail="Media content MUST be the same type. Do not mix video and photos as example.",
                    )

    try:
        # Create New Post
        print("VideoURL=", video_url)
        new_post = PostCreate(
            user_id=current_user.id,
            title=title,
            markdown_text=markdown_text,
            json_text=json.loads(json_text),
            html_text=html_text,
            plain_text=plain_text,
            video_url=video_url
        )
        new_post = await crud_post_inst.create(db, obj_in=new_post)

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
    post = await crud_post_inst.get(db, id=post_id)

    if not post.user_id == current_user.id:
        raise HTTPException(
            status_code=400, detail="The user can get self post only"
        )

    return post


@router.get("/", response_model=List[schemas.Post])
async def read_posts(
    db: AsyncSession = Depends(deps.get_db_async),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve posts by user.
    """
    posts = await crud_post_inst.get_multi_by_user(db, user_id=current_user.id)
    return posts if posts is not None else []


@router.put("/", response_model=schemas.Post)
async def update_post(
        *,
        db: AsyncSession = Depends(deps.get_db_async),
        post_in: schemas.PostUpdate,
        current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update post.
    """
    post = await crud_post_inst.get(db, id=post_in.id)
    if not post:
        raise HTTPException(
            status_code=404,
            detail="The post with this ID does not exist in the system",
        )
    if post.user_id != current_user.id:
        raise HTTPException(
            status_code=400,
            detail="User can update only self posts",
        )

    post = await crud_post_inst.update(db, db_obj=post, obj_in=post_in)
    return post


@router.delete("/{id}", response_model=schemas.Msg)
async def delete_post(
        *,
        db: AsyncSession = Depends(deps.get_db_async),
        id: int,
        current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete post.
    """
    post = await crud_post_inst.get(db=db, id=id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.user_id != current_user.id:
        raise HTTPException(
            status_code=400,
            detail="User can delete only self posts",
        )

    # We have to delete physical files from FS and clean postfiles table before delete post
    file_names = []
    post_files = post.post_files
    for post_file in post_files:
        file_names.append(post_file.filepath)
        await crud_post_file.remove(db, id=post_file.id)

    if file_names:
        file_processing = FileProcessing(current_user, file_names)
        file_processing.delete_files()

    await crud_post_inst.remove(db=db, id=id)
    return {"msg": "Post was successfully deleted"}
