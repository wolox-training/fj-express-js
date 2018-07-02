'use strict';

const errors = require('../errors');

module.exports = (sequelize, DataTypes) => {
  const UserAlbum = sequelize.define('useralbum', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'compositeIndex'
    },
    albumId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'compositeIndex'
    }
  });

  UserAlbum.createModel = (userId, albumId) =>
    UserAlbum.create({ userId, albumId }).catch(err => {
      throw errors.savingError(err.message);
    });

  return UserAlbum;
};
