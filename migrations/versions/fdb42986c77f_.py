"""empty message

Revision ID: fdb42986c77f
Revises: 1d64f781f01b
Create Date: 2023-09-29 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'fdb42986c77f'
down_revision = '1d64f781f01b'
branch_labels = None
depends_on = None

def upgrade():
    # Verificamos si la columna 'poblacion' ya existe
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    columns = inspector.get_columns('conductores')
    if 'poblacion' not in [c['name'] for c in columns]:
        # Si la columna no existe, la añadimos
        op.add_column('conductores', sa.Column('poblacion', sa.String(length=100), nullable=True))
    else:
        print("La columna 'poblacion' ya existe en la tabla 'conductores'. No se realizaron cambios.")

    # Aquí puedes añadir cualquier otra modificación que necesites hacer a la tabla 'conductores'

def downgrade():
    # Intentamos eliminar la columna 'poblacion' si existe
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    columns = inspector.get_columns('conductores')
    if 'poblacion' in [c['name'] for c in columns]:
        op.drop_column('conductores', 'poblacion')