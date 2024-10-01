"""empty message

Revision ID: 7c57015821a1
Revises: 06c9458f21dd
Create Date: 2024-10-01 13:24:53.096461

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7c57015821a1'
down_revision = '06c9458f21dd'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('socios', schema=None) as batch_op:
        batch_op.alter_column('periodos_espera',
               existing_type=sa.INTEGER(),
               type_=sa.Float(),
               existing_nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('socios', schema=None) as batch_op:
        batch_op.alter_column('periodos_espera',
               existing_type=sa.Float(),
               type_=sa.INTEGER(),
               existing_nullable=True)

    # ### end Alembic commands ###
