'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var polls = require('./app/routes/poll_routes.js');
var bodyParser = require('body-parser');

var app = express();
//require('dotenv').load();
require('./app/config/passport')(passport);
require('./app/config/passport_google.js')(passport);

mongoose.Promise = global.Promise;
//mongoose.connect(process.env.MONGO_URI,{ storage: { smallFiles: true } });

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
	extended: true
}));

app.use(passport.initialize());
app.use(passport.session());

polls(app, passport);

routes(app, passport);

var port = process.env.PORT || 8080;
app.listen(port, function() {
	console.log('Node.js listening on port ' + port + '...');
});