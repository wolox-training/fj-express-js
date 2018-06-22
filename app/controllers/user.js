'use strict';

const logger = require('../logger'),
  validation = require('./validation'),
  tokens = require('./../services/tokenSessions'),
  bcrypt = require('bcryptjs'),
  errors = require('../errors'),
  User = require('../models').Users,
  saltRounds = 10;

const newUserObject = body => {
  const newUser = body
    ? {
        firstName: body.firstName,
        lastName: body.lastName,
        password: body.password,
        email: body.email
      }
    : {};
  const errMsg = validation.validateUser(newUser);
  if (errMsg.length > 0) {
    throw errors.invalidUser(errMsg);
  } else {
    return bcrypt.hash(newUser.password, saltRounds).then(hash => {
      newUser.password = hash;
      return newUser;
    });
  }
};

exports.newUser = (req, res, next) =>
  newUserObject(req.body)
    .then(user => {
      return User.createModel(user)
        .then(newUser => {
          logger.info(`Successfully created new user. Welcome, ${newUser.firstName} ${newUser.lastName}!`);
          res.status(201).end();
        })
        .catch(err => {
          next(errors.savingError(err.message));
        });
    })
    .catch(next);

exports.newAdmin = (req, res, next) =>
  newUserObject(req.body)
    .then(admin => {
      return User.findOne({ where: { email: admin.email } })
        .then(result => {
          if (result) {
            result.isAdmin = true;
            result.save().then(oldAdmin => {
              logger.info(`Successfully granted admin status to user.`);
              res.status(201).end();
            });
          } else {
            admin.isAdmin = true;
            User.createModel(admin).then(newAdmin => {
              logger.info(`Successfully created new admin.`);
              res.status(201).end();
            });
          }
        })
        .catch(err => {
          next(errors.databaseError(err.message));
        });
    })
    .catch(next);

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
  const lim = req.query.limit || 5;
  const page = req.query.page * lim || 0;
  return User.getAllNoPassword(page, lim).then(userList => {
    res.send(userList);
  });
};
