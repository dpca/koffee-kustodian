FROM node:8-alpine

COPY . /app
WORKDIR /app
RUN yarn install

CMD ["node", "src/app.js"]
