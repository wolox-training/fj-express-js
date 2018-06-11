'use strict';

const logger = require('../logger'),
  bcrypt = require('bcryptjs'),
  validator = require('validator'),
  errors = require('../errors'),
  User = require('../models').Users;

const validateUser = user => {
  let errorMsg = '';
  // Name validation (Not null or empty)
  if (!user.firstName || user.firstName.length <= 0) {
    // First name error
    errorMsg += 'First name cannot be empty.\n';
  }
  if (!user.lastName || user.lastName.length <= 0) {
    // Last name error
    errorMsg += 'Last name cannot be empty.\n';
  }
  // Email validation (Belongs to wolox domain AND is valid email format)
  if (user.email.slice(-13) !== '@wolox.com.ar' || !validator.isEmail(user.email)) {
    // Invalid email error
    errorMsg += 'Email is not a valid email and/or not in the @wolox.com.ar domain.\n';
  }
    if (!user.email || user.email.length <= 0) {
    // Email must be given
    errorMsg += 'Email cannot be empty.\n';
  }
  // Password validation
  if (!validator.isAlphanumeric(user.password) || user.password.lenght <= 7) {
    // Invalid password
    errorMsg += 'Invalid password. Must be 8 alphanumeric characters or longer.\n';
  }
  return errorMsg;
};

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
        password: req.body.password, // bcrypt.hash(req.body.password),
        email: req.body.email
      }
    : {};

  let valMsg = validateUser(newUser);
  if (valMsg.length > 0) {
    valMsg = valMsg.slice(0, -1);
    res.send(valMsg);
  }

  User.create(newUser).then(
    result => {
      res.send(`Successfully logged in. Welcome, ${result.firstName} ${result.lastName}!`);
    },
    e => {
      let errorMessage = '';
      e.errors.forEach(error => {
        logger.info(error.message);
        errorMessage += `* ${error.message}\n`;
      });
      res.send(errorMessage);
    }
  );
};

exports.newUser = (req, res, next) => {
  const newUser = req.body
    ? {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: bcrypt.hash(req.body.password),
        email: req.body.email
      }
    : {};

  validateUser(newUser, req, res, next);

  bcrypt
    .hash(newUser.password)
    .then(hash => {
      newUser.password = hash;

      User.createNewUser(newUser)
        .then(u => {
          res.status(200);
          res.end();
        })
        .catch(err => {
          next(err);
        });
    })
    .catch(err => {
      next(errors.defaultError(err));
    });
};
