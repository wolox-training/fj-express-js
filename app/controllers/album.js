'use strict';

const logger = require('../logger'),
  validation = require('./validation'),
  tokens = require('./../services/tokenSessions'),
  bcrypt = require('bcryptjs'),
  errors = require('../errors'),
  rp = require('request-promise');

exports.getAlbums = (req, res, next) => {
  logger.info('GET Albums');
  rp({
    uri: 'https://jsonplaceholder.typicode.com/albums',
    json: true
  })
    .then(response => {
      res.send(response);
    })
    .catch(err => next(errors.fetchError(err.message)));
};
