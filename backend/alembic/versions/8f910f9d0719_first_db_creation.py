"""first db creation

Revision ID: 8f910f9d0719
Revises: 
Create Date: 2023-11-11 06:52:32.154124

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8f910f9d0719'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('proxy',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('address', sa.String(), nullable=False),
    sa.Column('protocol', sa.String(), nullable=False),
    sa.Column('is_success', sa.Boolean(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('first_name', sa.String(), nullable=False),
    sa.Column('last_name', sa.String(), nullable=True),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('hashed_password', sa.String(), nullable=False),
    sa.Column('allow_extra_emails', sa.Boolean(), nullable=True),
    sa.Column('is_superuser', sa.Boolean(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.Column('disk_usage_limit', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_email'), 'user', ['email'], unique=True)
    op.create_index(op.f('ix_user_first_name'), 'user', ['first_name'], unique=False)
    op.create_index(op.f('ix_user_id'), 'user', ['id'], unique=False)
    op.create_index(op.f('ix_user_last_name'), 'user', ['last_name'], unique=False)
    op.create_table('facebookconfig',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('marker_token', sa.String(), nullable=False),
    sa.Column('chat_id', sa.String(), nullable=False),
    sa.Column('description', sa.String(), nullable=False),
    sa.Column('schedule', sa.JSON(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('marker_token')
    )
    op.create_table('post',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(), nullable=True),
    sa.Column('video_url', sa.String(), nullable=True),
    sa.Column('markdown_text', sa.String(), nullable=True),
    sa.Column('html_text', sa.String(), nullable=True),
    sa.Column('plain_text', sa.String(), nullable=True),
    sa.Column('json_text', sa.JSON(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('when', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('is_posted', sa.Boolean(), nullable=True),
    sa.Column('post_date', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_post_title'), 'post', ['title'], unique=False)
    op.create_table('telegramconfig',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('chat_id', sa.BigInteger(), nullable=False),
    sa.Column('description', sa.String(), nullable=False),
    sa.Column('schedule', sa.JSON(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('chat_id')
    )
    op.create_table('vkconfig',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('access_token', sa.String(), nullable=False),
    sa.Column('chat_id', sa.BigInteger(), nullable=False),
    sa.Column('description', sa.String(), nullable=False),
    sa.Column('schedule', sa.JSON(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('chat_id')
    )
    op.create_table('facebookqueue',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('post_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('facebook_config_id', sa.Integer(), nullable=False),
    sa.Column('text', sa.String(), nullable=True),
    sa.Column('title', sa.String(), nullable=True),
    sa.Column('link', sa.String(), nullable=True),
    sa.Column('post_result', sa.JSON(), nullable=True),
    sa.Column('when', sa.DateTime(), nullable=True),
    sa.Column('is_posted', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['facebook_config_id'], ['facebookconfig.id'], ),
    sa.ForeignKeyConstraint(['post_id'], ['post.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_facebookqueue_text'), 'facebookqueue', ['text'], unique=False)
    op.create_index(op.f('ix_facebookqueue_title'), 'facebookqueue', ['title'], unique=False)
    op.create_table('postfile',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('filepath', sa.String(), nullable=False),
    sa.Column('content_type', sa.String(), nullable=False),
    sa.Column('filesize', sa.Integer(), nullable=False),
    sa.Column('post_id', sa.Integer(), nullable=False),
    sa.Column('save_result', sa.JSON(), nullable=True),
    sa.ForeignKeyConstraint(['post_id'], ['post.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_postfile_filepath'), 'postfile', ['filepath'], unique=False)
    op.create_table('telegramqueue',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('post_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('telegram_config_id', sa.Integer(), nullable=False),
    sa.Column('text', sa.String(), nullable=True),
    sa.Column('title', sa.String(), nullable=True),
    sa.Column('link', sa.String(), nullable=True),
    sa.Column('post_result', sa.JSON(), nullable=True),
    sa.Column('when', sa.DateTime(), nullable=True),
    sa.Column('is_posted', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['post_id'], ['post.id'], ),
    sa.ForeignKeyConstraint(['telegram_config_id'], ['telegramconfig.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_telegramqueue_text'), 'telegramqueue', ['text'], unique=False)
    op.create_index(op.f('ix_telegramqueue_title'), 'telegramqueue', ['title'], unique=False)
    op.create_table('vkqueue',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('post_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('vk_config_id', sa.Integer(), nullable=False),
    sa.Column('text', sa.String(), nullable=True),
    sa.Column('title', sa.String(), nullable=True),
    sa.Column('link', sa.String(), nullable=True),
    sa.Column('post_result', sa.JSON(), nullable=True),
    sa.Column('when', sa.DateTime(), nullable=True),
    sa.Column('is_posted', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['post_id'], ['post.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.ForeignKeyConstraint(['vk_config_id'], ['vkconfig.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_vkqueue_text'), 'vkqueue', ['text'], unique=False)
    op.create_index(op.f('ix_vkqueue_title'), 'vkqueue', ['title'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_vkqueue_title'), table_name='vkqueue')
    op.drop_index(op.f('ix_vkqueue_text'), table_name='vkqueue')
    op.drop_table('vkqueue')
    op.drop_index(op.f('ix_telegramqueue_title'), table_name='telegramqueue')
    op.drop_index(op.f('ix_telegramqueue_text'), table_name='telegramqueue')
    op.drop_table('telegramqueue')
    op.drop_index(op.f('ix_postfile_filepath'), table_name='postfile')
    op.drop_table('postfile')
    op.drop_index(op.f('ix_facebookqueue_title'), table_name='facebookqueue')
    op.drop_index(op.f('ix_facebookqueue_text'), table_name='facebookqueue')
    op.drop_table('facebookqueue')
    op.drop_table('vkconfig')
    op.drop_table('telegramconfig')
    op.drop_index(op.f('ix_post_title'), table_name='post')
    op.drop_table('post')
    op.drop_table('facebookconfig')
    op.drop_index(op.f('ix_user_last_name'), table_name='user')
    op.drop_index(op.f('ix_user_id'), table_name='user')
    op.drop_index(op.f('ix_user_first_name'), table_name='user')
    op.drop_index(op.f('ix_user_email'), table_name='user')
    op.drop_table('user')
    op.drop_table('proxy')
    # ### end Alembic commands ###
