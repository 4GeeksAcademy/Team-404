"""Migration description

Revision ID: dcc529d4f557
Revises: 
Create Date: 2024-10-04 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'dcc529d4f557'
down_revision = None  # Cambia esto si hay una migración anterior
branch_labels = None
depends_on = None

def upgrade():
    pass  # Aquí irían las operaciones para actualizar la base de datos


def downgrade():
    pass  # Aquí irían las operaciones para revertir la migración
