"""Merge multiple heads

Revision ID: e752337b01d5
Revises: 001, 22a15c0d0200, e74bcb31d553
Create Date: 2024-09-27 22:07:50.731543

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e752337b01d5'
down_revision = ('001', '22a15c0d0200', 'e74bcb31d553')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
