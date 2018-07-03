'use strict';

const errors = require('../errors'),
  Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const UserAlbum = sequelize.define('useralbum', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    albumId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  UserAlbum.createModel = (userId, albumId) =>
    UserAlbum.create({ userId, albumId }).catch(err => {
      if (err instanceof Sequelize.UniqueConstraintError) {
        throw errors.invalidUser('User cannot purchase album twice.');
      } else {
        throw errors.savingError(err.message);
      }
    });

  UserAlbum.getAlbums = userId =>
    UserAlbum.findOne({ attributes: ['albumId'], where: { userId } }).catch(err => {
      throw errors.databaseError(err.message);
    });

  return UserAlbum;
};
