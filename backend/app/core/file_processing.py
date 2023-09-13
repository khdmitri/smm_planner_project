import asyncio
import os
import pathlib
import uuid
from pathlib import Path
from typing import Optional, List, Union

import aiofiles

from app.core.config import settings

from fastapi import UploadFile

from app.models import User


class FileProcessing(object):
    def __init__(self, user: User, files: Union[Optional[List[UploadFile]], List[str]] = None):
        self.user = user
        self.files = files

    def _get_directory(self):
        assert self.user is not None, "User not found"
        check_dir: str = os.path.join(settings.BASE_FILE_DIRECTORY, str(self.user.id))
        Path(check_dir).mkdir(parents=True, exist_ok=True)
        return check_dir

    def _get_filename(self, content_type):
        values = content_type.split("/")
        match values:
            case "image" | "video", ext:
                return ".".join([str(uuid.uuid4()), ext])
            case _:
                raise AssertionError("Content type was not recognized")

    async def _save_file_to_disk(self, in_file: UploadFile, out_file_path):
        try:
            async with aiofiles.open(out_file_path, 'wb') as out_file:
                while content := await in_file.read(8192):  # async read chunk
                    await out_file.write(content)  # async write chunk
            return {"success": True}
        except Exception as e:
            return {"success": False, "error": str(e)}

    def delete_files(self):
        for file in self.files:
            filepath = os.path.join(self._get_directory(), file)
            file_to_delete = pathlib.Path(filepath)
            file_to_delete.unlink(missing_ok=True)
        return True

    async def run(self):
        saved_files = {}
        try:
            base_path: str = self._get_directory()
            for file in self.files:
                filename: str = self._get_filename(file.content_type)
                result = await self._save_file_to_disk(file, os.path.join(base_path, filename))
                saved_files[filename] = {
                    "save_result": result,
                    "content_type": file.content_type,
                    "filesize": file.size,
                }
            return saved_files
        except AssertionError as ae:
            print(str(ae))


if __name__ == '__main__':
    fileProcessing = FileProcessing(None, None)
    asyncio.run(fileProcessing.run())
