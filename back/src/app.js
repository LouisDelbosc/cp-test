const http = require('http');
const co = require('co');
const express = require('express');
const mongoose = require('mongoose');
const amqplib = require('amqplib');

const { configure } = require('./config/express');
const { mongodb, amqp } = require('./config/index.js');

const {
  completeRide,
  createRide,
  signup,
  updatePhone
} = require('./rider/controller.js');

let app;
let server;

async function initQueue(channel, exchange, name, key, cb) {
  await channel.assertQueue(name);
  channel.bindQueue(name, exchange, key);
  channel.consume(name, msg => {
    const { payload } = JSON.parse(msg.content.toString());
    console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
    cb(payload);
  });
}

async function initConsumer(amqpUrl, exchange) {
  const open = await amqplib.connect(amqpUrl);
  const channel = await open.createChannel();
  await channel.assertExchange(exchange, 'topic', {
    durable: true
  });

  initQueue(channel, exchange, 'signup', 'rider.signup', signup);
  initQueue(channel, exchange, 'create', 'rider.create', createRide);
  initQueue(channel, exchange, 'complete', 'rider.completed', completeRide);
  initQueue(
    channel,
    exchange,
    'update_phone',
    'rider.update_phone',
    updatePhone
  );
}

/**
 * Start the web app.
 *
 * @returns {Promise} when app end to start
 */
async function start() {
  if (app) {
    return app;
  }
  app = configure(express());

  mongoose.connect(mongodb.url);
  mongoose.connection.on('error', error => {
    console.warn('Error', error);
  });

  initConsumer(amqp.url, amqp.exchange);

  const port = app.get('port');
  server = http.createServer(app);
  await server.listen(port);
  // eslint-disable-next-line no-console
  console.log(`✔ Server running on port ${port}`);
  return app;
}

/**
 * Stop the web app.
 *
 * @returns {Promise} when app end to start
 */
async function stop() {
  if (server) {
    await server.close();
    server = null;
    app = null;
  }
  if (mongoose.connection) {
    mongoose.disconnect();
  }
  return Promise.resolve();
}

if (!module.parent) {
  co(start);
}

module.exports = {
  start,
  stop,
  get server() {
    return server;
  },
  get app() {
    return app;
  }
};
