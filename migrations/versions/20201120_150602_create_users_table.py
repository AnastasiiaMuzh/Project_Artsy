"""create_users_table

Revision ID: ffdc0a98111c
Revises:
Create Date: 2020-11-20 15:06:02.230689

"""
from alembic import op
import sqlalchemy as sa
from datetime import datetime

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")


# revision identifiers, used by Alembic.
revision = 'ffdc0a98111c'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###

    # # Drop the existing users table if it exists
    # op.drop_table('users', if_exists=True)

    # Create a new users table
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    # sa.Column('firstName', sa.String(length=255), nullable=False),
    # sa.Column('lastName', sa.String(length=255), nullable=False),
    sa.Column('username', sa.String(length=40), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('hashed_password', sa.String(length=255), nullable=False),
    # sa.Column('createdAt', sa.DateTime(), nullable=False, default=datetime.now()),
    # sa.Column('updatedAt', sa.DateTime(), nullable=False, default=datetime.now(), onupdate=datetime.now()),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )

    if environment == "production":
        op.execute(f"ALTER TABLE users SET SCHEMA {SCHEMA};")
    # ### end Alembic commands ###qqqqqqqqq


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('users')
    # ### end Alembic commands ###
