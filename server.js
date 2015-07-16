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

var bcrypt = require('bcrypt-nodejs');


// -- TBD --
// var User = require('./models/user');
// var Vessel = require('./models/vessel');

// --- SERVER ---
MongoClient.connect(MongoURI, function(err, db) {
	if (err) { throw err };

	var users = db.collection('users');

	app.listen(port);

// LANDING PAGE & AUTHENTICATION
	app.get('/', function(req, res) {
		if (!req.session.user_id) {
			res.render('jumpIn.ejs', { isAuthenticated: false });
		}
		else {
			users.find({_id: new ObjectID(session.user_id)}).toArray(function(err, results){
				var user = results[0];
				res.render('index.ejs', { userData: user, isAuthenticated: true });
			})
		}
	});

// LOG-IN USER
	app.get('/login', function(req, res){
		console.log(req.body);
	})

// SEND USER DATA / AUTHENTICATE
  app.get('/users/:id', function(req, res) {
  	if (!req.session.user_id) {
  		console.log(req.body);
  	}
  	else {
	  	users.findOne({_id: new ObjectID(session.user_id)}, function(err, result){
	  		res.json(result);
	  		req.session.user_id = null;
	  		console.log('hey hey');
	  	})
	  }

  });

// CREATE NEW USER
	app.post('/users', function(req, res){
		var createUser = function(data){
			var userData = defaultUser;
			userData.username = data.username;
			userData.email = data.email;
			userData.name = data.name;
			userData.passCrypt = bcrypt.hashSync(data.password);
			users.insert(userData, function(err, result){
				req.session.user_id = result._id;
				res.redirect('/');
			});
		}

		var error;
		if (req.body.password !== req.body.passwordConfirm || req.body.password.length < 7) {
			error = 'invalid password';
		}
		users.findOne({username: req.body.username}, function(err, result){
			if (result || error) {
				console.log('here')
				if (result) { 
					error = 'username unavailable';
				}
				res.json({ message: error });
			}
			else {
				createUser(req.body);
			}
		});
	})


// EDIT USER'S DROPLETS

	app.put('/users/:id/vessels', function(req, res){
		console.log(req.body)
	});

});
