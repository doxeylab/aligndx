"""remove tax rate from customers

Revision ID: bb780bc089bb
Revises: a1eae6cda3cf
Create Date: 2022-04-14 16:42:28.219933

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bb780bc089bb'
down_revision = 'a1eae6cda3cf'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('customers', 'tax_rate')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('customers', sa.Column('tax_rate', sa.INTEGER(), autoincrement=False, nullable=True))
    # ### end Alembic commands ###
