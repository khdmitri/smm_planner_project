from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class Msg(BaseModel):
    msg: str


class UserStatistic(BaseModel):
    disk_usage_limit: int
    disk_loaded: int
    posts_created: int
    posts_sent: int
    last_activity: Optional[datetime] = None
