FROM node:6-alpine

COPY . /app
WORKDIR /app
RUN npm install

CMD ["node", "src/app.js"]
