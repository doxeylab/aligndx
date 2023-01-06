# current dockerfile contents
FROM python:3.8 as python 

ENV PYTHONUNBUFFERED=true
RUN apt update \
  && apt install -y \
  postgresql-client \
  gcc

WORKDIR /app

FROM python as poetry 

ENV POETRY_HOME=/opt/poetry
ENV POETRY_VIRTUALENVS_IN_PROJECT=true
ENV PATH="$POETRY_HOME/bin:$PATH"
RUN python -c 'from urllib.request import urlopen; print(urlopen("https://install.python-poetry.org").read().decode())' | python -
# copy deps
COPY pyproject.toml poetry.lock ./
RUN poetry install --no-interaction --no-ansi -vvv

FROM python as runtime

ENV PATH="/app/.venv/bin:$PATH"
COPY --from=poetry /app /app
COPY --from=docker:dind /usr/local/bin/docker /usr/local/bin/
COPY . .
# ARG USER_ID=1000
# ARG GROUP_ID=1000

# RUN if getent group python; then groupdel python; fi &&\
#   groupadd -g ${GROUP_ID} python &&\
#   useradd -l -u ${USER_ID} -g python python &&\
#   install -d -m 0755 -o python -g python /app/ &&\
#   mkdir /app/data &&\
#   chown --changes --silent --no-dereference --recursive \
#     --from=0:0 ${USER_ID}:${GROUP_ID} \
#     /app \
#     /usr/local/bin 

# USER python 
