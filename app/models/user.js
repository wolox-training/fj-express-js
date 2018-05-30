'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'users',
    {
      ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true
      },
      firstName: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      lastName: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    {}
  );
  User.associate = models => {
    // associations can be defined here
  };
  return User;
};
