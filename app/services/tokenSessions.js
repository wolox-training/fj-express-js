const jwt = require('jwt-simple'),
  config = require('./../../config');

const secret = config.common.session.secret;
exports.headerName = config.common.session.header_name;
const time = config.common.expiration;

exports.encode = payload => {
  payload.iat = Math.round(Date.now() / 1000);
  payload.exp = Math.round(Date.now() / 1000 + time * 60);
  return jwt.encode(payload, secret);
};

exports.decode = token => jwt.decode(token, secret);
