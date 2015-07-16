// 'var user' (User model) has been declared in EJS
var userView = new UserView({model: user});


var ponder = new Vessel({droplets: user.attributes.ponder.droplets, category: 'ponder'});
var see = new Vessel({droplets: user.attributes.see.droplets, category: 'see'});
var hear = new Vessel({droplets: user.attributes.hear.droplets, category: 'hear'});
var learn = new Vessel({droplets: user.attributes.learn.droplets, category: 'learn'});
var read = new Vessel({droplets: user.attributes.read.droplets, category: 'read'});

user.vessels = new VesselCollection(ponder, see, hear, learn, read);

var ponderView = new PonderView({model: ponder});
var seeView = new SeeView({model: see});
var hearView = new HearView({model: hear});
var learnView = new LearnView({model: learn});
var readView = new ReadView({model: read});

var doneLoading = function() {
	$('#loading').hide();
}

setTimeout(doneLoading, 1000);