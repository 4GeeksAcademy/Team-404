"""Create initial migration"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '88df2626220d'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    pass  # No operations to perform in this migration


def downgrade() -> None:
    pass  # No operations to reverse in this migration