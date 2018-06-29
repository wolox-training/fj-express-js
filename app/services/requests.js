const rp = require('request-promise'),
  errors = require('../errors');

exports.pingAlbums = () => {
  return rp({
    uri: 'https://jsonplaceholder.typicode.com/albums',
    json: true
  })
    .then(response => {
      return response;
    })
    .catch(err => {
      throw errors.fetchError(err.message);
    });
};