FROM node:20-alpine AS builder

RUN mkdir -p /src
COPY . /src
WORKDIR /src
RUN npm i && npm run build

FROM node:20-alpine
RUN mkdir /app
COPY --from=builder /src/package.json /app/
COPY --from=builder /src/dist/* /app/

WORKDIR /app
RUN npm install --omit=dev

CMD ["node", "./index.js"]
