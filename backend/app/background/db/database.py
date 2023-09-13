import asyncio
from typing import Dict, Any

import asyncpg

# from psycopg2 import pool
from app.background.db.utils import pyformat2psql
from app.core.config import settings

from app.common.logger import get_logger

logger = get_logger()


class Database:
    def __init__(self):
        self.user = settings.POSTGRES_USER
        self.password = settings.POSTGRES_PASSWORD
        self.host = settings.POSTGRES_SERVER
        self.port = settings.POSTGRES_PORT
        self.database = settings.POSTGRES_DB
        self._cursor = None

        self._connection_pool = None
        self.con = None

    async def connect(self):
        if not self._connection_pool:
            try:
                self._connection_pool = await asyncpg.create_pool(
                    min_size=1,
                    max_size=10,
                    command_timeout=60,
                    host=self.host,
                    port=self.port,
                    user=self.user,
                    password=self.password,
                    database=self.database,
                )

            except Exception as e:
                print(e)

    async def fetch_rows(self, query: str, named_args: Dict[str, Any] = None):
        if not self._connection_pool:
            await self.connect()

        self.con = await self._connection_pool.acquire()
        try:
            if named_args is None:
                result = await self.con.fetch(query)
            else:
                formatted_query, args = pyformat2psql(query, named_args)
                result = await self.con.fetch(formatted_query, *args)
            return result
        except Exception as e:
            print(e)
        finally:
            await self._connection_pool.release(self.con)


database_instance = Database()


async def main():
    result = await database_instance.fetch_rows("select * from telegramqueue")
    print(result[0]["title"])


if __name__ == '__main__':
    asyncio.run(main())

