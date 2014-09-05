// Dependencies
var express = require('express'),
    http = require('http'),
    path = require('path'),
    logger = require('morgan'),
    errorHandler = require('errorhandler');

// Set up the application
var app = express();

// Environment Checks
app.set('port', process.env.PORT || 1337);

// Manage Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger());
// Express Configuration
app.use('/public', express.static(path.join(__dirname, '../dist')));
app.use('/public', express.static(path.join(__dirname, '../lib')));
app.use('/public/docs', express.static(path.join(__dirname, './documentation')));

// Development (set NODE_ENV environment variable to trigger this)
if ('development' == app.get('env')) {
    app.use(logger());
    app.use(errorHandler());
}

app.get('/', function(req, res) {
    res.render('default');
});

// Start up the server
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
