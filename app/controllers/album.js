'use strict';

const logger = require('../logger'),
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
  requests
    .getAlbums()
    .then(response => {
      const albumId = parseInt(req.params.id);
      if (!albumId) next(errors.albumNotFound('Missing album ID.'));
      const album = response.find(element => {
        return element.id === albumId;
      });
      if (album) {
        UserAlbum.createModel(req.user.id, albumId)
          .then(UAPair => {
            logger.info(`User #${req.user.id} bought album #${albumId}`);
            res.status(201).end();
          })
          .catch(err => next(errors.invalidUser('User cannot purchase the same album twice.')));
      } else {
        next(errors.albumNotFound('Requested album does not exist or is not available.'));
      }
    })
    .catch(next);
};
