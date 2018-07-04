const tokenValidation = require('./middlewares/session'),
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
  app.post('/albums/:id', [tokenValidation.validateToken], albumFunctions.purchaseAlbum);
  app.get('/users/:user_id/albums', [tokenValidation.validateToken], albumFunctions.userAlbums);
  app.get('/users/albums/:id/photos', [tokenValidation.validateToken], albumFunctions.getPhotos);
  app.post('/users/sessions/invalidate_all', [tokenValidation.validateToken], userFunctions.invalidateAll);
};
