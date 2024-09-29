"""Add user_id to vehiculos manually

Revision ID: 001
Revises: 
Create Date: 2024-09-27 21:59:51.139426

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('vehiculos', sa.Column('user_id', sa.Integer(), nullable=False))
    op.create_foreign_key('fk_user_id', 'vehiculos', 'users', ['user_id'], ['id'])


def downgrade():
    op.drop_constraint('fk_user_id', 'vehiculos', type_='foreignkey')
    op.drop_column('vehiculos', 'user_id')
