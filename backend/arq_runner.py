import asyncio
import logging

from arq import create_pool, cron
from arq.connections import RedisSettings

from app.background.telegram.telegram_queue import TelegramQueue
from app.common.logger import get_logger
from app.background.db.database import database_instance

logger = get_logger(logging.INFO)


def at_every_x_minutes(x: int, start: int = 0, end: int = 59):
    return {*list(range(start, end, x))}


async def regular_check(ctx):
    logger.info("---REGULAR TASK---")
    logger.info("===Running TelegramQueue instance...")
    tq = TelegramQueue()
    await tq.send_all()
    logger.info("===TelegramQueue work complete...")


async def startup(ctx):
    logger.info("---STARTUP---")


async def shutdown(ctx):
    logger.info("---SHUTDOWN---")


async def main():
    await create_pool(RedisSettings())
    # await redis.enqueue_job('regular_check')


class WorkerSettings:
    functions = [regular_check]
    cron_jobs = [
        cron(
            regular_check,
            minute=at_every_x_minutes(30),
            run_at_startup=True,
            timeout=1500,
            max_tries=5,
        )
    ]
    on_startup = startup
    on_shutdown = shutdown


if __name__ == '__main__':
    asyncio.run(main())
