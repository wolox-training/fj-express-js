'use strict';

const errors = require('../errors');

const emptyValidation = field => `The ${field} field cannot be empty. Please try again.`;

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: emptyValidation('First Name')
      },
      notEmpty: {
        msg: emptyValidation('First Name')
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: emptyValidation('Last Name')
      },
      notEmpty: {
        msg: emptyValidation('Last Name')
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: emptyValidation('Email')
      },
      notEmpty: {
        msg: emptyValidation('Email')
      },
      unique: {
        msg: `This email is already registered. The user's email must be unique.`
      },
      validate: {
        isEmail: {
          msg: 'The email you entered does not have a valid format, please try again.'
        },
        contains: {
          args: '@wolox.com.ar',
          msg: `The user's email must belong to the "@wolox.com.ar" domain.`
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    logoutDate: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  });

  User.createModel = user =>
    User.create(user).catch(err => {
      throw errors.savingError(err.message);
    });

  User.getAll = user =>
    User.findAll().catch(err => {
      throw errors.databaseError(err.message);
    });

  User.getAllWhere = where =>
    User.findAll({ where }).catch(err => {
      throw errors.databaseError(err.message);
    });

  User.getOneWhere = (attributes, where) =>
    User.findOne({
      attributes,
      where
    }).catch(err => {
      throw errors.databaseError(err.message);
    });

  User.getAllNoPassword = (offset, limit) =>
    User.findAndCountAll({
      attributes: ['firstName', 'lastName', 'email'],
      offset,
      limit,
      order: [['email', 'ASC']]
    }).catch(err => {
      throw errors.databaseError(err.message);
    });

  User.upsertUser = object =>
    User.upsert(object).catch(err => {
      throw errors.savingError(err.message);
    });

  User.logout = id =>
    User.update({ logoutDate: sequelize.NOW }, { where: { id } }).catch(err => {
      throw errors.savingError(err.message);
    });

  return User;
};
