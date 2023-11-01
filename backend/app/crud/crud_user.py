import datetime
from typing import Any, Dict, Optional, Union, List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_password
from app.crud.base import CRUDBase
from app.models import Post
from app.models.user import User
from app.schemas import UserStatistic
from app.schemas.user import UserCreate, UserUpdate


class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    async def get_by_email(self, db: AsyncSession, *, email: str) -> Optional[User]:
        result = await db.execute(select(User).filter(User.email == email))
        return result.scalars().first()

    async def get_by_ids(self, db: AsyncSession, *, ids: List[int]):
        result = await db.execute(select(User).filter(User.id.in_(ids)))
        return result.scalars().all()

    async def create(self, db: AsyncSession, *, obj_in: UserCreate) -> User:
        db_obj = User(
            email=obj_in.email,
            first_name=obj_in.first_name,
            hashed_password=get_password_hash(obj_in.password),
            last_name=obj_in.last_name,
            allow_extra_emails=obj_in.allow_extra_emails
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update(
        self, db: AsyncSession, *, db_obj: User, obj_in: Union[UserUpdate, Dict[str, Any]]
    ) -> User:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)
        if update_data.get("password", None):
            hashed_password = get_password_hash(update_data["password"])
            del update_data["password"]
            update_data["hashed_password"] = hashed_password

        result = await super().update(db, db_obj=db_obj, obj_in=update_data)
        return result

    async def authenticate(self, db: AsyncSession, *, email: str, password: str) -> Optional[User]:
        user = await self.get_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    def is_active(self, user: User) -> bool:
        return user.is_active

    def is_superuser(self, user: User) -> bool:
        return user.is_superuser

    async def get_statistic(self, db: AsyncSession, *, current_user: User) -> UserStatistic:
        # posts = await self.get_multi_by_user(db, user_id=current_user.id)
        posts = await db.execute(select(Post).filter(Post.user_id == current_user.id).order_by(
            Post.when.desc()
        ))
        posts = posts.scalars().all()
        disk_loaded = 0
        posts_created = len(posts)
        posts_sent = 0
        last_activity = None
        for post in posts:
            if isinstance(post.post_date, datetime.datetime):
                if last_activity is None or last_activity < post.post_date:
                    last_activity = post.post_date
            if post.is_posted:
                posts_sent += 1
            post_files = post.post_files
            for file in post_files:
                disk_loaded += file.filesize
        user_statistic = UserStatistic(
            disk_usage_limit=current_user.disk_usage_limit,
            disk_loaded=disk_loaded // (1024*1024),
            posts_created=posts_created,
            posts_sent=posts_sent,
            last_activity=last_activity
        )
        return user_statistic


user = CRUDUser(User)
