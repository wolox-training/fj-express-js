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
          logger.info(`Successfully created new user. Welcome, ${newUser.firstName} ${newUser.lastName}!`);
          res.status(201).end();
        });
      })
      .catch(err => {
        next(errors.savingError(err.message));
      });
  }
};

exports.newAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    next(errors.invalidUser('User does not have access to this resource.'));
  }
  const admin = req.body
    ? {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        email: req.body.email
      }
    : {};

  const errMsg = validation.validateUser(admin);
  if (errMsg.length > 0) {
    next(errors.invalidUser(errMsg));
  } else {
    return bcrypt
      .hash(admin.password, saltRounds)
      .then(hash => {
        admin.password = hash;
        return User.findOrCreate(admin).then(user => {
          logger.info(`Successfully created new admin. Welcome, ${admin.firstName} ${admin.lastName}!`);
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
      .then(dbUser => {
        if (dbUser) {
          return bcrypt.compare(credentials.password, dbUser.password).then(validPass => {
            if (validPass) {
              const auth = tokens.encode({ email: dbUser.email });
              res.status(200);
              res.set(tokens.headerName, auth);
              res.end();
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

exports.listUsers = (req, res, next) => {
  // TODO
  const lim = req.query.limit || 5;
  const page = req.query.page || 0;
  User.findAndCountAll({
    attributes: ['firstName', 'lastName', 'email'],
    offset: 10 * page,
    limit: lim
  }).then(userList => {
    res.send(userList.rows);
  });
};
