FROM node:14.16.0

WORKDIR /app 

# RUN chown -Rh node:node /app

# USER node

# COPY package.json package-lock.json ./

# RUN npm install && npm cache clean --force

# ENV PATH /app/node_modules/.bin:$PATH

# Run after mounting volumes
CMD [ "sh", "-c", "rm -rf /node_modules/* && npm install && npm cache clean --force && npm start" ]

COPY . . 