// --- MONGO DB ---
var MongoDB = require('mongodb');
var MongoClient = MongoDB.MongoClient;
var ObjectID = MongoDB.ObjectID;
var MongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/ripple';
var defaultUser = require('./seed');

// --- EXPRESS ---
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
app.use(express.static('public'));
app.use(express.static('bower_components'));

var morgan = require('morgan');
app.use(morgan('combined'));

var cookieParser = require('cookie-parser');
app.use(cookieParser());
var session = require('cookie-session');
// app.use(session({secret: 'asBubblesThatSwimOnTheBeakersBrim'}));
app.use(session({secret: process.env.SESSION_SECRET }));

var ejs = require('ejs');
app.set('view engine', 'ejs');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- SERVER ---

var User = require('./models/user')
var Vessel = require('./models/vessel');


MongoClient.connect(MongoURI, function(err, db) {
	if (err) { throw err };

	var users = db.collection('users');

	app.listen(port);

// LANDING PAGE & AUTHENTICATION
	app.get('/', function(req, res) {
		if (!req.session.user_id) {
			res.render('index.ejs', { userData: defaultUser, isAuthenticated: false });
			console.log(defaultUser);
		}
		else {
			users.find({_id: new ObjectID(session.user_id)}).toArray(function(err, results){
				var user = results[0];
				res.render('index.ejs', { userData: user, isAuthenticated: true });
			})
		}
		// res.sendFile('index.html');
	});

// SEND USER DATA / AUTHENTICATE
  app.get('/users', function(req, res) {
    db.collection('users').find({}).toArray(function(error, results) {
      res.json(results);
    })
  });

  app.get('/users/:id', function(req, res) {
  	if (!req.session.user_id) {
  		console.log('woah woah')
  	}
  	else {
	  	users.findOne({_id: new ObjectID(session.user_id)}, function(err, result){
	  		res.json(result);
	  		req.session.user_id = null;
	  		console.log('hey hey');
	  	})
	  }

  });

});
