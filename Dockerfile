# https://github.com/phusion/baseimage-docker
FROM phusion/baseimage:0.9.22

# Use baseimage-docker's init system.
CMD ["/sbin/my_init"]

# Install node and yarn
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install -y nodejs yarn

RUN mkdir /etc/service/koffee-bot
COPY docker/run.sh /etc/service/koffee-bot/run

ENV APP_HOME /app
COPY . $APP_HOME
WORKDIR $APP_HOME
RUN yarn install

# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
