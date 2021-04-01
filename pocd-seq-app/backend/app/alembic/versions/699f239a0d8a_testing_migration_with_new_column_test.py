"""testing migration with new column test

Revision ID: 699f239a0d8a
Revises: 9d5852c7b06e
Create Date: 2021-03-30 18:10:58.447475

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '699f239a0d8a'
down_revision = '9d5852c7b06e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('samples', sa.Column('test', sa.String(length=50), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('samples', 'test')
    # ### end Alembic commands ###
