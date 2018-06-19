'use strict';

const errors = require('../errors');

const emptyValidation = field => `The ${field} field cannot be empty. Please try again.`;

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('Users', {
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
    }
  });

  User.createModel = user =>
    User.create(user).catch(err => {
      throw errors.databaseError(err.message);
    });

  User.getAll = user =>
    User.findAll().catch(err => {
      throw errors.databaseError(err.message);
    });

  User.getAllWhere = options => User.findAll({ where: options });

  User.getOneWhere = (attributes, where) =>
    User.findOne({
      attributes,
      where
    }).catch(err => {
      throw errors.databaseError(err.message);
    });

  return User;
};
