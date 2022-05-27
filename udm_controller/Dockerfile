FROM node:13-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production

COPY . .

RUN apk add --no-cache bash

EXPOSE 3001

CMD ./wait-for-it/wait-for-it.sh localhost:8001 -- node udm_controller.js
