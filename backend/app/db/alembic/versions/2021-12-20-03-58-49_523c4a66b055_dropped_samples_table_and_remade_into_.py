"""dropped samples table and remade into submissions table, with uuid

Revision ID: 523c4a66b055
Revises: cf6d32774b06
Create Date: 2021-12-20 03:58:49.868680

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '523c4a66b055'
down_revision = 'cf6d32774b06'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('submissions',
    sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('token', sa.String(length=50), nullable=False),
    sa.Column('sample', sa.String(length=50), nullable=True),
    sa.Column('panel', sa.String(length=50), nullable=True),
    sa.Column('email', sa.String(length=50), nullable=True),
    sa.Column('created_date', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_table('samples')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('samples',
    sa.Column('sample', sa.VARCHAR(length=50), autoincrement=False, nullable=True),
    sa.Column('created_date', postgresql.TIMESTAMP(), autoincrement=False, nullable=False),
    sa.Column('token', sa.VARCHAR(length=50), autoincrement=False, nullable=False),
    sa.Column('panel', sa.VARCHAR(length=50), autoincrement=False, nullable=True),
    sa.Column('email', sa.VARCHAR(length=50), autoincrement=False, nullable=True)
    )
    op.drop_table('submissions')
    # ### end Alembic commands ###