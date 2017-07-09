'use strict';

require('dotenv').config();
const _ = require('lodash');
const Slack = require('slack-client');
const responses = require('./responses.js');
const whitelist = require('./whitelist.js');

const slackToken = process.env.SLACK_TOKEN;
const slackChannel = process.env.SLACK_CHANNEL;
const autoReconnect = true;
const autoMark = true;

let slack = new Slack(slackToken, autoReconnect, autoMark);

/**
 * Sends a response to slack
 * @param {String} channel
 * @param {String} message
 */
function sendResponse(channel, message) {
  console.log('Response: ' + message);
  channel.send(message);
}

/**
 * Returns whether or not the bot should complain
 * @param {String} text
 * @return {Boolean} true if the bot should complain
 */
function shouldComplain(message) {
  // Replace all ok text from the whitelist with nothing and then check
  let filtered_text = _.reduce(whitelist, function(res, ok_text) {
    return res.replace(ok_text, '');
  }, message.text);
  //console.log('Post whitelist: ' + filtered_text);
  return /c/ig.test(filtered_text);
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
    sendResponse(channel, 'Welkome to the promised land <@' + user.id + '>!');
    break;
  case 'channel_leave':
    sendResponse(channel, 'Bye bye <@' + user.id + '>!');
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
    sendResponse(channel, _.sample(responses)('<@' + user.id + '>'));
  } else if (message.text.match(/praise koffee/ig)) {
    sendResponse(channel, '༼ つ ◕_◕ ༽つ ☕️');
  }
}

// Let's get it on!

slack.on('open', function() {
  console.log('Connected to ' + slack.team.name + ' as ' + slack.self.name);
});

slack.on('message', function(message) {
  console.log('Received: ' + message);

  let channel = slack.getChannelGroupOrDMByID(message.channel);
  let user = slack.getUserByID(message.user);
  if (!user) return;

  // Only respond in the specified channel or to individual users
  if (channel.name === slackChannel || channel.is_channel !== 'true') {
    if (message.subtype) {
      subtypeRespond(message, channel, user);
    } else {
      realMessage(message, channel, user);
    }
  }
});

slack.on('error', function(err) {
  console.error('Error', err);
});

slack.login();
