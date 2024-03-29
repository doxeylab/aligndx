"""added inputs column to table

Revision ID: 706716e9c98d
Revises: e00d03763955
Create Date: 2023-02-06 12:59:13.513920

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '706716e9c98d'
down_revision = 'e00d03763955'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('submissions', sa.Column('inputs', postgresql.JSON(astext_type=sa.Text()), nullable=True))
    op.drop_column('submissions', 'items')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('submissions', sa.Column('items', postgresql.ARRAY(sa.VARCHAR()), autoincrement=False, nullable=True))
    op.drop_column('submissions', 'inputs')
    # ### end Alembic commands ###
