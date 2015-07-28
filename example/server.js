// Dependencies
var express      = require('express'),
    http         = require('http'),
    fs           = require('fs'),
    path         = require('path'),
    logger       = require('morgan'),
    errorHandler = require('errorhandler'),
    bodyParser   = require('body-parser'),
    multer       = require('multer');

// Set up the application
var app = express();

// Environment Checks
app.set('port', process.env.PORT || 1337);

// Manage Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('combined'));

// Express Configuration
app.use('/public', express.static(path.join(__dirname, '../dist')));
app.use('/public', express.static(path.join(__dirname, '../lib')));
app.use('/public/docs', express.static(path.join(__dirname, './documentation')));

// Development (set NODE_ENV environment variable to trigger this)
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

app.use(bodyParser.json());
app.use(multer({
    dest: './uploads'
}));

app.post('/api/upload', function (req, res) {
    console.log(req.files);
    if(req.files && req.files.upload) {
        fs.unlink(req.files.upload.path, function(err) {
            console.log(err);
            res.status(201).send({ name: req.files.upload.originalname, path: req.files.upload.path });
        });
    } else {
        res.status(501).send({ message: 'Unable to store file' });
    }
});

app.get('/', function (req, res) {
    res.render('default');
});

// Start up the server
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
