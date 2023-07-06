<!-- Example .env file -->
# Example .env file

```
# API 
# =======================

BASE_URL=http://localhost
API_URL=${BASE_URL}:8080/
ORIGINS=${BASE_URL}, ${BASE_URL}:80, ${BASE_URL}:8080, ${BASE_URL}:8004
SECRET_KEY=key
CELERY_API_KEY=key

# Databases
# =======================
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=db
POSTGRES_PORT=5432
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:${POSTGRES_PORT}/${POSTGRES_DB}
PGDATA=/var/lib/postgresql/data

REDIS_PASSWORD=password
REDIS_PORT=6379
REDIS_DB=0
REDIS_HOST=redis
REDIS_URL=redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}/${REDIS_DB}

# Celery
# =======================
CELERY_BROKER_URL=${REDIS_URL}
CELERY_RESULT_BACKEND=${REDIS_URL}

# Volume Mounts Config
# =======================
PROJECT_PATH=/some/path/

# Pipelines
# =======================
PIPELINES_REPO=repo/pipelines
PIPELINES_REPO_TOKEN=token

# Companion
# =======================
COMPANION_DOMAIN=${BASE_URL}:2111
COMPANION_SECRET=development
COMPANION_DATADIR=./data

COMPANION_GOOGLE_KEY=key
COMPANION_GOOGLE_SECRET=google_secret
COMPANION_DROPBOX_KEY=key
COMPANION_DROPBOX_SECRET=secret
COMPANION_ONEDRIVE_KEY=key
COMPANION_ONEDRIVE_SECRET=secret

TUS_ENDPOINT=http://localhost:1080/files/

# Frontend
# =======================
NEXT_PUBLIC_BASE_URL=${BASE_URL}
NEXT_PUBLIC_BACKEND_ACCESS_URL=${API_URL}
NEXT_PUBLIC_TUS_ENDPOINT=${TUS_ENDPOINT}
NEXT_PUBLIC_COMPANION_URL=${COMPANION_DOMAIN}

# PGAdmin
# =======================
PGADMIN_DEFAULT_EMAIL=email
PGADMIN_DEFAULT_PASSWORD=password
PGADMIN_LISTEN_PORT=80
 