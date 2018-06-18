const tokens = require('../services/tokenSessions'),
  logger = require('../logger'),
  errors = require('./errors');

exports.validateToken = (req, res, next) => {
  if (req.Headers[tokens.headerName] === undefined || !req.Headers[tokens.headerName]) {
    next(errors.invalidToken('Error: Invalid header.'));
  } else {
    const token = req.Headers[tokens.headerName];
    if (token === undefined || !token) {
      next(errors.invalidToken('Error: No token found.'));
    } else {
      const payload = tokens.decode(token);
      res.send(payload);
    }
  }
};
