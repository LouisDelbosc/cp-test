'use strict';

const { Router } = require('express');

const helloRouter = require('./hello');

module.exports = function addRouter(app) {
  const router = Router();
  router.use('/hello', helloRouter);
  app.use('/api', router);
};
