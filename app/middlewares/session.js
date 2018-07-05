const tokens = require('../services/tokenSessions'),
  User = require('../models').user,
  logger = require('../logger'),
  errors = require('../errors');

exports.validateToken = (req, res, next) => {
  const token = req.headers[tokens.headerName];
  if (token) {
    try {
      const payload = tokens.decode(token);
      User.findOne({ where: { email: payload.email } })
        .then(dbUser => {
          if (dbUser) {
            const logout = Math.round(Date.parse(dbUser.logoutDate) / 1000);
            if (payload.iat >= logout) {
              req.user = dbUser;
              next();
            } else {
              next(errors.invalidToken('Invalid token.'));
            }
          } else {
            next(errors.invalidToken('Invalid token.'));
          }
        })
        .catch(next);
    } catch (err) {
      next(errors.invalidToken(err.message));
    }
  } else {
    next(errors.invalidToken('Missing token.'));
  }
};

exports.validateAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    next(errors.invalidUser('User does not have access to this resource.'));
  } else {
    next();
  }
};
