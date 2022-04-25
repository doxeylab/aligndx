FROM node:14.16.0

COPY package.json package-lock.json ./

RUN npm install && npm cache clean --force

ENV PATH /node_modules/.bin:$PATH

WORKDIR /app 
 
COPY . . 