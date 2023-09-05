import asyncio
import os
import uuid
from pathlib import Path
from typing import Optional, List
from config import settings

from fastapi import UploadFile

from app.models import User


class FileProcessing(object):
    def __init__(self, user: User, files: Optional[List[UploadFile]] = None):
        self.user = user
        self.files = files

    def _get_directory(self):
        assert self.user is not None and self.user.get("id", None) is not None, "User id not found"
        check_dir: str = os.path.join(settings.BASE_FILE_DIRECTORY, str(self.user.id))
        Path(check_dir).mkdir(parents=True, exist_ok=True)
        return check_dir

    def _get_filename(self, content_type):
        values = content_type.split("/")
        match content_type:
            case "image"|"video", ext:
                return ".".join([str(uuid.uuid4()), ext])
            case _:
                raise AssertionError("Content type was not recognized")

    async def run(self):
        try:
            base_path: str = self._get_directory()
            for file in self.files:

        except AssertionError as ae:
            print(str(ae))


if __name__ == '__main__':
    fileProcessing = FileProcessing(None, None)
    asyncio.run(fileProcessing.run())
