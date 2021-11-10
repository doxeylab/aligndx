"""empty message

Revision ID: 2820ffe5630d
Revises: 
Create Date: 2021-03-30 02:47:34.385074

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2820ffe5630d'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('samples',
    sa.Column('token_id', sa.Integer(), nullable=False),
    sa.Column('sample', sa.String(length=50), nullable=True),
    sa.Column('description', sa.String(length=50), nullable=True),
    sa.Column('created_date', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('token_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('samples')
    # ### end Alembic commands ###