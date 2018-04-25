'use strict';

const HttpStatus = require('http-status-codes');

/**
 * Get welcome message
 * @param {Object} req express request
 * @param {Object} res express response
 */
async function getWelcomeMessage(req, res) {
  const { name, id } = req.params;
  return res.status(HttpStatus.OK).send({ message: `Welcome ${name} (id: ${id})!`});
}

module.exports = {
  getWelcomeMessage
};
