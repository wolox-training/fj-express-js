const tokens = require('../services/tokenSessions'),
  User = require('../models').Users,
  logger = require('../logger'),
  errors = require('../errors');

exports.validateToken = (req, res, next) => {
  const token = req.headers[tokens.headerName];
  if (token) {
    const payload = tokens.decode(token);
    User.findOne({ where: { email: payload.email } }).then(dbUser => {
      if (dbUser) {
        req.user = dbUser;
        next();
      } else {
        next(errors.invalidToken('Invalid token.'));
      }
    });
  } else {
    next(errors.invalidToken('Missing token.'));
  }
};
