const jwt = require('jwt-simple'),
  config = require('./../../config');

const secret = config.common.session.secret;
exports.headerName = config.common.session.header_name;

exports.encode = payload => jwt.encode(payload, secret);

exports.decode = token => jwt.decode(token, secret);