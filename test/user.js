const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  logger = require('../app/logger'),
  User = require('../app/models').user,
  factory = require('./testFactory').factory,
  token = require('../app/services/tokenSessions'),
  bcrypt = require('bcryptjs'),
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

describe('/users/sessions POST', () => {
  it(`should fail because email is not in Wolox's domain & null password`, done => {
    chaiPost('/users/sessions', {
      email: 'user@.com.ar'
    }).catch(err => {
      err.should.have.status(400);
      err.response.should.be.json;
      err.response.body.should.have.property('message');
      err.response.body.should.have.property('internal_code');
      expect(err.response.body.message).to.eql([
        'Email is not a valid email and/or not in the @wolox.com.ar domain.',
        'Password cannot be null.'
      ]);
      expect(err.response.body.internal_code).to.equal('invalid_user');
      done();
    });
  });

  it('should fail because email is not registered', done => {
    chaiPost('/users/sessions', {
      email: 'user@wolox.com.ar',
      password: 'validpass'
    }).catch(err => {
      err.should.have.status(400);
      err.response.should.be.json;
      err.response.body.should.have.property('message');
      err.response.body.should.have.property('internal_code');
      expect(err.response.body.message).to.equal('There is no user registered with that email.');
      expect(err.response.body.internal_code).to.equal('invalid_user');
      done();
    });
  });

  it('should fail because password is incorrect', done => {
    const userObject = {
      firstName: 'firstName',
      lastName: 'lastName',
      password: 'validpass',
      email: 'email@wolox.com.ar'
    };
    chaiPost('/users', userObject)
      .then(() =>
        chaiPost('/users/sessions', {
          email: 'email@wolox.com.ar',
          password: 'invalidpass'
        })
      )
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
        expect(err.response.body.message).to.equal('The email/password combination you entered is invalid.');
        expect(err.response.body.internal_code).to.equal('invalid_user');
        done();
      });
  });

  it('should be successful', done => {
    const userObject = {
      firstName: 'firstName',
      lastName: 'lastName',
      password: 'validpass',
      email: 'email@wolox.com.ar'
    };
    chaiPost('/users', userObject)
      .then(() =>
        chaiPost('/users/sessions', {
          email: 'email@wolox.com.ar',
          password: 'validpass'
        })
      )
      .then(res => {
        expect(res.header).to.have.property('authorization');
        const auth = token.encode(userObject.email);
        expect(token.decode(res.header.authorization).email).to.equal('email@wolox.com.ar');
        expect(res.status).to.equal(200);
        dictum.chai(res);
        done();
      });
  });
});

describe('/users GET', () => {
  afterEach(() => {
    factory.cleanUp();
  });
  it('should fail because session has no token', done => {
    chai
      .request(server)
      .get('/users')
      .query({
        page: 1,
        limit: 10
      })
      .catch(err => {
        err.should.have.status(401);
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
        expect(err.response.body.message).to.equal('Missing token.');
        expect(err.response.body.internal_code).to.equal('invalid_token');
        done();
      });
  });

  it('should fail because session is not valid', done => {
    chai
      .request(server)
      .get('/users')
      .set(token.headerName, token.encode({ email: 'all your base belong to us' }))
      .query({
        page: 1,
        limit: 10
      })
      .catch(err => {
        err.should.have.status(401);
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
        expect(err.response.body.message).to.equal('Invalid token.');
        expect(err.response.body.internal_code).to.equal('invalid_token');
        done();
      });
  });

  it('should be successful', done => {
    factory.createMany('user', 20).then(newUsers => {
      chai
        .request(server)
        .get('/users')
        .set(token.headerName, token.encode({ email: newUsers[0].email }))
        .query({
          page: 0,
          limit: 5
        })
        .then(res => {
          res.status.should.be.equal(200);
          expect(res.body.rows.length).to.eql(5);
          expect(res.body.count).to.eql(20);
          dictum.chai(res);
          chai
            .request(server)
            .get('/users')
            .set(token.headerName, token.encode({ email: newUsers[0].email }))
            .query({
              page: 1,
              limit: 5
            })
            .then(res2 => {
              res2.status.should.be.equal(200);
              expect(res2.body.rows.length).to.eql(5);
              expect(res2.body.count).to.eql(20);
              dictum.chai(res2);
              done();
            });
        });
    });
  });
});

describe('/admin/users POST', () => {
  it('should fail because user is not an admin', done => {
    factory.create('user').then(user => {
      chai
        .request(server)
        .post('/admin/users')
        .set(token.headerName, token.encode({ email: user.email }))
        .send({
          firstName: user.firstName,
          lastName: user.lastName,
          password: 'password',
          email: user.email
        })
        .catch(err => {
          err.should.have.status(400);
          err.response.body.should.have.property('message');
          err.response.body.should.have.property('internal_code');
          expect(err.response.body.message).to.equal('User does not have access to this resource.');
          expect(err.response.body.internal_code).to.equal('invalid_user');
          done();
        });
    });
  });

  it('should fail because arguments are invalid', done => {
    factory.create('admin').then(admin => {
      chai
        .request(server)
        .post('/admin/users')
        .set(token.headerName, token.encode({ email: admin.email }))
        .send({
          firstName: '',
          lastName: '',
          password: 'pas-',
          email: 'myguy@molox.com.mx'
        })
        .catch(err => {
          err.should.have.status(400);
          err.response.body.should.have.property('message');
          err.response.body.should.have.property('internal_code');
          expect(err.response.body.message).to.eql([
            'First name cannot be empty.',
            'Last name cannot be empty.',
            'Email is not a valid email and/or not in the @wolox.com.ar domain.',
            'Invalid password. Must be 8 alphanumeric characters or longer.'
          ]);
          expect(err.response.body.internal_code).to.equal('invalid_user');
          done();
        });
    });
  });

  it('should be successful (granting permission)', done => {
    const user = factory.create('user');
    const admin = factory.create('admin');
    Promise.all([user, admin]).then(values => {
      chai
        .request(server)
        .post('/admin/users')
        .set(token.headerName, token.encode({ email: values[1].email }))
        .send({
          firstName: values[0].firstName,
          lastName: values[0].lastName,
          password: 'password',
          email: values[0].email
        })
        .then(res => {
          expect(res.status).to.equal(201);
          User.findOne({ where: { email: values[0].email } }).then(dbUser => {
            expect(dbUser.isAdmin).to.eql(true);
            dictum.chai(res);
            done();
          });
        });
    });
  });

  it('should be successful (creating new admin)', done => {
    factory.create('admin').then(admin => {
      chai
        .request(server)
        .post('/admin/users')
        .set(token.headerName, token.encode({ email: admin.email }))
        .send({
          firstName: 'admin2',
          lastName: 'guy2',
          password: 'password',
          email: 'adminguy2@wolox.com.ar'
        })
        .then(res => {
          expect(res.status).to.equal(201);
          User.findOne({ where: { email: 'adminguy2@wolox.com.ar' } }).then(dbUser => {
            expect(dbUser.firstName).to.eql('admin2');
            expect(dbUser.lastName).to.eql('guy2');
            expect(dbUser.email).to.eql('adminguy2@wolox.com.ar');
            expect(dbUser.isAdmin).to.eql(true);
            dictum.chai(res);
            done();
          });
        });
    });
  });
});

describe('token expiry', () => {
  it('should fail because token expired', done => {
    factory.create('user').then(user => {
      const tk = token.encode({ email: user.email });
      setTimeout(() => {
        chai
          .request(server)
          .get('/users')
          .set(token.headerName, tk)
          .catch(err => {
            err.should.have.status(401);
            err.response.body.should.have.property('message');
            err.response.body.should.have.property('internal_code');
            expect(err.response.body.message).to.equal('Token expired');
            expect(err.response.body.internal_code).to.equal('invalid_token');
            done();
          });
      }, 2000);
    });
  });
});

describe('/users/sessions/invalidate_all POST', () => {
  it('should fail because user logged out', done => {
    factory.create('user').then(user => {
      const tk = token.encode({ email: user.email });
      chai
        .request(server)
        .post('/users/sessions/invalidate_all')
        .set(token.headerName, tk)
        .then(() => {
          logger.info('User logged out.');
          chai
            .request(server)
            .get('/users')
            .set(token.headerName, tk)
            .catch(err => {
              err.should.have.status(401);
              err.response.body.should.have.property('message');
              err.response.body.should.have.property('internal_code');
              expect(err.response.body.message).to.equal('Invalid token.');
              expect(err.response.body.internal_code).to.equal('invalid_token');
              done();
            });
        });
    });
  });
});
