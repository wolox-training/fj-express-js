const logger = require('./logger'),
  userFunctions = require('./controllers/user_controllers');

exports.init = app => {
  app.post('/users', [], userFunctions.newUser);
  app.get('/', [], userFunctions.returnUsers);
};
