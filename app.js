
/**
 * Basic static file server powered by Express.
 */
var express             = require('express'),
    app                 = express(),
    path                = require('path'),
    args                = {},
    session             = require('express-session'),
    passport            = require('passport'),
    twitterStrategy     = require('passport-twitter').Strategy;


/**
 * Serve static files from the app directory.
 */
app.use('/', express.static(path.resolve(__dirname, 'app')));


/**
 * Initialise persistent sessions
 */
app.use(session({
    secret: 'hellofriends',
    resave: false,
    saveUninitialized: false
}));


/**
 * Passport configuration
 */
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new twitterStrategy({
    consumerKey: 'K6kZzTHsatcXgPieyEcotxfY4',
    consumerSecret: 'hgAYZPLMSTdK9wCS4PsSWzh5NhsniJKg8ZlN1UE6rVBXrqWpim',
    callbackURL: 'http://127.0.0.1:3000/auth/twitter/authed'
  },
  function(token, tokenSecret, profile, done) {
      return done(null, profile);
  }
));


/**
 * Twitter authentication routes
 */
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/authed', passport.authenticate('twitter',
    {
        successRedirect: '/tweets',
        failureRedirect: '/error'
    }
));

/**
 * Index route
 */
// app.get('/', function(req, res) {
//   res.sendfile('index.html', { root: 'app' });
// });

/**
 * Get the arguments that the server was started with
 */
process.argv.forEach(function (val, index, array) {
    if ( val.indexOf('=') !== -1 ) args[val.split('=')[0]] = val.split('=')[1];
});

app.use('/', function(req, res, next) {
  res.status(404).json('File not found');
});

/**
 * Start the express server
 */
app.listen(args.port || 3000, function() {
    console.log('Server listening on port ' + (args.port || 3000));
});

