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
      allowNull: false,
      validate: {
        isAlphanumeric: {
          msg:
            'The password can only be comprised of alphanumeric characters, please pick a different password.'
        },
        len: {
          args: [8],
          msg: 'The password must be at least 8 characters long, please pick a different password.'
        },
        notEmpty: {
          msg: emptyValidation('Password')
        }
      }
    }
  });

  User.createModel = user =>
    User.create(user).catch(err => {
      throw errors.savingError(err.errors);
    });

  User.getAll = () => User.findAll().then(array => array);

  User.getAllWhere = options => User.findAll({ where: options });

  return User;
};
