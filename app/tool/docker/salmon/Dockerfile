FROM combinelab/salmon 

WORKDIR /app/

COPY requirements.txt ./
RUN apt-get update \
    && apt-get install python3.8 -y \
    && update-alternatives --install /usr/bin/python python /usr/bin/python3.8 1\ 
    && python --version \
    && apt install python3-pip -y \
    && python -m pip --version \
    && python -m pip install --upgrade pip \
    && python -m pip install --no-cache-dir -r requirements.txt  
 
WORKDIR /app/
ENV PYTHONPATH=/app
