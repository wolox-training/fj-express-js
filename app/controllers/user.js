'use strict';

const logger = require('../logger'),
  validation = require('./validation'),
  tokens = require('./../services/tokenSessions'),
  bcrypt = require('bcryptjs'),
  errors = require('../errors'),
  User = require('../models').Users,
  saltRounds = 10;

exports.newUser = (req, res, next) => {
  const newUser = req.body
    ? {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        email: req.body.email
      }
    : {};

  const errMsg = validation.validateUser(newUser);
  if (errMsg.length > 0) {
    next(errors.invalidUser(errMsg));
  } else {
    return bcrypt
      .hash(newUser.password, saltRounds)
      .then(hash => {
        newUser.password = hash;
        return User.createModel(newUser).then(user => {
          res.statusMessage = `Successfully created new user. Welcome, ${newUser.firstName} ${
            newUser.lastName
          }!`;
          res.status(201).end();
        });
      })
      .catch(err => {
        next(errors.savingError(err.message));
      });
  }
};

exports.signIn = (req, res, next) => {
  const credentials = req.body
    ? {
        password: req.body.password,
        email: req.body.email
      }
    : {};

  const errMsg = validation.validateSignIn(credentials);
  if (errMsg.length > 0) {
    next(errors.invalidUser(errMsg));
  } else {
    return User.getOneWhere(['email', 'password'], { email: credentials.email })
      .then(user => {
        if (user) {
          return bcrypt.compare(credentials.password, user.password).then(bool => {
            if (bool) {
              const auth = tokens.encode({ email: user.email });
              res.status(200);
              res.set(tokens.headerName, auth);
              res.send('Token received successfully!');
            } else {
              next(errors.invalidUser('The email/password combination you entered is invalid.'));
            }
          });
        } else {
          next(errors.invalidUser('There is no user registered with that email.'));
        }
      })
      .catch(err => {
        next(errors.databaseError(err.message));
      });
  }
};
