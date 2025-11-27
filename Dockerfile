FROM node:20.18.1-alpine

WORKDIR /usr/src/app

COPY ./dist/apps/core/package.json ./

RUN npm install pg --force

COPY ./dist/apps/core ./dist/core

CMD [ "node", "dist/core/main.js" ]