const rp = require('request-promise'),
  errors = require('../errors'),
  config = require('./../../config'),
  UserAlbum = require('../models').useralbum;

exports.getAlbums = () => {
  console.log(config.common.url);
  return rp({
    uri: `${config.common.url}/albums`,
    json: true
  })
    .then(response => {
      return response;
    })
    .catch(err => {
      throw errors.fetchError(err.message);
    });
};

exports.getAlbum = route => {
  return rp({
    uri: `${config.common.url}/albums${route}`,
    json: true
  })
    .then(response => {
      return response;
    })
    .catch(err => {
      throw errors.fetchError(err.message);
    });
};

exports.getUserAlbums = id => {
  return UserAlbum.getAlbums(id).then(albums => {
    const albumArray = [];
    albums.forEach(element => albumArray.push(exports.getAlbum(`/${element.albumId}`)));
    return Promise.all(albumArray);
  });
};

exports.getAlbumPhotos = id => {
  return rp({
    uri: `${config.common.url}/album/${id}/photos`,
    json: true
  })
    .then(response => {
      return response;
    })
    .catch(err => {
      throw errors.fetchError(err.message);
    });
};
