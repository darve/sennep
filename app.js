
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

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new twitterStrategy(auth.passport,
  function(token, tokenSecret, profile, done) {
    // console.log(arguments);
      return done(null, profile);
  }
));

/**
 * Twitter authentication routes
 */
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/authed', passport.authenticate('twitter',
    {
        successRedirect: '/',
        failureRedirect: '/error'
    }
));

app.get('/api/tweets', function(req, res){

    if ( req.session.passport.user ) {

        var user = req.session.passport.user.id,
            data = [],
            t;

        client.get('favorites/list', { user_id: user }, function(err, tweets, response){

            for ( var i in tweets ) {
                t = tweets[i];

                data.push({
                    tweet_id: t.id,
                    avatar_url: t.user.profile_image_url,
                    display_name: t.user.name,
                    twitter_handle: t.user.screen_name,
                    text: t.text
                });
            }

            res.json(data);
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

