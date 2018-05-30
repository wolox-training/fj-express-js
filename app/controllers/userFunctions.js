'use strict';

const logger = require('../logger');

exports.createUser = (req, res, next) => {
    const user = req.body
    ? {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        email: req.body.email
      }
    : {};
  logger.info('*************************');
  logger.info(user.firstName);
  logger.info(user.lastName);
  logger.info(user.password);
  logger.info(user.email);
  logger.info('*************************');
  res.send('Hello World!');
};
