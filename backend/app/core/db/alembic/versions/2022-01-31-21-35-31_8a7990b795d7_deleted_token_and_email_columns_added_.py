"""deleted token and email columns + added type column

Revision ID: 8a7990b795d7
Revises: e1b29d0113c0
Create Date: 2022-01-31 21:35:31.535823

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8a7990b795d7'
down_revision = 'e1b29d0113c0'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('submissions', sa.Column('sample_name', sa.String(length=50), nullable=True))
    op.add_column('submissions', sa.Column('submission_type', sa.String(length=50), nullable=False))
    op.drop_column('submissions', 'sample')
    op.drop_column('submissions', 'email')
    op.drop_column('submissions', 'temp_token')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('submissions', sa.Column('temp_token', sa.VARCHAR(length=50), autoincrement=False, nullable=True))
    op.add_column('submissions', sa.Column('email', sa.VARCHAR(length=50), autoincrement=False, nullable=True))
    op.add_column('submissions', sa.Column('sample', sa.VARCHAR(length=50), autoincrement=False, nullable=True))
    op.drop_column('submissions', 'submission_type')
    op.drop_column('submissions', 'sample_name')
    # ### end Alembic commands ###
