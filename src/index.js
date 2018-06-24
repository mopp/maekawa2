'use strict';

require('dotenv').config();

const { RTMClient, WebClient } = require('@slack/client');

const token = process.env.SLACK_TOKEN;

const web = new WebClient(token);
const rtm = new RTMClient(token);

rtm.on('message', message => {
  // Skip messages that are from a bot or my own user ID or not mentioned to me.
  if (
    !message ||
    !message.text ||
    (message.subtype && message.subtype === 'bot_message') ||
    (!message.subtype && message.user === rtm.activeUserId) ||
    !message.text.includes(`<@${rtm.activeUserId}>`)
  ) {
    return;
  }

  const userId = message.user;

  web.users
    .info({ user: userId })
    .then(res => {
      rtm
        .sendMessage(`みくだにゃ`, message.channel)
        .then(res => {
          console.log('Message sent: ', res.ts);
        })
        .catch(console.error);
    })
    .catch(console.error);
});

rtm.start();

// to avoid crashing on heroku, run a dummy server
if (process.env.PORT) {
  const http = require('http');
  http
    .createServer((req, res) => {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end('みくだにゃ\n');
    })
    .listen(process.env.PORT);
}
