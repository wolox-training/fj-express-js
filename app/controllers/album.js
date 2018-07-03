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
    .then(album => {
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

exports.userAlbums = (req, res, next) => {
  const userId = parseInt(req.params.user_id);
  if (req.user.isAdmin || req.user.id === userId) {
    User.getOneWhere(null, { id: userId })
      .then(user => {
        if (user) {
          UserAlbum.getAlbums(user.id)
            .then(albums => {
              const albumArray = [];
              albums.forEach(element =>
                requests
                  .getAlbum(`/${element.albumId}`)
                  .then(albumData => {
                    albumArray.push(albumData);
                  })
                  .catch(next)
              );
              res.send(albumArray);
            })
            .catch(next);
        } else {
          next(errors.invalidUser(`User with id ${userId} does not exist`));
        }
      })
      .catch(next);
  } else {
    next(errors.invalidUser('User does not have access to other users catalogs'));
  }
};
