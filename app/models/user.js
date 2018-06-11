'use strict';

const logger = require('../logger'),
  bcrypt = require('bcryptjs'),
  errors = require('../errors');

// User Model, including validation and corresponding error messages.
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('Users', {
    firstName: {
      type: DataTypes.TEXT,
      allowNull: {
        args: false,
        msg: 'The first name field cannot be empty, please try again.'
      },
      notEmpty: {
        msg: 'The first name field cannot be empty, please try again.'
      }
    },
    lastName: {
      type: DataTypes.TEXT,
      allowNull: {
        args: false,
        msg: 'The last name field cannot be empty, please try again.'
      },
      notEmpty: {
        msg: 'The last name field cannot be empty, please try again.'
      }
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: {
        args: false,
        msg: 'The email field cannot be empty, please try again.'
      },
      notEmpty: {
        msg: 'The email field cannot be empty, please try again.'
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
      type: DataTypes.TEXT,
      allowNull: false
    }
  });

  User.associate = models => {
    // associations can be defined here
  };

  // Creates a new user model and adds to database. Returns promise.
  User.createNewUser = user => {
    return User.create(user).catch(err => {
      throw errors.savingError(err.message);
    });
  };

  // Returns an array of all users.
  User.getAll = user => {
    return User.findAll().then(array => array);
  };

  User.getAllWhere = options => {
    return User.findAll({
      where: options
    });
  };

  return User;
};
