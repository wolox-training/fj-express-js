'use strict';

const errors = require('../errors');

module.exports = (sequelize, DataTypes) => {
  const Album = sequelize.define('album', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    artistId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Album.associate = models => {
    Album.belongsToMany(models.user, { through: 'UserAlbum' });
  };

  Album.FOCAlbum = where =>
    Album.findOrCreate({ where }).catch(err => {
      throw errors.databaseError(err.message);
    });

  return Album;
};
