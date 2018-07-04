const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  logger = require('../app/logger'),
  factory = require('./testFactory').factory,
  nock = require('nock'),
  token = require('../app/services/tokenSessions'),
  UserAlbum = require('../app/models').useralbum,
  config = require('./../config'),
  should = chai.should(),
  expect = require('chai').expect;

const albums404 = () => {
  nock(`${config.common.url}`)
    .get('/albums')
    .reply(404, {});
};

const albumSuccess = persist => {
  const success = nock(`${config.common.url}`)
    .persist(persist)
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
};

const oneAlbum = persist => {
  const success = nock(`${config.common.url}`)
    .persist(persist)
    .get('/albums/1')
    .reply(200, {
      userId: 1,
      id: 1,
      title: 'quidem molestiae enim'
    });
};

const noAlbum = (persist, num) => {
  const success = nock(`${config.common.url}`)
    .persist(persist)
    .get(`/albums/${num}`)
    .reply(404, {});
};

const onePhoto = (persist, id) => {
  const success = nock(`${config.common.url}`)
    .persist(persist)
    .get(`/album/${id}/photos`)
    .reply(200, [
      {
        albumId: 1,
        id: 1,
        title: 'accusamus beatae ad facilis cum similique qui sunt',
        url: 'http://placehold.it/600/92c952',
        thumbnailUrl: 'http://placehold.it/150/92c952'
      },
      {
        albumId: 1,
        id: 2,
        title: 'reprehenderit est deserunt velit ipsam',
        url: 'http://placehold.it/600/771796',
        thumbnailUrl: 'http://placehold.it/150/771796'
      },
      {
        albumId: 1,
        id: 3,
        title: 'officia porro iure quia iusto qui ipsa ut modi',
        url: 'http://placehold.it/600/24f355',
        thumbnailUrl: 'http://placehold.it/150/24f355'
      }
    ]);
};

const noPhoto = (persist, id) => {
  const success = nock(`${config.common.url}`)
    .persist(persist)
    .get(`/album/${id}/photos`)
    .reply(404, {});
};

describe('/albums GET', () => {
  it('should fail because session has no token', done => {
    chai
      .request(server)
      .get('/albums')
      .catch(err => {
        err.should.have.status(401);
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
        expect(err.response.body.message).to.equal('Missing token.');
        expect(err.response.body.internal_code).to.equal('invalid_token');
        done();
      });
  });

  it('should fail because token is invalid', done => {
    chai
      .request(server)
      .get('/albums')
      .set(token.headerName, token.encode({ email: 'all your base belong to us' }))
      .catch(err => {
        err.should.have.status(401);
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
        expect(err.response.body.message).to.equal('Invalid token.');
        expect(err.response.body.internal_code).to.equal('invalid_token');
        done();
      });
  });

  before(() => {
    nock.cleanAll();
    albums404();
  });

  it('should fail because external service is unavailable', done => {
    factory.create('user').then(user => {
      chai
        .request(server)
        .get('/albums')
        .set(token.headerName, token.encode({ email: user.email }))
        .catch(err => {
          err.should.have.status(404);
          err.response.body.should.have.property('message');
          err.response.body.should.have.property('internal_code');
          expect(err.response.body.internal_code).to.equal('fetch_error');
          done();
        });
    });
  });

  after(() => {
    nock.cleanAll();
  });

  before(() => {
    albumSuccess(false);
  });

  it('should be successful', done => {
    factory.create('user').then(user => {
      chai
        .request(server)
        .get('/albums')
        .set(token.headerName, token.encode({ email: user.email }))
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(5);
          dictum.chai(res);
          done();
        });
    });
  });
});

describe('/albums/:id POST', () => {
  afterEach(() => {
    factory.cleanUp();
    nock.cleanAll();
  });

  it('should fail because session has no token', done => {
    chai
      .request(server)
      .post('/albums/1')
      .catch(err => {
        err.should.have.status(401);
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
        expect(err.response.body.message).to.equal('Missing token.');
        expect(err.response.body.internal_code).to.equal('invalid_token');
        done();
      });
  });

  it('should fail because token is invalid', done => {
    chai
      .request(server)
      .post('/albums/1')
      .set(token.headerName, token.encode({ email: 'all your base belong to us' }))
      .catch(err => {
        err.should.have.status(401);
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
        expect(err.response.body.message).to.equal('Invalid token.');
        expect(err.response.body.internal_code).to.equal('invalid_token');
        done();
      });
  });

  before(() => {
    noAlbum(true, 101);
  });

  it('should fail because external service is unavailable', done => {
    factory.create('user').then(user => {
      chai
        .request(server)
        .post('/albums/101')
        .set(token.headerName, token.encode({ email: user.email }))
        .catch(err => {
          err.should.have.status(404);
          err.response.body.should.have.property('message');
          err.response.body.should.have.property('internal_code');
          expect(err.response.body.internal_code).to.equal('fetch_error');
          done();
        });
    });
  });

  before(() => {
    noAlbum(false, 101);
  });

  it('should fail because external album does not exist', done => {
    factory.create('user').then(user => {
      chai
        .request(server)
        .post('/albums/101')
        .set(token.headerName, token.encode({ email: user.email }))
        .catch(err => {
          err.should.have.status(404);
          err.response.body.should.have.property('message');
          err.response.body.should.have.property('internal_code');
          expect(err.response.body.internal_code).to.equal('fetch_error');
          done();
        });
    });
  });

  before(() => {
    oneAlbum();
  });

  it('should fail because user purchased the same album twice', done => {
    factory.create('user').then(user => {
      chai
        .request(server)
        .post('/albums/1')
        .set(token.headerName, token.encode({ email: user.email }))
        .then(() => {
          chai
            .request(server)
            .post('/albums/1')
            .set(token.headerName, token.encode({ email: user.email }))
            .catch(err => {
              err.should.have.status(400);
              err.response.body.should.have.property('message');
              err.response.body.should.have.property('internal_code');
              expect(err.response.body.internal_code).to.equal('invalid_user');
              expect(err.response.body.message).to.equal('User cannot purchase album twice.');
              done();
            });
        });
    });
  });

  before(() => {
    oneAlbum(false);
  });

  it('should be successful', done => {
    factory.create('user').then(user => {
      chai
        .request(server)
        .post('/albums/1')
        .set(token.headerName, token.encode({ email: user.email }))
        .then(res => {
          expect(res.status).to.equal(201);
          UserAlbum.findOne({ where: { userId: 1 } }).then(album => {
            expect(album.albumId).to.equal(1);
            dictum.chai(res);
            done();
          });
        });
    });
  });
});

describe('/users/:user_id/albums GET', () => {
  afterEach(() => {
    factory.cleanUp();
    nock.cleanAll();
  });

  it('should fail because session has no token', done => {
    chai
      .request(server)
      .get('/users/1/albums')
      .catch(err => {
        err.should.have.status(401);
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
        expect(err.response.body.message).to.equal('Missing token.');
        expect(err.response.body.internal_code).to.equal('invalid_token');
        done();
      });
  });

  it('should fail because token is invalid', done => {
    chai
      .request(server)
      .get('/users/1/albums')
      .set(token.headerName, token.encode({ email: 'all your base belong to us' }))
      .catch(err => {
        err.should.have.status(401);
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
        expect(err.response.body.message).to.equal('Invalid token.');
        expect(err.response.body.internal_code).to.equal('invalid_token');
        done();
      });
  });

  it('should fail because user is not an administrator', done => {
    factory.createMany('user', 2).then(newUsers => {
      chai
        .request(server)
        .get(`/users/${newUsers[0].id}/albums`)
        .set(token.headerName, token.encode({ email: newUsers[1].email }))
        .catch(err => {
          err.should.have.status(400);
          err.response.body.should.have.property('message');
          err.response.body.should.have.property('internal_code');
          expect(err.response.body.message).to.equal('User does not have access to other users catalogs');
          expect(err.response.body.internal_code).to.equal('invalid_user');
          done();
        });
    });
  });

  before(() => {
    oneAlbum(false);
  });

  it('should fail because external service broke', done => {
    factory.create('user').then(user => {
      chai
        .request(server)
        .post('/albums/1')
        .set(token.headerName, token.encode({ email: user.email }))
        .then(() => {
          noAlbum(false, 1);
          chai
            .request(server)
            .get('/users/1/albums')
            .set(token.headerName, token.encode({ email: user.email }))
            .catch(err => {
              err.should.have.status(404);
              err.response.body.should.have.property('message');
              err.response.body.should.have.property('internal_code');
              expect(err.response.body.internal_code).to.equal('fetch_error');
              done();
            });
        });
    });
  });

  before(() => {
    oneAlbum();
  });

  it('should succeed', done => {
    factory.create('user').then(user => {
      chai
        .request(server)
        .post('/albums/1')
        .set(token.headerName, token.encode({ email: user.email }))
        .then(() => {
          chai
            .request(server)
            .get('/users/1/albums')
            .set(token.headerName, token.encode({ email: user.email }))
            .then(res => {
              res.should.have.status(200);
              expect(res.body).to.eql([{ userId: 1, id: 1, title: 'quidem molestiae enim' }]);
              dictum.chai(res);
              done();
            });
        });
    });
  });

  it('should succeed (admin)', done => {
    factory.create('admin').then(admin => {
      factory.create('user').then(user => {
        chai
          .request(server)
          .post('/albums/1')
          .set(token.headerName, token.encode({ email: user.email }))
          .then(() => {
            chai
              .request(server)
              .get(`/users/${user.id}/albums`)
              .set(token.headerName, token.encode({ email: admin.email }))
              .then(res => {
                res.should.have.status(200);
                expect(res.body).to.eql([{ userId: 1, id: 1, title: 'quidem molestiae enim' }]);
                dictum.chai(res);
                done();
              });
          });
      });
    });
  });
});

describe('/users/albums/:id/photos GET', () => {
  afterEach(() => {
    factory.cleanUp();
    nock.cleanAll();
  });

  it('should fail because session has no token', done => {
    chai
      .request(server)
      .get('/users/albums/1/photos')
      .catch(err => {
        err.should.have.status(401);
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
        expect(err.response.body.message).to.equal('Missing token.');
        expect(err.response.body.internal_code).to.equal('invalid_token');
        done();
      });
  });

  it('should fail because token is invalid', done => {
    chai
      .request(server)
      .get('/users/albums/1/photos')
      .set(token.headerName, token.encode({ email: 'all your base belong to us' }))
      .catch(err => {
        err.should.have.status(401);
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
        expect(err.response.body.message).to.equal('Invalid token.');
        expect(err.response.body.internal_code).to.equal('invalid_token');
        done();
      });
  });

  it('should fail because user does not own album', done => {
    factory.create('user').then(user => {
      chai
        .request(server)
        .get('/users/albums/1/photos')
        .set(token.headerName, token.encode({ email: user.email }))
        .catch(err => {
          err.should.have.status(400);
          err.response.body.should.have.property('message');
          err.response.body.should.have.property('internal_code');
          expect(err.response.body.message).to.equal(
            `User has not purchased album with id #1, or it doesn't exist.`
          );
          expect(err.response.body.internal_code).to.equal('invalid_user');
          done();
        });
    });
  });

  before(() => {
    oneAlbum(false);
  });

  it('should fail because external service broke', done => {
    factory.create('user').then(user => {
      chai
        .request(server)
        .post('/albums/1')
        .set(token.headerName, token.encode({ email: user.email }))
        .then(() => {
          noPhoto(true, 1);
          chai
            .request(server)
            .get('/users/albums/1/photos')
            .set(token.headerName, token.encode({ email: user.email }))
            .catch(err => {
              err.should.have.status(404);
              err.response.body.should.have.property('message');
              err.response.body.should.have.property('internal_code');
              expect(err.response.body.internal_code).to.equal('fetch_error');
              done();
            });
        });
    });
  });

  before(() => {
    oneAlbum(false);
  });

  it('should succeed', done => {
    factory.create('user').then(user => {
      chai
        .request(server)
        .post('/albums/1')
        .set(token.headerName, token.encode({ email: user.email }))
        .then(() => {
          onePhoto(true, 1);
          chai
            .request(server)
            .get('/users/albums/1/photos')
            .set(token.headerName, token.encode({ email: user.email }))
            .then(res => {
              res.should.have.status(200);
              expect(res.body.length).to.equal(3);
              dictum.chai(res);
              done();
            });
        });
    });
  });
});
