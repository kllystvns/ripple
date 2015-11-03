// 'var user' (User model) has been declared in EJS
var userView = new UserView({model: user});


var ponder = new Vessel(null, {category: 'ponder'});
var see = new Vessel(null, {category: 'see'});
var hear = new Vessel(null, {category: 'hear'});
var learn = new Vessel(null, {category: 'learn'});
var read = new Vessel(null, {category: 'read'});

user.vessels = [ponder, see, hear, learn, read];
user.vessels.forEach(function(vessel){
		var theseDroplets = _.where(window.droplets, {category: vessel.category});
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
	console.log('done')
	$('#loading').hide();

	$(window).on('scroll', function(e) {
		console.log(e)
		_.each($('.arrow-hint'), function(e) {
			e.remove();
		})
	})
}
window.onload = function(){
	$(window).scrollTop(originY - centerY);
	window.bodyOfWater = [];

	var ua = navigator.userAgent.toLowerCase();
	var isMobile = ua.search(/(iphone)|(ipod)|(android)/) !== -1;

	if (isMobile) {
	// function RippleGroup(domElement, scrollFactor, scrollEnd, growthFactor, amplitude, color)
		bodyOfWater.push(new RippleGroup('#user', null, null, null, null, '#a8b'));
		bodyOfWater.push(new RippleGroup('#ripple', 30, 3800, 30, null, '#98a'));
		bodyOfWater.push(new RippleGroup('#ponder', null, null, null, null, '#99b'));
		bodyOfWater.push(new RippleGroup('#see', null, null, null, null, '#99d'));
		bodyOfWater.push(new RippleGroup('#hear', null, null, null, null, '#79c'));
		bodyOfWater.push(new RippleGroup('#learn', null, null, null, null, '#6bb'));
		bodyOfWater.push(new RippleGroup('#read', null, null, null, null, '#5da'));
	}
	else {	
	// function RippleGroup(domElement, scrollFactor, scrollEnd, growthFactor, amplitude, color)
		bodyOfWater.push(new RippleGroup({
			domElement: '#user', 
			color: '#a8b',
			scrollStart: 70
		}));
		bodyOfWater.push(new RippleGroup({
			domElement: '#ripple', 
			scrollFactor: 40, 
			scrollEnd: 3800, 
			growthFactor: 30, 
			color: '#98a'
		}));
		bodyOfWater.push(new RippleGroup({
			domElement: '#ponder', 
			color: '#a8c'
		}));
		bodyOfWater.push(new RippleGroup({
			domElement: '#see', 
			color: '#98c'
		}));
		bodyOfWater.push(new RippleGroup({
			domElement: '#hear', 
			color: '#79d'
		}));
		bodyOfWater.push(new RippleGroup({
			domElement: '#learn',
			color: '#6bc'
		}));
		bodyOfWater.push(new RippleGroup({
			domElement: '#read', 
			color: '#6cb'
		}));
		bodyOfWater.push(new DOMRippleGroup({
			domElement: '.arrow-hint-0',
			domParentElement: '#ripple',
			numberOfRipples: 4,
			growthFactor: 9
		}));
		bodyOfWater.push(new DOMRippleGroup({
			domElement: '.arrow-hint-1',
			domParentElement: '#ripple',
			numberOfRipples: 4,
			growthFactor: 9
		}));
	}

	setTimeout(doneLoading, 10);
}






