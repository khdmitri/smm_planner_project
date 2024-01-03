import logging
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, Form
from starlette.responses import JSONResponse

from app import models
from app.api import deps
from app.common.logger import get_logger
from app.kandinsky.fusionbrain import Text2ImageAPI

router = APIRouter()
logger = get_logger(logging.INFO)


@router.post("/generate")
async def get_images(
    prompt: Optional[str] = Form(...),
    style: Optional[str] = Form(...),
    num_images: Optional[int] = Form(None),
    width: Optional[int] = Form(None),
    height: Optional[int] = Form(None),
    negative_prompt_unclip: Optional[str] = Form(None),
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    text2image = Text2ImageAPI()
    images, result = await text2image.execute(
        prompt=prompt,
        num_images=num_images if num_images else 1,
        style=style if style else "DEFAULT",
        width=width if width else 1024,
        height=height if height else 1024,
        negative_prompt_unclip=negative_prompt_unclip
    )
    if result["success"]:
        return JSONResponse({
            "success": True,
            "images": images
        })
    else:
        raise HTTPException(
            status_code=500,
            detail=result["error"],
        )
