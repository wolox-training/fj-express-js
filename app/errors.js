const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.SAVING_ERROR = 'saving_error';
exports.savingError = message => internalError(message, exports.SAVING_ERROR);
