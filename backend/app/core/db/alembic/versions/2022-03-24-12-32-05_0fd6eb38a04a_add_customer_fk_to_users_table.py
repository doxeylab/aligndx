"""add customer fk to users table

Revision ID: 0fd6eb38a04a
Revises: 61029a07e5fc
Create Date: 2022-03-24 12:32:05.372596

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '0fd6eb38a04a'
down_revision = '61029a07e5fc'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('customers_admin_user_id_fkey', 'customers', type_='foreignkey')
    op.drop_column('customers', 'admin_user_id')
    op.add_column('users', sa.Column('customer_id', postgresql.UUID(as_uuid=True), nullable=True))
    op.add_column('users', sa.Column('is_admin', sa.Boolean(), nullable=True))
    op.create_foreign_key('customer_id_fk', 'users', 'customers', ['customer_id'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('customer_id_fk', 'users', type_='foreignkey')
    op.drop_column('users', 'is_admin')
    op.drop_column('users', 'customer_id')
    op.add_column('customers', sa.Column('admin_user_id', postgresql.UUID(), autoincrement=False, nullable=True))
    op.create_foreign_key('customers_admin_user_id_fkey', 'customers', 'users', ['admin_user_id'], ['id'])
    # ### end Alembic commands ###
