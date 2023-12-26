import os.path
from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import StreamingResponse, Response, FileResponse

from app.api import deps
from app.crud import crud_post_file
from app.definitions import MEDIA_ROOT_DIR

router = APIRouter()


def read_file(path, media_type="application/pdf", use_headers=True):
    f = open(path, "rb")

    # To view the file in the browser, use "inline" for the media_type
    headers = {"Content-Disposition": "inline; filename=privacy_en.pdf"}

    # Create a StreamingResponse object with the file-like object, media type and headers
    if use_headers:
        return StreamingResponse(f, media_type=media_type, headers=headers)
    else:
        return StreamingResponse(f, media_type=media_type)


@router.get("/privacy")
async def get_privacy() -> Any:
    return read_file("docs/privacy/privacy_en.pdf")


@router.get("/eula")
async def get_privacy() -> Any:
    return read_file("docs/eula/eula_en.pdf")


@router.get("/get_media/{postfile_id}")
async def get_media(
        postfile_id: int,
        db: AsyncSession = Depends(deps.get_db_async),
) -> Any:
    post_file = await crud_post_file.get(db, id=postfile_id)
    filepath = os.path.join(MEDIA_ROOT_DIR, str(post_file.post.user_id), post_file.filepath)
    return FileResponse(filepath, media_type=post_file.content_type, filename=post_file.filepath)
