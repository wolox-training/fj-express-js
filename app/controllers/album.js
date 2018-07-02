'use strict';

const logger = require('../logger'),
  User = require('../models').user,
  UserAlbum = require('../models').useralbum,
  errors = require('../errors'),
  requests = require('../services/albums');

exports.getAlbums = (req, res, next) => {
  requests
    .getAlbums()
    .then(response => {
      res.send(response);
    })
    .catch(next);
};

exports.purchaseAlbum = (req, res, next) => {
  const albumId = parseInt(req.params.id);
  if (!albumId) next(errors.albumNotFound('Missing album ID.'));
  requests
    .getAlbum(`/${albumId}`)
    .then(response => {
      const album = response;
      if (album) {
        UserAlbum.createModel(req.user.id, albumId)
          .then(() => {
            logger.info(`User #${req.user.id} bought album #${albumId}`);
            res.status(201).end();
          })
          .catch(next);
      } else {
        next(errors.albumNotFound('Requested album does not exist or is not available.'));
      }
    })
    .catch(next);
};
