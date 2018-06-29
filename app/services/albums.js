const rp = require('request-promise'),
  errors = require('../errors.js');

exports.getAlbums = () => {
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
