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
  host: "qa-test",
  port: 9031,
  https: true,
  path: "/idp/startSSO.ping",
  partnerSpId: "PF-DEMO",
  targetResource: "http://localhost:3000/ssolanding",
  tokenName: 'opentoken',
  cookiePath: '/',
  useCookie: false
};

var api = new opentoken.OpenTokenAPI(otkCipherSuite, otkPassword, otkOptions);

app.get('/mobile/singlesignon', function (req, res) {
  var protocol = pfOptions.https ? "https://" : "http://";
  var host     = pfOptions.host || "localhost";
  var port     = pfOptions.port || 80;
  var path     = pfOptions.path || "/idp/startSSO.ping";
  var spId     = pfOptions.partnerSpId || "PF-DEMO";
  var target   = pfOptions.targetResource || "http://localhost/sso";
  var ssoUrl   = protocol + host + ":" + port + path;
  var ssoQuery = "?PartnerSpId=" + spId + "&TargetResource=" + target; 
  res.status(302).redirect(ssoUrl + ssoQuery);
});

app.get('/mobile/ssolanding', function (req, res) {
  var token = req.param(pfOptions.tokenName); // 'kssubportal'
  console.log(token);
  api.parseToken(token, function (err, data) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      console.log(data);
      res.status(200).send(
       '<html><a href="/mobile/singlelogout">logout</a><br><pre>' + 
       JSON.stringify(data, null, 2) + '</pre></html>');
    }
  });
});

app.get('/mobile/singlelogout', function (req, res) {
  res.status(302).redirect('https://qa-test:9031/quickstart-app-idp/go?action=logout');
});

var server = app.listen(3000, function () {
  console.log("Listening on port %d", server.address().port);
});
