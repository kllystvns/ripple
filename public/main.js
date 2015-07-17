// 'var user' (User model) has been declared in EJS
var userView = new UserView({model: user});


var ponder = new Vessel(null, {category: 'ponder'});
var see = new Vessel(null, {category: 'see'});
var hear = new Vessel(null, {category: 'hear'});
var learn = new Vessel(null, {category: 'learn'});
var read = new Vessel(null, {category: 'read'});

user.vessels = [ponder, see, hear, learn, read];
user.vessels.forEach(function(vessel){
		var theseDroplets = _.where(droplets, {category: vessel.category});
		for (var i = 0; i < 5; i++) {
			if (theseDroplets[i]) {
				vessel.add(new Droplet(theseDroplets[i]));
			}
			else {
				vessel.add(new Droplet({type: 'uninstantiated', category: vessel.category}));
			}
		}
})

var ponderView = new PonderView({collection: ponder});
var seeView = new SeeView({collection: see});
var hearView = new HearView({collection: hear});
var learnView = new LearnView({collection: learn});
var readView = new ReadView({collection: read});

var doneLoading = function() {
	$('#loading').hide();
}

setTimeout(doneLoading, 1000);