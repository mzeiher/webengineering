FROM node:14-alpine

RUN mkdir -p /app

ADD ./node_modules /app/node_modules
ADD ./echoserver.js /app

WORKDIR /app
ENTRYPOINT [ "node", "./echoserver.js" ]