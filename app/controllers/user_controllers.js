'use strict';

const logger = require('../logger'),
  User = require('../models').Users;

// Returns all users as object array, for testing purposes.
exports.returnUsers = (req, res, next) => {
  User.getAll().then(
    x => {
      res.send(x);
    },
    y => {}
  );
};

/* Creates a new user based on the information sent through a POST req.
   Returns a welcome message if successful, corresponding error message if not. */
exports.buildUser = (req, res, next) => {
  const newUser = req.body
    ? {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        email: req.body.email
      }
    : {};
  User.create(newUser).then(
    result => {
      res.send(`Successfully logged in. Welcome, ${result.firstName} ${result.lastName}!`);
    },
    e => {
      let errorMessage = '';
      e.errors.forEach(error => {
        logger.info(error.message);
      });
      res.send(errorMessage);
    }
  );
};
