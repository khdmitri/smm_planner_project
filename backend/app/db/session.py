import logging

from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import sessionmaker

from app.common.logger import get_logger
from app.core.config import settings

logger = get_logger(logging.INFO)


engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI), pool_pre_ping=True, pool_size=20, max_overflow=0)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

logger.info(f"DB_PATH={str(settings.SQLALCHEMY_DATABASE_URI_ASYNC)}")
engine_async = create_async_engine(str(settings.SQLALCHEMY_DATABASE_URI_ASYNC), echo=False, pool_size=20, max_overflow=0, 
                                   pool_recycle=1500, connect_args={"server_settings": {"tcp_keepalives_idle": "600"}})
SessionLocalAsync = async_sessionmaker(engine_async, expire_on_commit=False)
