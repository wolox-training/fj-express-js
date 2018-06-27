/* 'use strict';

const logger = require('../logger'),
  validation = require('./validation'),
  tokens = require('./../services/tokenSessions'),
  bcrypt = require('bcryptjs'),
  errors = require('../errors'),
  fetch = require('node-fetch');

exports.getAlbums = (req, res, next) => {
  logger.info('GET Albums');
  fetch('https://jsonplaceholder.typicode.com/albums')
    .then(response => response.json())
    .then(json => console.log(json));
  res.status(201).end();
}; */
