import logging
from typing import Any, List, Optional
from fastapi import APIRouter, Depends, Form, UploadFile, HTTPException

from app import schemas, models
from app.api import deps
from app.common.logger import get_logger

router = APIRouter()
logger = get_logger(logging.INFO)


@router.post("/", response_model=schemas.Msg)
async def new_post(
        title: Optional[str] = Form(None),
        text: Optional[str] = Form(None),
        files: List[UploadFile] = Form(None),
        current_user: models.User = Depends(deps.get_current_user)
) -> Any:
    if title is None and text is None:
        raise HTTPException(
            status_code=422,
            detail="The title and message text can not be empty at the same time",
        )
    logger.info("Received data: ", {
        "title": title,
        "text": text,
        "files": files
    })
    return {"msg": "successfully created!"}
