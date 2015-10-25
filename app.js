'use strict';

require('dotenv').load();
const _ = require('lodash');
const Slack = require('slack-client');
const responses = require('./responses.js');

const slackToken = process.env.SLACK_TOKEN;
const slackChannel = process.env.SLACK_CHANNEL;
const autoReconnect = true;
const autoMark = true;

let slack = new Slack(slackToken, autoReconnect, autoMark);

slack.on('open', function() {
  console.log('Connected to ' + slack.team.name + ' as ' + slack.self.name);
});

slack.on('message', function(message) {
  console.log('Received: ' + message);

  let channel = slack.getChannelGroupOrDMByID(message.channel);
  if (!channel) return;
  let user = slack.getUserByID(message.user);
  if (!user) return;

  // Only respond in the specified channel or to individual users
  if (!channel.is_channel || channel.name === slackChannel) {
    if (message.text.match(/praise koffee/ig)) {
      let res = '༼ つ ◕_◕ ༽つ ☕️';
      console.log('Response: ' + res);
      channel.send(res);
    } else if (message.text.match(/c/ig)) {
      let res = _.sample(responses)('@' + user.name);
      console.log('Response: ' + res);
      channel.send(res);
    }
  }
});

slack.on('error', function(err) {
  console.error('Error', err);
});

slack.login();
