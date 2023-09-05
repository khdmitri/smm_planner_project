from app.crud.base import CRUDBase
from app.models import PostFile
from app.schemas.post_file import PostFileCreate, PostFileUpdate


class CRUDPostFile(CRUDBase[PostFile, PostFileCreate, PostFileUpdate]):
    pass


crud_post_file = CRUDPostFile(PostFile)
