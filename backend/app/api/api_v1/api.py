from fastapi import APIRouter

from app.api.api_v1.endpoints import login, users, posts, telegram_config, telegram_queue, facebook_config, \
    facebook_queue, vk_config, vk_queue, chatgpt, docs, instagram_config, instagram_queue

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(posts.router, prefix="/posts", tags=["posts"])
api_router.include_router(telegram_config.router, prefix="/telegram_config", tags=["telegram_config"])
api_router.include_router(telegram_queue.router, prefix="/telegram_queue", tags=["telegram_queue"])
api_router.include_router(facebook_config.router, prefix="/facebook_config", tags=["facebook_config"])
api_router.include_router(facebook_queue.router, prefix="/facebook_queue", tags=["facebook_queue"])
api_router.include_router(instagram_config.router, prefix="/instagram_config", tags=["instagram_config"])
api_router.include_router(instagram_queue.router, prefix="/instagram_queue", tags=["instagram_queue"])
api_router.include_router(vk_config.router, prefix="/vk_config", tags=["vk_config"])
api_router.include_router(vk_queue.router, prefix="/vk_queue", tags=["vk_queue"])
api_router.include_router(chatgpt.router, prefix="/chat", tags=["chat"])
api_router.include_router(docs.router, prefix="/document", tags=["document"])
