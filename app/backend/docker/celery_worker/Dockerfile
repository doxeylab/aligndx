 # current dockerfile contents
FROM python:3.8
 
WORKDIR /app

RUN apt update 

COPY /dependencies/celery_worker/requirements.txt .
RUN pip install -U pip \
    && pip install --no-cache-dir -r requirements.txt 

# set up the wait script
RUN apt-get update \
  && apt-get install -y netcat \
  && rm -rf /var/lib/apt/lists/*

COPY bin/wait-for/ ./bin/wait-for/
RUN chmod u+x ./bin/wait-for/wait-for.sh

ENV PYTHONPATH=/app \
  PYTHONDONTWRITEBYTECODE=1

# copy source files
COPY /app/celery ./celery
COPY /app/scripts ./scripts

WORKDIR /
 