/**
 * Module dependencies
 */
var passport = require('passport-strategy');
var util     = require('util');
var OpenTokenAPI = require('opentoken').OpenTokenAPI;


/**
 * `Strategy` constructor.
 * 
 * The opentoken authentication strategy authenticates requests using OpenToken 
 *
 * Applications must supply a `verify` callback which accepts `token` and calls
 * the `done` callback supplying a `user`, which should be set to `false` if the 
 * token is not valid. If an exception occured, `err` should be set.
 *
 * Options including the OpenToken SSO Service Provider URL, Service Provider ID,
 * Target callback URL, and Token Name _should_ be set.
 *
 * Options:
 *  - `password`
 *  - `cipherSuite`
 *  - `tokenLifetime`
 *  - `tokenTolerance`
 *  - `tokenRenewal`
 *  - `ssoUrl`
 *  - `ssoSpId`
 *  - `target`
 *  - `tokenName`
 *  - `useCookie`
 *  - `cookiePath`
 * 
 * Examples:
 * 
 *     passport.use(new OpenTokenStrategy({
 *      ...
 */
function Strategy(options, verify) {
  if (typeof options == 'function') {
    verify = options;
    options = {};
  }
  if (!verify) {
    throw new Error('opentoken authentication strategy requires a verify function');
  }

  // OpenToken SSO server options
  var ssoUrl  = options.ssoUrl || 'https://localhost:9031/idp/startSSO.ping';
  var ssoSpId = options.spId   || 'PF-DEMO'; 
  var target  = options.target || 'https://localhost';
  var tokenName  = options.tokenName || 'token';
  var useCookie  = options.useCookie;
  var cookiePath = options.cookiePath || '/';

  // OpenToken options
  var otkPassword    = options.password    || null;
  var otkCipherSuite = options.cipherSuite || 0;
  var otkOptions = {};
  if (options.tokenLifetime) {
    otkOptions.tokenLifetime = options.tokenLifetime;
  }
  if (options.tokenRenewal) {
    otkOptions.tokenRenewal = options.tokenRenewal;
  }
  if (options.tokenTolerance) {
    otkOptions.tokenTolerance = options.tokenTolerance;
  }

  // Instance properties
  this.otk  = new OpenTokenAPI(otkCipherSuite, otkPassword, otkOptions);

  passport.Strategy.call(this);
  this.name = 'opentoken';
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback;
}


/**
 * Inherit from 'passport.Strategy'.
 */
util.inherits(Strategy, passport.Strategy);

Strategy.prototype.authenticate = function () {
  this.pass(); // for testing, everything passes for now
};


/**
 * Expose `Strategy`
 */
module.exports = Strategy;
