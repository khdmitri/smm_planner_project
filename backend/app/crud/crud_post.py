from app.crud.base import CRUDBase
from app.models import Post
from app.schemas.post import PostCreate, PostUpdate


class CRUDPost(CRUDBase[Post, PostCreate, PostUpdate]):
    pass


crud_post = CRUDPost(Post)
