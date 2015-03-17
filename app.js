
/**
 * Basic static file server powered by Express.
 */
var express             = require('express'),
    app                 = express(),
    path                = require('path'),
    args                = {},
    session             = require('express-session'),
    passport            = require('passport'),
    twitterStrategy     = require('passport-twitter').Strategy,
    auth                = require('./core/auth'),
    twitter             = require('twitter'),
    client;

/**
 * Create a new twitter client
 */
client = new twitter(auth.twitter);


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
 * Initialise passport middleware
 */
app.use(passport.initialize());
app.use(passport.session());

passport.use(new twitterStrategy(auth.passport,
  function(token, tokenSecret, profile, done) {
      return done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});


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

app.get('/tweets', function(req, res){

});

app.get('/api/tweets', function(req, res){
    console.log(req);
    if ( req.session.passport.user ) {
        var user = req.session.passport.user.id;
        console.log(req.session.passport.user.id);
        client.get('favorites/list', { user_id: user }, function(err, tweets, response){

            res.json(tweets[0]);
        });
    } else {
        res.json('Not logged in');
    }

});

app.use('/', function(req, res, next) {
  res.status(404).json('File not found');
});

/**
 * Index route
 */
// app.get('/', function(req, res) {
//   res.sendfile('index.html', { root: 'app' });
// });
//

/**
 * Get the arguments that the server was started with
 */
process.argv.forEach(function (val, index, array) {
    if ( val.indexOf('=') !== -1 ) args[val.split('=')[0]] = val.split('=')[1];
});

/**
 * Start the express server
 */
app.listen(args.port || 3000, function() {
    console.log('Server listening on port ' + (args.port || 3000));
});

