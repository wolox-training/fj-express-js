'use strict';

const logger = require('../logger'),
  Album = require('../models').album,
  errors = require('../errors'),
  rp = require('request-promise');

const pingAlbums = () => {
  return rp({
    uri: 'https://jsonplaceholder.typicode.com/albums',
    json: true
  })
    .then(response => {
      return response;
    })
    .catch(err => {
      throw errors.fetchError(err.message);
    });
};

exports.getAlbums = (req, res, next) => {
  pingAlbums()
    .then(response => {
      res.send(response);
    })
    .catch(next);
};

exports.purchaseAlbum = (req, res, next) => {
  pingAlbums()
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
            dbAlbum.getUsers({ where: { email: req.user.email } }).then(owner => {
              if (owner.length) {
                next(errors.invalidUser('User has already purchased this album.'));
              } else {
                dbAlbum.addUser(req.user);
                logger.info(
                  `User ${req.user.firstName} ${req.user.lastName} has successfully purchased album #${
                    album.id
                  }`
                );
                res.status(201).end();
              }
            });
          })
          .catch(next);
      } else {
        next(errors.albumNotFound('Requested album does not exist or is not available.'));
      }
    })
    .catch(next);
};
