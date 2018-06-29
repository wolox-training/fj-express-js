'use strict';

const logger = require('../logger'),
  requests = require('../services/albums'),
  errors = require('../errors'),
  rp = require('request-promise');

exports.getAlbums = (req, res, next) => {
  requests
    .getAlbums()
    .then(response => {
      res.send(response);
    })
    .catch(err => next(errors.fetchError(err.message)));
};
