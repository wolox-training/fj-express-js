const factory = require('factory-girl').factory,
  bcrypt = require('bcryptjs'),
  User = require('../app/models').user;

const hashed = bcrypt.hashSync('password', 10);

factory.define('user', User, {
  firstName: factory.seq('User.firstName', n => `firstName${n}`),
  lastName: factory.seq('User.lastName', n => `lastName${n}`),
  email: factory.seq('User.email', n => `firstLast${n}@wolox.com.ar`),
  password: hashed
});

factory.define('admin', User, {
  firstName: factory.seq('User.firstName', n => `admin${n}`),
  lastName: factory.seq('User.lastName', n => `guy${n}`),
  email: factory.seq('User.email', n => `adminguy${n}@wolox.com.ar`),
  password: hashed,
  isAdmin: true
});

exports.factory = factory;
