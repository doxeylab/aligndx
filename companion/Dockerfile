FROM node:19 as deps
WORKDIR /opt/app
COPY package.json package-lock.json ./
RUN npm i 

FROM deps as base
COPY . .
COPY --from=deps /opt/app/node_modules ./node_modules
RUN mkdir 'data' 
