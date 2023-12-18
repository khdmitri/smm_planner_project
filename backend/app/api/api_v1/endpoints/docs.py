from typing import Any

from fastapi import APIRouter
from starlette.responses import StreamingResponse

router = APIRouter()


def read_file(path):
    f = open(path, "rb")

    # To view the file in the browser, use "inline" for the media_type
    headers = {"Content-Disposition": "inline; filename=privacy_en.pdf"}

    # Create a StreamingResponse object with the file-like object, media type and headers
    return StreamingResponse(f, media_type="application/pdf", headers=headers)


@router.get("/privacy")
async def get_privacy() -> Any:
    return read_file("docs/privacy/privacy_en.pdf")


@router.get("/eula")
async def get_privacy() -> Any:
    return read_file("docs/eula/eula_en.pdf")
