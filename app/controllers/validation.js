const validator = require('validator');

exports.validateUser = user => {
  const errorMsgs = [];
  if (!user.firstName || user.firstName.length <= 0) {
    errorMsgs.push('First name cannot be empty.');
  }
  if (!user.lastName || user.lastName.length <= 0) {
    errorMsgs.push('Last name cannot be empty.');
  }
  if (user.email.slice(-13) !== '@wolox.com.ar' || !validator.isEmail(user.email)) {
    errorMsgs.push('Email is not a valid email and/or not in the @wolox.com.ar domain.');
  }
  if (!user.email || user.email.length <= 0) {
    errorMsgs.push('Email cannot be empty.');
  }
  if (!validator.isAlphanumeric(user.password) || user.password.lenght < 8) {
    errorMsgs.push('Invalid password. Must be 8 alphanumeric characters or longer.');
  }
  return errorMsgs;
};
