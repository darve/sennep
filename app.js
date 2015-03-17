
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
    autolinker          = require('autolinker'),
    client;


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
      return done(null, profile);
  }
));


/**
 * Create a new twitter client
 */
client = new twitter(auth.twitter);


/**
 * Setup twitter authentication routes
 */
app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/authed', passport.authenticate('twitter',
    {
        successRedirect: '/',
        failureRedirect: '/error'
    }
));


/**
 * Setup the main route that returns tweet data
 */
app.get('/api/tweets', function(req, res){

    // If there is an existing session, we are in business.
    if ( req.session.passport.user ) {

        var user = req.session.passport.user.id,
            data = [],
            t;

        // Request the 25 newest favourited tweets for the authenticated user.
        client.get('favorites/list', { user_id: user, count: 25 }, function(err, tweets, response){

            // There is an error, send that to the client
            if ( err !== null ) {
                res.json({ message: err.message });
            }

            // We have tweets! Send only the fields that the client needs to save
            // unnecessary clientside bloat.
            for ( var i in tweets ) {
                t = tweets[i];

                data.push({
                    tweet_id: t.id,
                    avatar_url: t.user.profile_image_url,
                    display_name: t.user.name,
                    twitter_handle: t.user.screen_name,
                    text: autolinker.link(t.text)
                });
            }

            res.json({
                user: '@' + req.session.passport.user.username,
                tweets: data
            });
        });

    } else {
        res.json({ message: 'not logged in' });
    }

});


/**
 * Get the arguments that the server was started with
 */
process.argv.forEach(function (val, index, array) {
    if ( val.indexOf('=') !== -1 ) args[val.split('=')[0]] = val.split('=')[1];
});


/**
 * Serve static files from the app directory.
 */
app.use('/', express.static(path.resolve(__dirname, args.prod ? 'prod' : 'app')));


/**
 * Handle 404 errors
 */
app.use('/', function(req, res, next) {
  res.status(404).json('File not found');
});


/**
 * Start the express server
 */
app.listen(args.port || 3000, function() {
    console.log('Server listening on port ' + (args.port || 3000));
});

