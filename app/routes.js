const logger = require('./logger'),
  userFunctions = require('./controllers/user');

exports.init = app => {
  app.post('/users', [], userFunctions.newUser);
  app.post('/users/sessions', [], userFunctions.signIn);
};
