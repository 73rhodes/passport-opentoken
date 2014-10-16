Passport strategy for authenticating with PingFederate using the OpenToken API

This is a work in progress, but usable.

Usage
-----

Create a login redirect to your PingFederate / OpenToken server,
with a URL containing `PartnerSpId` and `TargetResource` parameters,
a login callback route and a logout route.


```javascript
app.get('/login/opentoken', function (req, res) {
  res.redirect("https://localhost:9031/idp/startSSO.ping" +
    "?PartnerSpId=PF-DEMO" +
    "&TargetResource=https://localhost:3000/login/opentoken/callback");
});

app.get('/login/opentoken/callback', passport.authenticate('opentoken'), function (req, res) {
  res.redirect('/dashboard.html'); // or whatever your landing page is
});

app.all('/logout/opentoken', function (req, res) {
  req.session.destroy();
  res.redirect('https://localhost:9031/quickstart-app-idp/go?action=logout');
});
```

Configuration
-------------

Before the above will work, you need to configure passport to use
the opentoken strategy. Create a [verify callback](http://passportjs.org/guide/configure/)
and instantiate an `OpenTokenStrategy` object for `passport` to use.

```js
function verifyCallback(username, done) {
  // see http://passportjs.org/guide/configure/ for an example
  // of a verify callback.
});

var otkOptions = {
  tokenName: 'mytoken',
  password: 'blahblah',
  cipherSuite: 2
};

passport.use(new OpenTokenStrategy(otkOptions, verifyCallback));
```

If using sessions, you'll need `passport.serializeUser` and `passport.deserializeUser` functions as per the passport [documentation](http://passportjs.org/guide/configure/).
