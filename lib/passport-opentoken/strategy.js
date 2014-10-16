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
 * the `done` callback supplying a `user`, which should be set to `false` if
 * the token is not valid. If an exception occured, `err` should be set.
 *
 * Options including the OpenToken SSO Service Provider URL, Service Provider
 * ID, Target callback URL, and Token Name _should_ be set.
 *
 * Options:
 *  - `password` - secret for OpenToken encryption / decryption. Can be null.
 *  - `cipherSuite` - cipher suite used for OpenToken encryption [0-3]
 *  - `tokenLifetime` - token lifetime in seconds [300]
 *  - `tokenTolerance` - token time tolerance in seconds [120]
 *  - `tokenRenewal` - token renewal limit in seconds [43200].
 *  - `ssoUrl` - URL of OpenToken Single-Sign On service provider
 *  - `ssoSpId` - Service Provider ID, used by the SSO server
 *  - `target` - callback URL to forward to after successful login
 *  - `tokenName` - name of the OpenToken included in callback HTTP request
 *  - `useCookie` - boolean, whether to put token in a cookie (not used yet)
 *  - `cookiePath` - cookie path, defaults to '/' (not used yet)
 * 
 * Examples:
 * 
 *     passport.use(new OpenTokenStrategy({
 *      ...
 */
function Strategy(options, verify) {

  if (typeof options === 'function') {
    verify = options;
    options = {};
  }

  if (!verify) {
    throw new TypeError('OpenToken strategy requires a verify callback');
  }

  if (!options.tokenName) {
    throw new TypeError('OpenToken strategy requires a tokenName options');
  }

  // OpenToken SSO server options
  //var ssoUrl  = options.ssoUrl || 'https://localhost:9031/idp/startSSO.ping';
  //var ssoSpId = options.spId   || 'PF-DEMO';
  //var target  = options.target || 'https://localhost';
  //var useCookie  = options.useCookie;
  //var cookiePath = options.cookiePath || '/';

  // OpenToken options
  var password    = options.password    || null;
  var cipherSuite = options.cipherSuite || 0;
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
  this._opentokenApi = new OpenTokenAPI(cipherSuite, password, otkOptions);
  //this.ssoUrl = ssoUrl;         // not used yet
  //this.ssoSpId = ssoSpId;       // not used yet
  //this.target = target;         // not used yet
  this._tokenName = options.tokenName;
  //this.useCookie = useCookie;   // not used yet
  //this.cookiePath = cookiePath; // not used yet

  passport.Strategy.call(this);
  this.name = 'opentoken';
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback;
}


/**
 * Inherit from 'passport.Strategy'.
 */
util.inherits(Strategy, passport.Strategy);


/**
 * Authenticate request based on OpenToken and user-supplied `verify` method
 * @param {Object} req HTTP Request object
 * @param {Object} options 
 * Options:
 *  - `tokenName` - Name of GET URL parameter containing token
 */
Strategy.prototype.authenticate = function (req, options) {

  options = options || {};
  var self = this;
  var tokenName = options.tokenName || self._tokenName;
  var token = req.param(tokenName);

  if (!token) {
    return self.fail("OpenToken %s missing from request", tokenName);
  }

  self._opentokenApi.parseToken(token, function (err, data) {

    if (err) {
      // Parsing errors indicate a problem with the token...either it's
      // expired, timestamps don't match up, formatted wrong, cannot be
      // deciphered with the configured password, etc. All of these are
      // problems with the token, not an internal server error, so call
      // `self.fail(message)` resulting in a 401 Unauthorized response,
      // rather than `self.error(err)` for a 500 Internal Server Error.
      return self.fail(err.message);
    }

    if (!data) {
      // As above return 401 Unauthorized not 500 Internal Server Error
      return self.fail("OpenToken missing from request");
    }

    if (!data.subject) {
      // subject is required & should hold ID of the authenticated user
      return self.fail("OpenToken contains no subject");
    }

    function verified(err, user, info) {
      if (err) {
        return self.error(err);
      }
      if (!user) {
        return self.fail(info);
      }
      self.success(user, info);
    }

    if (self._passReqToCallback) {
      self._verify(req, data.subject, verified);
    } else {
      self._verify(data.subject, verified);
    }

  });

};


/**
 * Expose `Strategy`
 */
module.exports = Strategy;
