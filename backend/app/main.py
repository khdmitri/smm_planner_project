import asyncio
import json

import uvicorn
from starlette.middleware.cors import CORSMiddleware

from app.api.api_v1.api import api_router
from app.core.config import settings

from global_const import app

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        # allow_origins=['*'],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)


# @app.on_event("startup")
# async def startup_event() -> None:
#     """tasks to do at server startup"""
#     print("Startup event occurs")
#     # rctf = ReportClassTimeFrame()
#     # rctf.start()
#     #
#     gtr_bcgrnd = GtrThreadManagerSingleton()
#     await gtr_bcgrnd.start_thread_or_restart(full_clean=False)
#
#     gtr_singleton = GtrSingleton()
#     await gtr_singleton.update()


if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=8000)
