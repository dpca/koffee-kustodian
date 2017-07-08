[![Build Status](https://travis-ci.org/dpca/koffee-kustodian.svg?branch=master)](https://travis-ci.org/dpca/koffee-kustodian)
[![Code Climate](https://codeclimate.com/github/dpca/koffee-kustodian/badges/gpa.svg)](https://codeclimate.com/github/dpca/koffee-kustodian)

* * *

# koffee-kustodian

A bot that complains when users use the letter "C" in slack, responding with a
random response from [src/responses.js](src/responses.js) when provoked.

## Run locally

Uses [dotenv](https://github.com/motdotla/dotenv) for development
configuration. Set the following in `.env`:

* SLACK_TOKEN - see below
* SLACK_CHANNEL - koffee channel to join and complain in

You can request a token for testing purposes from
https://api.slack.com/docs/oauth-test-tokens but should use a bot token from
https://my.slack.com/services/new/bot for a real deployment. Read more about
bot users here: https://api.slack.com/bot-users.

```
yarn install
node src/app.js
```

## Run with docker

When using docker, pass in the environment variables instead of using a `.env`
file.

```
docker run --rm -e "SLACK_TOKEN=$SLACK_TOKEN" -e "SLACK_CHANNEL=random" dpca/koffee-kustodian
```

Or build locally:

```
docker build -t koffee-bot .
docker run --rm -e "SLACK_TOKEN=$SLACK_TOKEN" -e "SLACK_CHANNEL=random" koffee-bot
```
