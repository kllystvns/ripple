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
window.onload = function(){
	$(window).scrollTop(originY);

	window.bodyOfWater = [];
	bodyOfWater.push(new RippleGroup('#ripple', 1, null, '#98b'));
	bodyOfWater.push(new RippleGroup('#user', 1, null, '#a8b'));
	bodyOfWater.push(new RippleGroup('#ponder', 1, null, '#99b'));
	bodyOfWater.push(new RippleGroup('#see', 1, null, '#99c'));
	bodyOfWater.push(new RippleGroup('#hear', 1, null, '#89b'));
	bodyOfWater.push(new RippleGroup('#learn', 1, null, '#7aa'));
	bodyOfWater.push(new RippleGroup('#read', 1, null, '#6ba'));

	bodyOfWater.forEach(function(rippleGroup){
		rippleGroup.makeRipple();
	});


	setTimeout(doneLoading, 10);
}