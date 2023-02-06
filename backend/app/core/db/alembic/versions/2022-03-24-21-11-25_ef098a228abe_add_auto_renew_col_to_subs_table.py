"""add auto-renew col to subs table

Revision ID: ef098a228abe
Revises: 0fd6eb38a04a
Create Date: 2022-03-24 21:11:25.017773

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ef098a228abe'
down_revision = '0fd6eb38a04a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('subscriptions', sa.Column('auto_renew', sa.Boolean(), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('subscriptions', 'auto_renew')
    # ### end Alembic commands ###