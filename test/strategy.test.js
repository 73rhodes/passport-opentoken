/* global describe, it, expect, before */
/* jshint expr: true */

var chai = require('chai');
var Strategy = require('../lib/strategy');

chai.use(require('chai-passport-strategy'));
global.expect = chai.expect;


describe('Strategy', function() {
    
  var strategy = new Strategy(function(){});
    
  it('should be named opentoken', function() {
    expect(strategy.name).to.equal('opentoken');
  });
  
  describe('handling a request', function() {
    var ok, request;
    
    before(function(done) {
      chai.passport(strategy)
        .pass(function() {
          ok = true;
          done();
        })
        .req(function(req) {
          request = req;
        })
        .authenticate();
    });
    
    it('should call pass', function() {
      expect(ok).to.be.true;
    });
    
    it('should leave req.user undefined', function() {
      expect(request.user).to.be.undefined;
    });

  });
  
});
