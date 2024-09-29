"""Agregar descripción de la migración aquí

Revision ID: 1d64f781f01b
Revises: None
Create Date: 2024-09-29 12:00:00.000000

"""

# revision identifiers, used by Alembic.
revision = '1d64f781f01b'
down_revision = None  # Cambia esto si hay una migración anterior
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    # Aquí van las operaciones para aplicar la migración
    pass


def downgrade():
    # Aquí van las operaciones para revertir la migración
    pass
