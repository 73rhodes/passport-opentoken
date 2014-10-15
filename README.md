Passport strategy for authenticating with PingFederate using the OpenToken API

This is a work in progress, but usable.

Usage
-----

Redirect a route to PingFederate or whatever your OpenToken server is,
using a properly crafted URL containing `PartnerSpId` and `TargetResource`
URL parameters.

`PartnerSpId` identifies the Service Provider ID to use, as configured on
the PingFederate server.

`TargetResource` is the callback URL that PingFederate will redirect to
after a successful login, with the token stuck onto the query string.

```
app.get('/login/opentoken', function (req, res) {
  res.redirect("https://localhost:9031/idp/startSSO.ping" +
    "?PartnerSpId=PF-DEMO" +
    "&TargetResource=https://localhost:3000/login/opentoken/callback");
});
```

Create a login callback route. PingFederate will query this URL with a token
in the query string.

```
app.get('/login/opentoken/callback', passport.authenticate('opentoken'), function (req, res) {
  res.redirect('/dashboard.html'); // or whatever your landing page is
});
```

Create a logout route, too. It should destroy your session and redirect to the logout URL that 
you have configured on your PingFederate server.

```
app.all('/logout.html', function (req, res) {
  req.session.destroy();
  res.redirect('https://localhost:9031/quickstart-app-idp/go?action=logout');
});
```

Configuration
-------------

Before any of the above will actually work, you need to configure passport to use
the opentoken strategy.

First, create a verify callback function that passport will use to look up
a user.

```
function verifyCallback(username, done) {
  // see http://passportjs.org/guide/configure/ for an example
  // of a verify callback.
});
```

Next, create an `OpenTokenStrategy` with the necessary options.

```
var otkOptions = {
  password: 'blahblah',
  cipherSuite: 2
};

var otkStrategy = new OpenTokenStrategy(otkOptions, verifyCallback);

passport.use(otkStrategy);
```
