from datetime import datetime, timedelta

from app.core.config import settings


def without_keys(d, keys):
    return {x: d[x] for x in d if x not in keys}


def update_time_2_server(client_time: datetime, tz_offset: int):
    if isinstance(client_time, datetime):
        # server_tz_offset = settings.SERVER_TZ_OFFSET
        client_utc = client_time + timedelta(minutes=tz_offset)
        return client_utc

    server_tz_offset = settings.SERVER_TZ_OFFSET
    return datetime.now() + timedelta(minutes=server_tz_offset)
