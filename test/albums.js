const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  logger = require('../app/logger'),
  factory = require('./testFactory').factory,
  nock = require('nock'),
  token = require('../app/services/tokenSessions'),
  UserAlbum = require('../app/models').useralbum,
  should = chai.should(),
  expect = require('chai').expect;

const albums404 = () => {
  nock('https://jsonplaceholder.typicode.com')
    .get('/albums')
    .reply(404, {});
};

const albumSuccess = persist => {
  const success = nock('https://jsonplaceholder.typicode.com')
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
  const success = nock('https://jsonplaceholder.typicode.com')
    .persist(persist)
    .get('/albums/1')
    .reply(200, {
      userId: 1,
      id: 1,
      title: 'quidem molestiae enim'
    });
};

const noAlbum = persist => {
  const success = nock('https://jsonplaceholder.typicode.com')
    .persist(persist)
    .get('/albums/101')
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
    nock.cleanAll();
    noAlbum();
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
    nock.cleanAll();
    noAlbum(false);
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
    nock.cleanAll();
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
