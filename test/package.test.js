/* global describe, it, expect */

var strategy = require('..');
var chai     = require('chai');

global.expect = chai.expect;
chai.use(require('chai-passport-strategy'));

describe('passport-opentoken', function() {

  it ('should export Strategy constructor directly from package', function() {
    expect(strategy).to.be.a('function');
    expect(strategy).to.equal(strategy.Strategy);
  });

  it('should export Strategy constructor', function() {
    expect(strategy.Strategy).to.be.a('function');
  });

});
