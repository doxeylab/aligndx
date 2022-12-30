# current dockerfile contents
FROM python:3.8 as python 
ENV PYTHONUNBUFFERED=true
WORKDIR /app/
RUN apt update \
  && apt install -y \
  postgresql-client \
  gcc

FROM python as poetry 
ENV POETRY_HOME=/opt/poetry
ENV POETRY_VIRTUALENVS_IN_PROJECT=true
ENV PATH="$POETRY_HOME/bin:$PATH"
RUN python -c 'from urllib.request import urlopen; print(urlopen("https://install.python-poetry.org").read().decode())' | python -
# copy source files
COPY . .
RUN poetry install --no-interaction --no-ansi -vvv

FROM python as runtime
ENV PATH="/app/.venv/bin:$PATH"
COPY --from=poetry /app /app
COPY --from=docker:dind /usr/local/bin/docker /usr/local/bin/

# set up the wait script
RUN apt-get install -y netcat \
  && rm -rf /var/lib/apt/lists/*

COPY bin/wait-for/ ./bin/wait-for/
RUN chmod u+x ./bin/wait-for/wait-for.sh

WORKDIR /app/
