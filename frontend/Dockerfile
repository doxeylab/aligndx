FROM node:19 as deps
WORKDIR /opt/app
ENV NODE_ENV=development
COPY package.json package-lock.json ./
RUN npm i && npx next telemetry disable

FROM deps as base
COPY . .
COPY --from=deps /opt/app/node_modules ./node_modules

FROM base as builder
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_BACKEND_ACCESS_URL 
ARG NEXT_PUBLIC_TUS_ENDPOINT

ENV NODE_ENV=production
RUN npm run build

FROM node:19 as production
WORKDIR /app

COPY --from=builder /opt/app/next.config.js ./
COPY --from=builder /opt/app/public ./public
COPY --from=builder /opt/app/.next ./.next
COPY --from=builder /opt/app/node_modules ./node_modules
COPY --from=builder /opt/app/package-lock.json /opt/app/package.json ./
CMD ["npm", "run", "start"]