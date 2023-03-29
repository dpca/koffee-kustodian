import * as dotenv from 'dotenv';

dotenv.config();

import _ from 'lodash';
import { RTMClient } from '@slack/rtm-api';

const responses = require('./responses.js');
const whitelist = require('./whitelist.js');

const slackToken = process.env.SLACK_TOKEN;
const slackChannels = process.env.SLACK_CHANNEL.split(',');

const rtm = new RTMClient(slackToken);

function sendResponse(channel, message) {
  console.log(`Response: ${message}`);
  rtm.sendMessage(message, channel);
}

function shouldComplain(text) {
  // Replace all ok text from the whitelist with nothing and replace user ids
  // with their names
  const filteredText = _.reduce(
    whitelist,
    (res, okText) => res.replace(okText, ''),
    text,
  ).replace(/<@(\w*)>/, '');
  //console.log('Post whitelist: ' + filteredText);
  return /(c|с|ç|¢|ć|ĉ|Č)/ig.test(filteredText);
}

rtm.on('message', ({ user, channel, text }) => {
  if (text === undefined) {
    return;
  }

  // Only respond in the specified channel
  if (slackChannels.includes(channel)) {
    console.log(`Received: ${channel} <@${user}> ${text}`);
    if (shouldComplain(text)) {
      sendResponse(channel, _.sample(responses)(`<@${user}>`));
    } else if (text.match(/praise koffee/ig)) {
      sendResponse(channel, '༼ つ ◕_◕ ༽つ ☕️');
    }
  }
});

rtm.on('member_joined_channel', async (event) => {
  if (slackChannels.includes(event.channel)) {
    sendResponse(event.channel, `Welkome to the promised land <@${event.user}>!`);
  }
});

rtm.on('member_left_channel', async (event) => {
  if (slackChannels.includes(event.channel)) {
    sendResponse(event.channel, `Bye bye <@${event.user}>!`);
  }
});

(async () => {
  const { self, team } = await rtm.start();
  console.log(`Connected to ${(team as any).name} as ${(self as any).name}`);
})();
