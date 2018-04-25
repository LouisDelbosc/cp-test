'use strict';

const express = require('express');
const wrap = require('co-express');

const controller = require('./hello.controller');

const router = express.Router();

/**
 * @api {get} /hello/:name/:id get welcome message
 * @apiGroup Hello
 *
 * @apiDescription get welcome message
 *
 * @apiParam {String} name the name of a user
 * @apiParam {String} id some identifier
 *
 * @apiSuccess {String} welcome message
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    message: 'Welcome Robert (id: 32)!'
 *  }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL_SERVER_ERROR
 *     {
 *       message: 'Invalid request'
 *     }
 *
 */
router.get('/:name/:id', wrap(controller.getWelcomeMessage));

module.exports = router;
