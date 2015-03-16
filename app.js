
/**
 * Basic static file server powered by Express.
 */
var express     = require('express'),
    app         = express(),
    path        = require('path'),
    args        = {};

/**
 * Serve static files from the app directory.
 */
app.use("/", express.static(path.resolve(__dirname, "app")));
app.use("/", function(req, res, next) {
  res.status(404).json('File not found');
});

/**
 * Index route
 */
app.get('/', function(req, res) {
  res.sendfile('index.html', { root: "app" });
});

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

