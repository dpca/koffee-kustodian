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

function sendResponse(channel, message) {
  console.log('Response: ' + message);
  channel.send(message);
}

slack.on('open', function() {
  console.log('Connected to ' + slack.team.name + ' as ' + slack.self.name);
});

slack.on('message', function(message) {
  console.log('Received: ' + message);

  let channel = slack.getChannelByID(message.channel);
  if (!channel) return;
  let user = slack.getUserByID(message.user);
  if (!user) return;

  // Only respond in the specified channel or to individual users
  if (channel.name === slackChannel) {
    if (message.text.match(/praise koffee/ig)) {
      sendResponse(channel, '༼ つ ◕_◕ ༽つ ☕️');
    } else if (message.text.match(/c/ig)) {
      sendResponse(channel, _.sample(responses)('@' + user.name));
    }
  }
});

slack.on('error', function(err) {
  console.error('Error', err);
});

slack.login();
