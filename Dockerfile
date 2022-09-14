FROM node:16-alpine

RUN npm install -g -s pm2

ENV APP_HOME /app
RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME

COPY tsconfig.json $APP_HOME
COPY package.json $APP_HOME
COPY yarn.lock $APP_HOME
RUN yarn install

COPY pm2.json $APP_HOME
COPY src $APP_HOME/src
RUN yarn build

ENV NPM_CONFIG_LOGLEVEL warn

CMD ["pm2-docker", "start", "pm2.json"]
