'use strict';

const logger = require('../logger'),
  User = require('../models').user,
  Album = require('../models').album,
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

exports.userAlbums = (req, res, next) => {
  const userId = parseInt(req.params.user_id);
  if (req.user.isAdmin || req.user.id === userId) {
    User.getOneWhere(null, { id: userId })
      .then(user => {
        if (user) {
          user
            .getAlbums()
            .then(albums => {
              res.send(albums);
            })
            .catch(err => next(errors.databaseError(err.message)));
        } else {
          next(errors.invalidUser(`User with id ${userId} does not exist`));
        }
      })
      .catch(next);
  } else {
    next(errors.invalidUser('User does not have access to other users catalogs'));
  }
};
