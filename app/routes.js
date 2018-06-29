const logger = require('./logger'),
  tokenValidation = require('./middlewares/session'),
  userFunctions = require('./controllers/user'),
  albumFunctions = require('./controllers/album');

exports.init = app => {
  app.post('/users', userFunctions.newUser);
  app.get('/users', [tokenValidation.validateToken], userFunctions.listUsers);
  app.post(
    '/admin/users',
    [tokenValidation.validateToken, tokenValidation.validateAdmin],
    userFunctions.newAdmin
  );
  app.post('/users/sessions', userFunctions.signIn);
  app.get('/albums', [tokenValidation.validateToken], albumFunctions.getAlbums);
};
