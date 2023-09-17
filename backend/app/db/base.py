# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.base_class import Base  # noqa
from app.models.user import User # noqa
from app.models.post import Post, PostFile # Noqa
from app.models.telegram_config import TelegramConfig # Noqa
from app.models.telegram_queue import TelegramQueue # Noqa
from app.models.facebook_config import FacebookConfig # Noqa
from app.models.facebook_queue import FacebookQueue # Noqa
