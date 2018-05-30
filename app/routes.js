// const controller = require('./controllers/controller');
const logger = require('./logger'),
  userFunctions = require('./controllers/userFunctions');

exports.init = app => {
  // app.get('/endpoint/get/path', [], controller.methodGET);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  // app.post('/endpoint/post/path', [], controller.methodPOST);
  app.post('/users', [], userFunctions.createUser);
  app.get('/', function(req, res) {
    res.send('Get function to homepage.');
  });
};
