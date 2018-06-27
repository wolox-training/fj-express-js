const nock = require('nock');

exports.albumsJSON = nock('https://jsonplaceholder.typicode.com')
  .get('/albums')
  .reply(200, [
    {
      userId: 1,
      id: 1,
      title: 'quidem molestiae enim'
    },
    {
      userId: 1,
      id: 2,
      title: 'sunt qui excepturi placeat culpa'
    },
    {
      userId: 1,
      id: 3,
      title: 'omnis laborum odio'
    },
    {
      userId: 1,
      id: 4,
      title: 'non esse culpa molestiae omnis sed optio'
    },
    {
      userId: 1,
      id: 5,
      title: 'eaque aut omnis a'
    }
  ]);

exports.albums404 = nock('https://jsonplaceholder.typicode.com')
  .get('/albums')
  .reply(404);

exports.clearAll = nock.cleanAll();
