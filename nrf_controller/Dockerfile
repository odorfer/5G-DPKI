FROM node:13-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production

COPY . .

RUN apk add --no-cache bash

EXPOSE 4002

CMD ./wait-for-it/wait-for-it.sh localhost:8002 -- node nrf_controller.js
