# this image has both python and rocksDB installed
FROM toh995/rocksdb-python:6.14.5_3.8.6-slim-buster
 
WORKDIR /app/

# install python-rocksdb
ARG ROCKSDB_DEPENDENCIES="g++ libbz2-dev liblz4-dev libsnappy-dev libz-dev"

RUN apt update \ 
    && apt-get install -y $ROCKSDB_DEPENDENCIES \  
    && rm -rf /var/lib/apt/lists/*

COPY /dependencies/worker/requirements.txt ./
RUN pip install -U pip \
    && pip install --no-cache-dir -r requirements.txt \
    && pip install python-rocksdb==0.7.0 


# set up the wait script
RUN apt-get update \
  && apt-get install -y netcat \
  && rm -rf /var/lib/apt/lists/*

COPY bin/wait-for/ ./bin/wait-for/
RUN chmod u+x ./bin/wait-for/wait-for.sh


ENV PYTHONPATH=/app

# copy source files

COPY . .

WORKDIR /app/
