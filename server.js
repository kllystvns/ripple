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

	app.listen(port);

	var Users = db.collection('users');
	var Droplets = db.collection('droplets');
	var clone = function(object){
		var newObject = {}
		for (var attr in object) {
			newObject[attr] = object[attr];
		}
		return newObject;
	}

// LANDING PAGE & AUTHENTICATION

	app.get('/', function(req, res) {
	// UNAUTHENTICATED or NEW USER
		if (!req.session.user_id) {
			console.log('gatekept')
			res.redirect('/session');
		}
	// AUTHENTICATED
		else {
			console.log('gateunkept')
			console.log('sessionid' + req.session.user_id)
			Users.find({_id: new ObjectID(req.session.user_id)}, {passCrypt: 0}).toArray(function(err, results){
				var user = results[0];
				if (!user) {
					req.session.user_id = null;
					res.redirect('/session');
				}
				Droplets.find({user_id: new ObjectID(req.session.user_id)}).toArray(function(err, results){
					var droplets = results;
	console.log(results)
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

		var createUser = function(data){
			var userData = {};
			userData.username = data.username;
			userData.email = data.email;
			userData.name = data.name;
			userData.userMode = data.userMode;
			var salt = bcrypt.genSaltSync(10);
			userData.passCrypt = bcrypt.hashSync(data.password, salt);
			Users.insert(userData, function(err, result){
				result = result.ops[0];
				req.session.user_id = result._id;

				var dropletsData = [];
				for (var i = 0; i < defaultDroplets.length; i++) {
					var drop = clone(defaultDroplets[i]);
					drop.user_id = result._id;
					dropletsData.push(drop);
				}
				Droplets.insert(dropletsData, function(){
					res.json({redirect: '/'});
				})
			});
		}

		// NEW GUEST/ANONYMOUS USER
		if (req.body.userMode === 'guest') {
			var data = req.body;
			data.username = null;
			data.email = null;
			data.password = 'password';
			data.userMode = 'guest';
			createUser(data);
		}
		// NEW FULL USER
		else {
			var error;
			if (req.body.password !== req.body.passwordConfirm || req.body.password.length < 7) {
				error = 'invalid password';
			}
			Users.findOne({username: req.body.username}, function(err, result){
				if (result || error) {
					if (result || req.body.username === '') { 
						error = 'username is unavailable';
					}
					res.json({ message: error });
				}
				else {
					var data = req.body;
					data.userMode = 'full';
					createUser(data);
				}
			});
		}
	})

// UPDATE USER
	app.put('/users/:id', function(req, res){

		var updateUser = function(data){
			var newUserData = {};
			for (attr in data) {
				if (['username', 'email', 'name'].indexOf(attr) > -1) {
					if (data[attr] !== '') {
						newUserData[attr] = data[attr];
					}
				}
			}
			newUserData.userMode = 'full';
			if (data.password) {
				var salt = bcrypt.genSaltSync(10);
				newUserData.passCrypt = bcrypt.hashSync(data.password, salt);
			}
			Users.updateOne(
				{_id: new ObjectID(req.session.user_id)},
				{$set: newUserData},
				function(err, result){
					Users.find({_id: new ObjectID(req.session.user_id)}, {passCrypt: 0}).toArray(function(err, results){
						var user = results[0];
						res.json({user: user});
					});
				}
			);
		}

		var error;
		if (req.body.password && (req.body.password !== req.body.passwordConfirm || req.body.password.length < 7)) {				
			error = 'invalid password';
		}
		if (req.body.username) {
			Users.findOne({username: req.body.username}, function(err, result){
				if (result || error) {
					if (result) { 
						error = 'username is unavailable';
					}
					res.json({ message: error });
				}
				else {
					updateUser(req.body);
				}
			});
		} else {
			if (error) {
				res.json({ message: error });
			} else {
				updateUser(req.body);
			}
		}

	})



// CREATE A NEW DROPLET
	app.post('/droplets', function(req, res){
		var dropletData = req.body;
		dropletData.user_id = new ObjectID(req.session.user_id);
		Droplets.insert(dropletData, function(err, result){
			var result = result.ops[0];
			res.json(result);
		})
	})


// DELETE A DROPLET
	app.delete('/droplets/:id', function(req, res){
		Droplets.remove({_id: new ObjectID(req.params.id)}, function(err, result){
			res.json({status: 'success'});
		});
	});

});














