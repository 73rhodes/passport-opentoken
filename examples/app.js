var express = require('express');
var app = express();
var util = require('util');
var opentoken = require('opentoken');

// Options for OpenToken
var otkPassword = 'blahblahblah';
var otkCipherSuite = 2;
var otkOptions = {
  tokenTolerance: 3600, // seconds
  tokenRenewal: 43200,
  tokenLifetime: 1000
};

// Options for PingFederate
var pfOptions = {
  targetResource: "http://localhost:3000/ssolanding",
  tokenName: 'opentoken',
  cookiePath: '/',
  useCookie: false
};

var api = new opentoken.OpenTokenAPI(otkCipherSuite, otkPassword, otkOptions);

app.get('/login/opentoken', function (req, res) {
  var ssoUrl = "https://localhost:9031" + 
    "/idp/startSSO.ping" +
    "?PartnerSpId=PF-DEMO" + 
    "&TargetResource=https://localhost:3000/login/opentoken/callback";
  res.status(302).redirect(ssoUrl);
});

app.get('/login/opentoken/callback', function (req, res) {
  var token = req.param(pfOptions.tokenName); 
  console.log(token);
  api.parseToken(token, function (err, data) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      console.log(data);
      res.status(200).send(
       '<html><a href="/logout/opentoken">logout</a><br><pre>' + 
       JSON.stringify(data, null, 2) + '</pre></html>');
    }
  });
});

app.get('/logout/opentoken', function (req, res) {
  res.status(302).redirect('https://localhost:9031/quickstart-app-idp/go?action=logout');
});

var server = app.listen(3000, function () {
  console.log("Listening on port %d", server.address().port);
});
