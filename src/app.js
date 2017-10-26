'use strict';

require('dotenv').config();
const _ = require('lodash');
const RtmClient = require('@slack/client').RtmClient;
const MemoryDataStore = require('@slack/client').MemoryDataStore;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const responses = require('./responses.js');
const whitelist = require('./whitelist.js');

const slackToken = process.env.SLACK_TOKEN;
const slackChannel = process.env.SLACK_CHANNEL;

const rtm = new RtmClient(slackToken, {
  logLevel: 'error',
  dataStore: new MemoryDataStore(),
});

/**
 * Sends a response to slack
 * @param {String} channel
 * @param {String} message
 */
function sendResponse(channel, message) {
  console.log(`Response: ${message}`);
  rtm.sendMessage(message, channel.id);
}

/**
 * Returns whether or not the bot should complain
 * @param {String} text
 * @return {Boolean} true if the bot should complain
 */
function shouldComplain(message) {
  // Replace all ok text from the whitelist with nothing and replace user ids
  // with their names
  const filteredText = _.reduce(
    whitelist,
    (res, okText) => res.replace(okText, ''),
    message.text,
  ).replace(/<@(\w*)>/, (match, id) => rtm.dataStore.getUserById(id).name);
  //console.log('Post whitelist: ' + filteredText);
  return /c/ig.test(filteredText);
}

/**
 * Responds to special message subtypes, like joining or leaving a channel
 * @param {Message} message
 * @param {Channel} channel
 * @param {User} user
 */
function subtypeRespond(message, channel, user) {
  switch(message.subtype) {
    case 'channel_join':
      sendResponse(channel, `Welkome to the promised land <@${user.id}>!`);
      break;
    case 'channel_leave':
      sendResponse(channel, `Bye bye <@${user.id}>!`);
      break;
  }
}

/**
 * Responds to actual messages in channel
 * @param {Message} message
 * @param {Channel} channel
 * @param {User} user
 */
function realMessage(message, channel, user) {
  if (shouldComplain(message)) {
    sendResponse(channel, _.sample(responses)(`<@${user.id}>`));
  } else if (message.text.match(/praise koffee/ig)) {
    sendResponse(channel, '༼ つ ◕_◕ ༽つ ☕️');
  }
}

// Let's get it on!

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
  console.log(`Connected to ${rtmStartData.team.name} as ${rtmStartData.self.name}`);
});

rtm.on(RTM_EVENTS.MESSAGE, (message) => {
  const channel = rtm.dataStore.getChannelGroupOrDMById(message.channel);
  const user = rtm.dataStore.getUserById(message.user);
  if (!user) return;

  console.log(`Received: <@${user.name}> ${message.text}`);

  // Only respond in the specified channel or to individual users
  if (channel.name === slackChannel || channel.is_channel !== 'true') {
    if (message.subtype) {
      subtypeRespond(message, channel, user);
    } else {
      realMessage(message, channel, user);
    }
  }
});

rtm.start();
