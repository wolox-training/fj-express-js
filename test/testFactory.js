const factory = require('factory-girl').factory,
  User = require('../app/models').Users;

factory.define('user', User, {
  firstName: factory.seq('User.firstName', n => `firstName${n}`),
  lastName: factory.seq('User.lastName', n => `lastName${n}`),
  email: factory.seq('User.email', n => `firstLast${n}@wolox.com.ar`),
  password: 'password'
});

exports.factory = factory;
