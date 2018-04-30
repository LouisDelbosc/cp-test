const http = require('http');
const co = require('co');
const express = require('express');
const mongoose = require('mongoose');

const { configure } = require('./config/express');
const { mongodb } = require('./config/index.js');

let app;
let server;

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
  if (mongoose.connection) mongoose.disconnect();
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
