# ================================================
# STAGE 1: Python Base
# ================================================
FROM python:3.11-slim-buster as python-base

ENV PYTHONUNBUFFERED=true
ENV PATH="/.venv/bin:$PATH"

RUN apt-get update && apt-get install -y \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# ================================================
# STAGE 2: Poetry for Python Dependencies
# ================================================
FROM python-base as poetry-stage

WORKDIR /app

ENV POETRY_HOME=/opt/poetry
ENV POETRY_VIRTUALENVS_IN_PROJECT=true
ENV PATH="$POETRY_HOME/bin:$PATH"

RUN python -c 'from urllib.request import urlopen; print(urlopen("https://install.python-poetry.org").read().decode())' | python -
COPY pyproject.toml poetry.lock ./
RUN poetry install --no-interaction --no-ansi -vvv
RUN poetry run jupyter lite build --output-dir ./dist

# # ================================================
# # STAGE 3: Build jupyer assets
# # ================================================
# FROM python-base as build-static

# COPY --from=poetry-stage /app/.venv /.venv

# RUN jupyter lite build --output-dir ./dist

# ===============================
# STAGE 4: NGINX for serving static files
# ===============================
FROM nginx:alpine as runtime

RUN rm /etc/nginx/conf.d/default.conf
COPY confs/local.conf /etc/nginx/conf.d/
COPY --from=poetry-stage /app/dist /usr/share/nginx/html/reports
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
