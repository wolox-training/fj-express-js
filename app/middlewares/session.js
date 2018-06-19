const tokens = require('../services/tokenSessions'),
  User = require('../models').Users,
  logger = require('../logger'),
  errors = require('../errors');

exports.validateToken = (req, res, next) => {
  const token = req.headers[tokens.headerName];
  if (token) {
    const payload = tokens.decode(token);
    User.findOne({ where: payload }).then(dbUser => {
      if (dbUser) {
        req.user = dbUser;
        next();
      } else {
        res.status(401);
        res.end();
        // next(errors.invalidToken('Invalid token.'));
      }
    });
  } else {
    res.status(401);
    res.end();
    // next(errors.invalidToken('Missing token.'));
  }
};
