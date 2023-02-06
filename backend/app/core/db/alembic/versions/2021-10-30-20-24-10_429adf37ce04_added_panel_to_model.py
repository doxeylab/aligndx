"""added panel to model

Revision ID: 429adf37ce04
Revises: 5cadb60584c4
Create Date: 2021-10-30 20:24:10.784004

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '429adf37ce04'
down_revision = '5cadb60584c4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('samples', sa.Column('panel', sa.String(length=50), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('samples', 'panel')
    # ### end Alembic commands ###