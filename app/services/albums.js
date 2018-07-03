const rp = require('request-promise'),
  errors = require('../errors'),
  UserAlbum = require('../models').useralbum;

exports.getAlbums = () => {
  return rp({
    uri: `https://jsonplaceholder.typicode.com/albums`,
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
    uri: `https://jsonplaceholder.typicode.com/albums${route}`,
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
  return UserAlbum.getAlbums(id)
    .then(albums => {
      const albumArray = [];
      albums.forEach(element => albumArray.push(exports.getAlbum(`/${element.albumId}`)));
      return Promise.all(albumArray);
    })
    .catch(err => {
      throw err;
    });
};

exports.getAlbumPhotos = id => {
  return rp({
    uri: `https://jsonplaceholder.typicode.com/album/${id}/photos`,
    json: true
  })
    .then(response => {
      return response;
    })
    .catch(err => {
      throw errors.fetchError(err.message);
    });
};
