# current dockerfile contents
FROM python:3.8-slim as python 
ARG PROJECT_PATH
ENV PYTHONUNBUFFERED=true
RUN apt update \
  && apt install -y \
  postgresql-client \
  libpq-dev \
  gcc

WORKDIR $PROJECT_PATH

FROM python as poetry 

ENV POETRY_HOME=/opt/poetry
ENV POETRY_VIRTUALENVS_IN_PROJECT=true
ENV PATH="$POETRY_HOME/bin:$PATH"
ENV POETRY_VERSION=1.3.2

RUN pip install poetry==$POETRY_VERSION
# copy deps
COPY pyproject.toml poetry.lock ./
RUN poetry install --no-interaction --no-ansi -vvv --with prod

FROM python as runtime
ARG PROJECT_PATH
ENV PATH="$PROJECT_PATH/.venv/bin:$PATH"
COPY --from=poetry $PROJECT_PATH $PROJECT_PATH
COPY --from=docker:dind /usr/local/bin/docker /usr/local/bin/
COPY . . 
RUN chmod +x ./start.sh

CMD ["./start.sh"]