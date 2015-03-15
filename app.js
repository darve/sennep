
/**
 * Basic static file server powered by Express.
 */
var express     = require('express'),
    app         = express(),
    path        = require('path'),
    port        = process.env.PORT || 3000;

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

app.listen(port);
console.log('Server listening on port ' + port);
