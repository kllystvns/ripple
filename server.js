// --- MONGO DB ---
var MongoDB = require('mongodb');
var MongoClient = MongoDB.MongoClient;
var ObjectID = MongoDB.ObjectID;
var MongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/ripple';
var defaultUser = require('./render_seed');

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
			console.log('gatekept')
			res.redirect('/session');
		}
		else {
			console.log('gateunkept')
			console.log('sessionid' + req.session.user_id)
			users.find({_id: new ObjectID(req.session.user_id)}).toArray(function(err, results){
				console.log(new ObjectID(req.session.user_id))
				console.log(results);
				var user = results[0];
				if (!user) {
					req.session.user_id = null;
					res.redirect('/');
				}
				res.render('index.ejs', { userData: user, isAuthenticated: true });
			})
		}
	});

// LOG-IN USER
	app.get('/session', function(req, res){
		console.log('get login', req.body);
		res.render('jumpIn.ejs', { isAuthenticated: false });
	})


// AUTHENTICATE USER
	app.post('/session', function(req, res){

		var authenticate = function(testPassword, passCrypt){
			return bcrypt.compareSync(testPassword, passCrypt);
		}



		users.findOne({username: req.body.username}, function(err, result){
			var error = 'username not found';
			console.log(req.body, result);
			if (result) {
				error = null;
				if (!(authenticate(req.body.password, result.passCrypt))) {
					console.log('righthere')
					error = 'incorrect password';
					res.json({ message: error });
				}
				else {
					req.session.user_id = result._id;
					res.redirect('/');
				}
			}
			else {
				res.json({ message: error });
			}
		});
	});

	app.delete('/session', function(req, res){
		req.session.user_id = null;
		console.log('destroyed')
		res.json({redirect: '/'});
	})

// CREATE NEW USER
	app.post('/users', function(req, res){
		var createUser = function(data){
			var userData = defaultUser;
			userData.username = data.username;
			userData.email = data.email;
			userData.name = data.name;
			userData.passCrypt = bcrypt.hashSync(data.password);
			users.insert(userData, function(err, result){
				console.log(err);
				console.log('create');
				result = result.ops[0];
				console.log()
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
					error = 'username is unavailable';
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
