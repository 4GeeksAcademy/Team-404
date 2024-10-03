"""Eliminar tabla conductores

Revision ID: f813d7a3f300
Revises: 
Create Date: 2024-09-30 19:14:58.792666

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

def upgrade():
    op.drop_table('conductores')

def downgrade():
    op.create_table(
        'conductores',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('nombre', sa.String, nullable=False),
        sa.Column('apellidos', sa.String, nullable=False),
        sa.Column('fecha_nacimiento', sa.Date, nullable=False),
        sa.Column('poblacion', sa.String),
        sa.Column('ciudad', sa.String),
        sa.Column('sueldo', sa.Numeric),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
    )
