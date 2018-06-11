'use strict';

const logger = require('../logger'),
  validation = require('./validation'),
  bcrypt = require('bcryptjs'),
  errors = require('../errors'),
  User = require('../models').Users,
  saltRounds = 10;

// Returns all users as object array, for testing purposes.
exports.returnUsers = (req, res, next) => {
  User.getAll().then(
    succ => {
      res.send(succ);
    },
    fail => {
      next(errors.defaultError(fail));
    }
  );
};

exports.newUser = (req, res, next) => {
  const newUser = req.body
    ? {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        email: req.body.email
      }
    : {};

  const valMsgs = validation.validateUser(newUser);
  if (valMsgs.length > 0) {
    next(errors.defaultError(valMsgs));
  } else {
    bcrypt
      .hash(newUser.password, saltRounds)
      .then(hash => {
        newUser.password = hash;

        User.createNewUser(newUser)
          .then(user => {
            res.send(`Successfully logged in. Welcome, ${user.firstName} ${user.lastName}!`);
          })
          .catch(err => {
            next(err);
          });
      })
      .catch(err => {
        next(errors.defaultError(err));
      });
  }
};
