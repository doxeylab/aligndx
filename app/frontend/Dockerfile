# FROM node:14.16.0

# ADD package.json /package.json

# ENV NODE_PATH=/node_modules
# ENV PATH=$PATH:/node_modules/.bin
# RUN npm install

# WORKDIR /app
# ADD . /app 

# ENTRYPOINT ["/bin/bash", "/app/run.sh"]
# CMD ["start"]

# pull latest image
FROM node:14-alpine
# set working directory
WORKDIR /app 

# add node_modules to path
ENV NODE_PATH=node_modules
ENV PATH node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install \
    && npm rebuild node-sass \
    && npm update

# add app
COPY . ./

# start app
CMD ["npm", "start"] 
# ENTRYPOINT ["/bin/bash", "/app/run.sh"] 