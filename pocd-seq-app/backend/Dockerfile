# Used to build the backend container image

# Select python image
FROM python:3.8

# creates working directory
RUN mkdir /app
WORKDIR /app


# updates and installs database dependency
RUN apt update && \
    apt install -y postgresql-client
    

# set environment variables
# pythondontwritebytecode basically prevents python from writing those cython files to disc (__pycache__)
# pythonnunbuffered stops it
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# create virtulenvironment
# # note that this might not be necessary, but its nice to keep our workflows consistent
# ENV VIRTUAL_ENV=/opt/venv
# RUN python3 -m venv $VIRTUAL_ENV
# ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# runs pip install without storing installation files and source files
# Why? makes the docker image smaller
# RUN pip install --no-cache-dir -r requirements.txt
COPY requirements.txt .
RUN pip install --upgrade pip \
    && pip wheel --wheel-dir=/root/wheels -r requirements.txt

COPY . . 
 