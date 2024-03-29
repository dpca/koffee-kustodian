# koffee-kustodian

A bot that complains when users use the letter "C" in slack, responding with a
random response from [src/responses.js](src/responses.js) when provoked.

## Run locally

Uses [dotenv](https://github.com/motdotla/dotenv) for development
configuration. Set the following in `.env`:

* SLACK_TOKEN - see below
* SLACK_CHANNELS - koffee channel(s) to join and complain in, comma separated

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
docker run --rm -e "SLACK_TOKEN=$SLACK_TOKEN" -e "SLACK_CHANNELS=random" dpca/koffee-kustodian
```

Or build locally:

```
docker build -t koffee-bot .
docker run --rm -e "SLACK_TOKEN=$SLACK_TOKEN" -e "SLACK_CHANNELS=random" koffee-bot
```
