"""added status column to submissions table

Revision ID: dbe1aae70672
Revises: e7f9168b3325
Create Date: 2023-01-12 23:08:43.250749

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'dbe1aae70672'
down_revision = 'e7f9168b3325'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('submissions', sa.Column('status', sa.String(), nullable=True))
    op.execute("UPDATE submissions SET status = false")
    op.alter_column('submissions', 'status', nullable=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('submissions', 'status')
    # ### end Alembic commands ###
