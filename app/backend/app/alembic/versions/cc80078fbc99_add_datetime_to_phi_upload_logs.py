"""add datetime to phi upload logs

Revision ID: cc80078fbc99
Revises: 96f773dbacdc
Create Date: 2022-01-27 16:28:12.415705

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cc80078fbc99'
down_revision = '96f773dbacdc'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('upload_logs', sa.Column('creation_time', sa.DateTime(), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('upload_logs', 'creation_time')
    # ### end Alembic commands ###