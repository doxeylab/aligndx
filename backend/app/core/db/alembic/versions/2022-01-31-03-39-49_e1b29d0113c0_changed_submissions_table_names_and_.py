"""changed submissions table names and made temp_token nullable

Revision ID: e1b29d0113c0
Revises: cee5d4c5f18c
Create Date: 2022-01-31 03:39:49.832976

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e1b29d0113c0'
down_revision = 'cee5d4c5f18c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('submissions', sa.Column('temp_token', sa.String(length=50), nullable=True))
    op.drop_column('submissions', 'token')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('submissions', sa.Column('token', sa.VARCHAR(length=50), autoincrement=False, nullable=False))
    op.drop_column('submissions', 'temp_token')
    # ### end Alembic commands ###