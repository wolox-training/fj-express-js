// const controller = require('./controllers/controller');
const logger = require('./logger'),
  userFunctions = require('./controllers/user_controllers');

exports.init = app => {
  // app.get('/endpoint/get/path', [], controller.methodGET);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  // app.post('/endpoint/post/path', [], controller.methodPOST);
  app.post('/users', [], userFunctions.newUser);
  app.get('/', [], userFunctions.returnUsers);
};
