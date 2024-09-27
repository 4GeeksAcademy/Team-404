from alembic import op
import sqlalchemy as sa

# Identificadores de revisión y versión
revision = 'a6eb92f6f4b6'
down_revision = None  # O el ID de la migración anterior
branch_labels = None
depends_on = None

def upgrade():
    # Aquí agregas las instrucciones para la actualización de la base de datos
    pass

def downgrade():
    # Aquí agregas las instrucciones para revertir los cambios (si aplica)
    pass