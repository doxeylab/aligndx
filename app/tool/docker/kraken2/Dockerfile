FROM ubuntu:focal

# for easy upgrade later. ARG variables only persist during build time.
ARG K2VER="2.1.2"

# install dependencies and cleanup apt garbage
RUN apt-get update && apt-get -y --no-install-recommends install \
 wget \
 ca-certificates \
 zlib1g-dev \
 make \
 g++ \
 rsync \
 cpanminus \
 && apt install python3-pip -y\
 && rm -rf /var/lib/apt/lists/* && apt-get autoclean

# perl module required for kraken2-build
RUN cpanm Getopt::Std

# DL Kraken2, unpack, and install
RUN wget https://github.com/DerrickWood/kraken2/archive/v${K2VER}.tar.gz && \
 tar -xzf v${K2VER}.tar.gz && \
 rm -rf v${K2VER}.tar.gz && \
 cd kraken2-${K2VER} && \
 ./install_kraken2.sh .  

ENV PATH="$PATH:/kraken2-${K2VER}" \
    LC_ALL=C

WORKDIR /app/

COPY requirements.txt ./
RUN python3 -m pip --version \
    && python3 -m pip install --upgrade pip \
    && python3 -m pip install --no-cache-dir -r requirements.txt 
 
COPY /app ./app
ENV PYTHONPATH=/app
