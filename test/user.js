const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  logger = require('../app/logger'),
  User = require('../app/models').Users,
  should = chai.should(),
  expect = require('chai').expect;

const chaiPost = (path, object) =>
  chai
    .request(server)
    .post(path)
    .send(object);

describe('/users POST', () => {
  it('should fail because first name is missing', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        lastName: 'lastName',
        password: 'password',
        email: 'email@wolox.com.ar'
      })
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
        expect(err.response.body.message).to.eql(['First name cannot be null.']);
        expect(err.response.body.internal_code).to.equal('invalid_user');
        done();
      });
  });

  it('should fail because last name is missing', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        firstName: 'firstName',
        password: 'password',
        email: 'email@wolox.com.ar'
      })
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
        expect(err.response.body.message).to.eql(['Last name cannot be null.']);
        expect(err.response.body.internal_code).to.equal('invalid_user');
        done();
      });
  });

  it('should fail because email is missing', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        password: 'password'
      })
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
        expect(err.response.body.message).to.eql(['Email cannot be null.']);
        expect(err.response.body.internal_code).to.equal('invalid_user');
        done();
      });
  });

  it('should fail because password is missing', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'email@wolox.com.ar'
      })
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
        expect(err.response.body.message).to.eql(['Password cannot be null.']);
        expect(err.response.body.internal_code).to.equal('invalid_user');
        done();
      });
  });

  it('should fail because password is too short/not alphanumeric', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'email@wolox.com.ar',
        password: '234-'
      })
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
        expect(err.response.body.message).to.eql([
          'Invalid password. Must be 8 alphanumeric characters or longer.'
        ]);
        expect(err.response.body.internal_code).to.equal('invalid_user');
        done();
      });
  });

  it('should fail because email is already in use', done => {
    const userObject = {
      firstName: 'firstName',
      lastName: 'lastName',
      password: 'validpass',
      email: 'email@wolox.com.ar'
    };
    chaiPost('/users', userObject)
      .then(() => chaiPost('/users', userObject))
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
        expect(err.response.body.message).to.equal(
          "This email is already registered. The user's email must be unique."
        );
        expect(err.response.body.internal_code).to.equal('saving_error');
        done();
      });
  });

  it('should be successful', done => {
    const userObj = {
      firstName: 'firstName',
      lastName: 'lastName',
      password: 'password',
      email: 'email2@wolox.com.ar'
    };
    chai
      .request(server)
      .post('/users')
      .send(userObj)
      .then(res => {
        res.status.should.be.equal(201);
        User.findOne({
          attributes: ['firstName', 'lastName', 'email'],
          where: {
            firstName: 'firstName',
            lastName: 'lastName',
            email: 'email2@wolox.com.ar'
          }
        }).then(db => {
          expect(db.firstName).to.eql(userObj.firstName);
          expect(db.lastName).to.eql(userObj.lastName);
          expect(db.email).to.eql(userObj.email);
          dictum.chai(res);
          done();
        });
      });
  });
});
