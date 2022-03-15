"""added relationships, and refactored models

Revision ID: 31df2af0bf8f
Revises: 33323149a317
Create Date: 2022-03-15 19:00:41.217537

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '31df2af0bf8f'
down_revision = '33323149a317'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('submissions', sa.Column('name', sa.String(), nullable=False))
    op.alter_column('submissions', 'user_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.drop_column('submissions', 'sample_name')
    op.alter_column('users', 'email',
               existing_type=sa.VARCHAR(length=50),
               nullable=False)
    op.alter_column('users', 'hashed_password',
               existing_type=sa.VARCHAR(length=250),
               nullable=False)
    op.alter_column('users', 'name',
               existing_type=sa.VARCHAR(length=50),
               nullable=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('users', 'name',
               existing_type=sa.VARCHAR(length=50),
               nullable=True)
    op.alter_column('users', 'hashed_password',
               existing_type=sa.VARCHAR(length=250),
               nullable=True)
    op.alter_column('users', 'email',
               existing_type=sa.VARCHAR(length=50),
               nullable=True)
    op.add_column('submissions', sa.Column('sample_name', sa.VARCHAR(length=50), autoincrement=False, nullable=True))
    op.alter_column('submissions', 'user_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.drop_column('submissions', 'name')
    # ### end Alembic commands ###
