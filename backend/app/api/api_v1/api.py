from fastapi import APIRouter

from app.api.api_v1.endpoints import login, users, posts, telegram_config, telegram_queue

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(posts.router, prefix="/posts", tags=["posts"])
api_router.include_router(telegram_config.router, prefix="/telegram_config", tags=["telegram_config"])
api_router.include_router(telegram_queue.router, prefix="/telegram_queue", tags=["telegram_queue"])
