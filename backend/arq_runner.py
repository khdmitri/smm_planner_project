import asyncio
import logging
import os

from arq import create_pool, cron
from arq.connections import RedisSettings

from app.background.meta.meta_queue import MetaQueue
from app.background.telegram.telegram_queue import TelegramQueue
from app.background.vk.vk_queue import VkQueue
from app.common.logger import get_logger
from app.background.db.database import database_instance
from dotenv import load_dotenv

load_dotenv()

logger = get_logger(logging.INFO)

REDIS_HOST = os.getenv("REDIS_HOST")

redis_settings = RedisSettings(host=REDIS_HOST)

EVERY_MINUTES_TO_CHECK=3


def at_every_x_minutes(x: int, start: int = 0, end: int = 59):
    return {*list(range(start, end, x))}


async def regular_check(ctx):
    logger.info("---REGULAR TASK---")
    logger.info("===Running TelegramQueue instance...")
    tq = TelegramQueue()
    await tq.send_all()
    await tq.close()
    logger.info("===TelegramQueue work complete...")

    logger.info("===Running VkQueue instance...")
    vk = VkQueue()
    await vk.send_all()
    logger.info("===VkQueue work complete...")

    logger.info("===Running MetaQueue instance...")
    meta = MetaQueue()
    await meta.send_all()
    logger.info("===MetaQueue work complete...")


async def startup(ctx):
    logger.info("---STARTUP---")


async def shutdown(ctx):
    logger.info("---SHUTDOWN---")


async def main():
    await create_pool(redis_settings)
    # await redis.enqueue_job('regular_check')


class WorkerSettings:
    functions = [regular_check]
    cron_jobs = [
        cron(
            regular_check,
            minute=at_every_x_minutes(EVERY_MINUTES_TO_CHECK),
            run_at_startup=True,
            # timeout=1500,
            # max_tries=5,
        )
    ]
    on_startup = startup
    on_shutdown = shutdown
    redis_settings = redis_settings


if __name__ == '__main__':
    asyncio.run(main())
