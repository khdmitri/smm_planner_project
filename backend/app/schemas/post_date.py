from datetime import datetime

from pydantic import BaseModel


class PostDate(BaseModel):
    post_date: datetime = None
