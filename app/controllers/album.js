'use strict';

const logger = require('../logger'),
  Album = require('../models').album,
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

exports.purchaseAlbum = (req, res, next) => {
  rp({
    uri: 'https://jsonplaceholder.typicode.com/albums',
    json: true
  })
    .then(response => {
      const albumId = Number(req.params.id);
      if (!albumId) next(errors.albumNotFound('Missing album ID.'));
      const album = response.find(element => {
        return element.id === albumId;
      });
      if (album) {
        Album.FOCAlbum({
          id: album.id,
          artistId: album.userId,
          title: album.title
        })
          .spread((dbAlbum, created) => {
            console.log(Object.keys(dbAlbum));
            res.send(created);
          })
          .catch(next);
      } else {
        next(errors.albumNotFound('Requested album does not exist or is not available.'));
      }
    })
    .catch(err => next(errors.fetchError(err.message)));
};
