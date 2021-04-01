FROM node:14.16.0

ADD package.json /package.json

ENV NODE_PATH=/node_modules
ENV PATH=$PATH:/node_modules/.bin
RUN npm install

WORKDIR /app
ADD . /app 

ENTRYPOINT ["/bin/bash", "/app/run.sh"]
CMD ["start"]
