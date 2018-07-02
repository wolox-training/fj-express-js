const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.INVALID_USER = 'invalid_user';
exports.invalidUser = message => internalError(message, exports.INVALID_USER);

exports.ALBUM_NOT_FOUND = 'album_not_found';
exports.albumNotFound = message => internalError(message, exports.ALBUM_NOT_FOUND);

exports.SAVING_ERROR = 'saving_error';
exports.savingError = message => internalError(message, exports.SAVING_ERROR);

exports.INVALID_TOKEN = 'invalid_token';
exports.invalidToken = message => internalError(message, exports.INVALID_TOKEN);

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.FETCH_ERROR = 'fetch_error';
exports.fetchError = message => internalError(message, exports.FETCH_ERROR);
