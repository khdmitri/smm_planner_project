from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import sessionmaker

from app.core.config import settings


engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI), pool_pre_ping=True, pool_size=20, max_overflow=0)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

engine_async = create_async_engine(str(settings.SQLALCHEMY_DATABASE_URI_ASYNC), echo=False, pool_size=20, max_overflow=0)
SessionLocalAsync = async_sessionmaker(engine_async, expire_on_commit=False)
