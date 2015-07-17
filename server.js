// --- MONGO DB ---
var MongoDB = require('mongodb');
var MongoClient = MongoDB.MongoClient;
var ObjectID = MongoDB.ObjectID;
var MongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/ripple';
var defaultDroplets = require('./render_seed');

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



// --- SERVER ---
MongoClient.connect(MongoURI, function(err, db) {
	if (err) { throw err };

	var Users = db.collection('users');
	var Droplets = db.collection('droplets');
	var clone = function(object){
		var newObject = {}
		for (attr in object) {
			newObject[attr] = object[attr];
		}
		return newObject;
	}


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
			Users.find({_id: new ObjectID(req.session.user_id)}).toArray(function(err, results){
				var user = results[0];
				if (!user) {
					req.session.user_id = null;
					res.redirect('/session');
				}
				Droplets.find({user_id: new ObjectID(req.session.user_id)}).toArray(function(err, results){
					var droplets = results;
					console.log(droplets)
					res.render('index.ejs', { userData: user, dropletsData: droplets, isAuthenticated: true });
				})
			})
		}
	});

// SHOW LOG-IN
	app.get('/session', function(req, res){
		console.log('get login', req.body);
		res.render('jumpIn.ejs', { isAuthenticated: false });
	})


// AUTHENTICATE USER
	app.post('/session', function(req, res){
		var authenticate = function(testPassword, passCrypt){
			return bcrypt.compareSync(testPassword, passCrypt);
		}
		Users.findOne({username: req.body.username}, function(err, result){
			var error = 'username not found';
			console.log(req.body.username, result);
			if (result) {
				error = null;
				if (!(authenticate(req.body.password, result.passCrypt))) {
					console.log('righthere')
					error = 'incorrect password';
					res.json({ message: error });
				}
				else {
					req.session.user_id = result._id;
					res.json({redirect: '/'});
				}
			}
			else {
				res.json({ message: error });
			}
		});
	});

	app.delete('/session', function(req, res){
		req.session.user_id = null;
		res.json({redirect: '/'});
	})

// CREATE NEW USER
	app.post('/users', function(req, res){
		var error;
		if (req.body.password !== req.body.passwordConfirm || req.body.password.length < 7) {
			error = 'invalid password';
		}
		Users.findOne({username: req.body.username}, function(err, result){
			if (result || error) {
				console.log('here')
				if (result || req.body.username === '') { 
					error = 'username is unavailable';
				}
				res.json({ message: error });
			}
			else {
				createUser(req.body);
			}
		});

		var createUser = function(data){
			var userData = {};
			userData.username = data.username;
			userData.email = data.email;
			userData.name = data.name;
			var salt = bcrypt.genSaltSync(10);
			userData.passCrypt = bcrypt.hashSync(data.password, salt);
			Users.insert(userData, function(err, result){
				result = result.ops[0];
				req.session.user_id = result._id;

				var dropletsData = [];
				for (var i = 0; i < defaultDroplets.length; i++) {
					var drop = clone(defaultDroplets[i].user_id);
					drop.user_id = result._id;
					dropletsData.push(drop);
				}
				Droplets.insert(dropletsData, function(){
					res.json({redirect: '/'});
				})
			});
		}
	})


// CREATE A NEW DROPLET
	app.post('/droplets', function(req, res){
		var dropletData = req.body;
		dropletData.user_id = new ObjectID(req.session.user_id);
		Droplets.insert(dropletData, function(err, result){
			var result = result.ops[0];
			res.json(result);
			console.log(result);
		})
	})


// EDIT USER'S DROPLETS

	app.put('/droplets/:id', function(req, res){
		console.log(req.params)

		Droplets.remove({_id: new ObjectID(req.body._id)}, function(){
			res.json({type: 'uninstantiated', category: req.body.category});
		})
	});

});














