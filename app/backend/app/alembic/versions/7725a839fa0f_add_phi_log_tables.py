"""add phi log tables

Revision ID: 7725a839fa0f
Revises: 3c6b6deba609
Create Date: 2022-01-27 15:42:21.449304

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '7725a839fa0f'
down_revision = '3c6b6deba609'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('upload_logs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('submission_id', postgresql.UUID(), nullable=False),
    sa.Column('start_kilobytes', sa.Integer(), nullable=False),
    sa.Column('size_kilobytes', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['submission_id'], ['submissions.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('deletion_logs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('upload_id', postgresql.UUID(), nullable=False),
    sa.Column('deletion_time', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['upload_id'], ['upload_logs.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.alter_column('submissions', 'panel',
               existing_type=sa.VARCHAR(length=50),
               nullable=True)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('submissions', 'panel',
               existing_type=sa.VARCHAR(length=50),
               nullable=False)
    op.drop_table('deletion_logs')
    op.drop_table('upload_logs')
    # ### end Alembic commands ###
