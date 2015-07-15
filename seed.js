var bcrypt = require('bcrypt-nodejs');

var passCrypt = bcrypt.hashSync('password');
var data = [
	{
		username: 'kllystnvs',
		passCrypt: passCrypt,
		email: 'kllystnvspratt@gmail.com',
		name: 'Kelly Stevens',
		ponder: 
			{items: [
				{type: 'quote', text: 'From a drop of water, a logician could infer the possibility of an Atlantic or a Niagara without having seen or heard of one or the other.', author: 'Arthur Conan Doyle'},
				{type: 'quote', text: 'All the rivers run into the sea; yet the sea is not full; unto the place from whence the rivers come, thither they return again.', author: 'Ecclesiastes 1:7'},
			]},
		see: 
			{items: [
				{type: 'link', name: 'aoto ouchi', url: 'http://aotooouchi.tumblr.com'},
				{type: 'link', name: 'rhizome', url: 'http://rhizome.org'},
				{type: 'link', name: 'deep dream', url: 'http://gizmodo.com/googles-dream-robot-is-running-wild-across-the-internet-1715839224'}
			]},
		hear: 
			{items: [
				{type: 'soundcloud', url: 'https://soundcloud.com/berlincommunityradio/agatha-inex-fermenting-thoughts'}
			]},
		learn: 
			{items: [
				{type: 'link', name: 'complex plane', url: 'https://en.wikipedia.org/wiki/Complex_plane'},
				{type: 'link', name: '3d printing and gaudi\'s sagrada familia', url: 'http://www.designboom.com/art/projection-on-the-facade-of-gaudis-sagrada-familia-by-moment-factory/'}
			]},
		read: 
			{items: [
				{type: 'link', name: 'a midsummer night\'s dream', url: 'https://en.wikipedia.org/wiki/A_Midsummer_Night%27s_Dream'},
				{type: 'link', url: 'http://www.newyorker.com/books/page-turner/no-longer-getting-lost-at-the-strand?intcid=mod-latest'}
			]}
	},
	{
		username: 'letthehatersbegin',
		passCrypt: passCrypt,
		email: 'sprackk@gmail.com',
		name: 'Let the Haters Begin',
		ponder: 
			{items: [
				{type: 'quote', text: 'From a drop of water, a logician could infer the possibility of an Atlantic or a Niagara without having seen or heard of one or the other.', author: 'Arthur Conan Doyle'},
				{type: 'quote', text: 'All the rivers run into the sea; yet the sea is not full; unto the place from whence the rivers come, thither they return again.', author: 'Ecclesiastes 1:7'},
			]},
		see: 
			{items: [
				{type: 'link', name: 'aoto ouchi', url: 'http://aotooouchi.tumblr.com'},
				{type: 'link', name: 'rhizome', url: 'http://rhizome.org'},
				{type: 'link', name: 'deep dream', url: 'http://gizmodo.com/googles-dream-robot-is-running-wild-across-the-internet-1715839224'}
			]},
		hear: 
			{items: [
				{type: 'soundcloud', url: 'https://soundcloud.com/berlincommunityradio/agatha-inex-fermenting-thoughts'}
			]},
		learn: 
			{items: [
				{type: 'link', name: 'complex plane', url: 'https://en.wikipedia.org/wiki/Complex_plane'},
				{type: 'link', name: '3d printing and gaudi\'s sagrada familia', url: 'http://www.designboom.com/art/projection-on-the-facade-of-gaudis-sagrada-familia-by-moment-factory/'}
			]},
		read: 
			{items: [
				{type: 'link', name: 'a midsummer night\'s dream', url: 'https://en.wikipedia.org/wiki/A_Midsummer_Night%27s_Dream'},
				{type: 'link', url: 'http://www.newyorker.com/books/page-turner/no-longer-getting-lost-at-the-strand?intcid=mod-latest'}
			]}
	}
]


var MongoDB = require('mongodb');
var MongoClient = MongoDB.MongoClient;
var MongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/ripple';


MongoClient.connect(MongoURI, function(err, db) {
	if (err) { throw (err) };

	db.collection('users').remove({});
	for (var i = 0; i < data.length; i++) {
		db.collection('users').insert(data[i], function(err, results) {
			//handle db error
			if (i >= data.length - 1) {
				db.close();
			}
		})
	}

})


// Default data / 'suggested' links for home screen
module.exports = 	{
	username: 'NewUser',
	name: 'New User',
	ponder: 
		{items: [
			{type: 'quote', text: 'From a drop of water, a logician could infer the possibility of an Atlantic or a Niagara without having seen or heard of one or the other.', author: 'Arthur Conan Doyle'},
			{type: 'quote', text: 'All the rivers run into the sea; yet the sea is not full; unto the place from whence the rivers come, thither they return again.', author: 'Ecclesiastes 1:7'},
		]},
	see: 
		{items: [
			{type: 'link', name: 'aoto ouchi', url: 'http://aotooouchi.tumblr.com'},
			{type: 'link', name: 'rhizome', url: 'http://rhizome.org'},
			{type: 'link', name: 'deep dream', url: 'http://gizmodo.com/googles-dream-robot-is-running-wild-across-the-internet-1715839224'}
		]},
	hear: 
		{items: [
			{type: 'soundcloud', url: 'https://soundcloud.com/berlincommunityradio/agatha-inex-fermenting-thoughts'}
		]},
	learn: 
		{items: [
			{type: 'link', name: 'complex plane', url: 'https://en.wikipedia.org/wiki/Complex_plane'},
			{type: 'link', name: '3d printing and gaudi\'s sagrada familia', url: 'http://www.designboom.com/art/projection-on-the-facade-of-gaudis-sagrada-familia-by-moment-factory/'}
		]},
	read: 
		{items: [
			{type: 'link', name: 'a midsummer night\'s dream', url: 'https://en.wikipedia.org/wiki/A_Midsummer_Night%27s_Dream'},
			{type: 'link', url: 'http://www.newyorker.com/books/page-turner/no-longer-getting-lost-at-the-strand?intcid=mod-latest'}
		]}
}
