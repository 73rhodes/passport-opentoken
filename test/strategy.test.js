/*global describe, it, expect, before */

var chai = require('chai');
var Strategy = require('../lib/passport-opentoken/strategy');

chai.use(require('chai-passport-strategy'));
global.expect = chai.expect;


describe('Strategy', function () {

  var strategy = new Strategy(
    {
      tokenName: 'mytoken',
      password: 'testPassword',
      cipherSuite: 2
    },
    function (subject, cb) { cb(null, subject); }
  );

  it('should be named opentoken', function () {
    expect(strategy.name).to.equal('opentoken');
  });

  it('should throw if constructed without a tokeName options', function () {
    expect(function () {
      var s = new Strategy(function () {
        return null;
      });
      return s;
    }).to.throw(TypeError, 'OpenToken strategy requires a tokenName options');
  });

  it('should throw if constructed without a verify callback', function () {
    expect(function () {
      var s = new Strategy();
      return s;
    }).to.throw(TypeError, 'OpenToken strategy requires a verify callback');
  });

  describe('handling a request', function() {
    var testToken = 'T1RLAQLVVgI6nfAXif1wYQz-4Hoqqjpk-RCRhrYo_A3vfozy8DwQgX_iAAAgXtSyTiGFVbQGmJ7-USFFjaZYuPueXSr8Gl2W5APuFWw*'
    var testSubject = 'foobar'

    it('should call success with body param', function(done) {
      chai.passport.use(strategy)
        .success(function(user) {
          expect(user).to.equal(testSubject)
          done();
        })
        .req(function(req) {
          req.body = req.body || {}
          req.body.mytoken = testToken
        })
        .authenticate();
    });

    it('should call success with param param', function(done) {
      chai.passport.use(strategy)
        .success(function(user) {
          expect(user).to.equal(testSubject)
          done();
        })
        .fail(function(err) {
          console.log(err)
        })
        .req(function(req) {
          req.params = req.params || {}
          req.params.mytoken = testToken
        })
        .authenticate();
    });

    it('should call success with query param', function(done) {
      chai.passport.use(strategy)
        .success(function(user) {
          expect(user).to.equal(testSubject)
          done();
        })
        .req(function(req) {
          req.query = req.query || {}
          req.query.mytoken = testToken
        })
        .authenticate();
    });

  });

});
