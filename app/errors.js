const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.INVALID_USER = 'invalid_user';
exports.invalidUser = message => internalError(message, exports.INVALID_USER);

exports.BOOK_NOT_FOUND = 'book_not_found';
exports.bookNotFound = message => internalError(message, exports.BOOK_NOT_FOUND);

exports.SAVING_ERROR = 'saving_error';
exports.savingError = message => internalError(message, exports.SAVING_ERROR);

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);
