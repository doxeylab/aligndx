# Used to build the backend container image

# Former dockerfile contents
# # Select python image
# FROM ubuntu:20.04 AS compile-image

# # creates working directory
# RUN mkdir /app
# WORKDIR /app 
# ARG DEBIAN_FRONTEND=noninteractive
# RUN apt-get update -yq \
#     && apt-get install -y --no-install-recommends build-essential gcc postgresql postgresql-contrib

# # create virtulenvironment
# # # note that this might not be necessary, but its nice to keep our workflows consistent
# ENV VIRTUAL_ENV=/opt/venv
# RUN python3 -m venv $VIRTUAL_ENV
# ENV PATH="$VIRTUAL_ENV/bin:$PATH"


# # set environment variables
# # pythondontwritebytecode basically prevents python from writing those cython files to disc (__pycache__)
# # pythonnunbuffered stops it
# ENV PYTHONDONTWRITEBYTECODE 1
# ENV PYTHONUNBUFFERED 1


# # runs pip install without storing installation files and source files
# # Why? makes the docker image smaller
# # RUN pip install --no-cache-dir -r requirements.txt
# #  wheel --wheel-dir=/root/wheels
# COPY requirements.txt .
# RUN pip install --upgrade pip setuptools wheel \
#     && pip install --no-cache-dir -r requirements.txt 

# COPY .  . 

# FROM ubuntu:20.04 AS build-image
# COPY --from=compile-image /opt/venv /opt/venv

# # Make sure we use the virtualenv:
# ENV PATH="$VIRTUAL_ENV/bin:$PATH"
# CMD ['app']

# current dockerfile contents
FROM python:3.8
 
WORKDIR /app/

RUN apt update \
    && apt install -y postgresql-client gcc  

COPY /dependencies/api/requirements.txt /app
RUN pip install -U pip \
    && pip install --no-cache-dir -r requirements.txt 

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