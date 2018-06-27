const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  logger = require('../app/logger'),
  factory = require('./testFactory').factory,
  nock = require('./nockResponses'),
  token = require('../app/services/tokenSessions'),
  should = chai.should(),
  expect = require('chai').expect;

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
          expect(err.response.body.message).to.equal('Invalid token.');
          expect(err.response.body.internal_code).to.equal('fetch_error');
          done();
        });
    });
  });
});
