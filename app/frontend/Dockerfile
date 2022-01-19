FROM node:14.16.0

WORKDIR /app 
 
ENV PATH=$PATH:./node_modules/.bin

COPY . .

RUN npm install

# ENTRYPOINT ["/bin/bash", "/app/run.sh"]
# CMD ["start"]