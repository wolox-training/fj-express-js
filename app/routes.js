const logger = require('./logger'),
  tokenValidation = require('./middlewares/session'),
  userFunctions = require('./controllers/user');

exports.init = app => {
  app.post('/users', userFunctions.newUser);
  app.get('/users', [tokenValidation.validateToken], userFunctions.listUsers);
  app.post('/admin/users', [tokenValidation.validateToken], userFunctions.listUsers);
  app.post('/users/sessions', userFunctions.signIn);
};
