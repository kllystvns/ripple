var bcrypt = require('bcrypt-nodejs');

var salt = bcrypt.genSaltSync(10);
var passCrypt = bcrypt.hashSync('password', salt);
var userData = [
	{
		username: 'kllystvns',
		passCrypt: passCrypt,
		email: 'kllystnvspratt@gmail.com',
		name: 'Kelly Stevens',
	},
	{
		username: 'letthehatersbegin',
		passCrypt: passCrypt,
		email: 'sprackk@gmail.com',
		name: 'Let the Haters Begin',
	}
]
var dropletData = [
	{category: 'ponder', type: 'quote', text: 'From a drop of water, a logician could infer the possibility of an Atlantic or a Niagara without having seen or heard of one or the other.', author: 'Arthur Conan Doyle'},
	{category: 'ponder', type: 'quote', text: 'All the rivers run into the sea; yet the sea is not full; unto the place from whence the rivers come, thither they return again.', author: 'Ecclesiastes 1:7'},
	{category: 'see', type: 'link', name: 'aoto ouchi', url: 'http://aotooouchi.tumblr.com'},
	{category: 'see', type: 'link', name: 'rhizome', url: 'http://rhizome.org'},
	{category: 'see', type: 'link', name: 'deep dream', url: 'http://gizmodo.com/googles-dream-robot-is-running-wild-across-the-internet-1715839224'},
	{category: 'hear', type: 'soundcloud', url: 'https://soundcloud.com/berlincommunityradio/agatha-inex-fermenting-thoughts'},
	{category: 'learn', type: 'link', name: 'complex plane', url: 'https://en.wikipedia.org/wiki/Complex_plane'},
	{category: 'learn', type: 'link', name: '3d printing and gaudi\'s sagrada familia', url: 'http://www.designboom.com/art/projection-on-the-facade-of-gaudis-sagrada-familia-by-moment-factory/'},
	{category: 'read', type: 'link', name: 'a midsummer night\'s dream', url: 'https://en.wikipedia.org/wiki/A_Midsummer_Night%27s_Dream'},
	{category: 'read', type: 'link', url: 'http://www.newyorker.com/books/page-turner/no-longer-getting-lost-at-the-strand?intcid=mod-latest'}
]


var MongoDB = require('mongodb');
var MongoClient = MongoDB.MongoClient;
var MongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/ripple';


MongoClient.connect(MongoURI, function(err, db) {
	if (err) { throw (err) };

	db.collection('users').remove({});
	db.collection('users').insert(userData, function(err, results){

		var users = results.ops;
		var droplets = []
		var clone = function(object){
			var newObject = {}
			for (attr in object) {
				newObject[attr] = object[attr];
			}
			return newObject;
		}
		for (var i = 0; i < users.length; i++) {
			for (var j = 0; j < dropletData.length; j++) {
				var drop = clone(dropletData[j]);
				drop.user_id = users[i]._id
				droplets.push(drop);
			}
		}
		
		db.collection('droplets').remove({});
		db.collection('droplets').insert(droplets, function(){
			db.close();
		})
	});

})

