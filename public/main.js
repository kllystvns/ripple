// 'user' (User model) and 'droplets' have been declared in EJS
var userView = new UserView({model: window.user});

var vessels = {};
var views = {};
['ponder', 'see', 'hear', 'learn', 'read'].forEach(function(category){
	vessels[category] = new Vessel(null, {category: category});

	views[category] = new VesselView({collection: vessels[category], el: '#' + category});
	
	var theseDroplets = _.where(window.droplets, {category: category});
	theseDroplets.forEach(function(dropData) {
		vessels[category].add(new Droplet(dropData));
	});
	vessels[category].needsNew();
});


var doneLoading = function() {
	console.log('done')
	$('#loading').remove();

	$(window).on('scroll', function(e) {
		_.each($('.arrow-hint'), function(e) {
			e.remove();
		})
	})
}
window.onload = function(){
	$(window).scrollTop(originY - centerY);
	window.bodyOfWater = [];

	// var ua = navigator.userAgent.toLowerCase();
	// var isMobile = ua.search(/(iphone)|(ipod)|(android)/) !== -1;
	
	// function RippleGroup(domElement, scrollFactor, scrollEnd, growthFactor, amplitude, color)
	bodyOfWater.push(new RippleGroup({
		domElement: '#user', 
		color: '#a8b',
		scrollStart: 70
	}));
	bodyOfWater.push(new RippleGroup({
		domElement: '#ripple', 
		scrollFactor: 40,
		scrollStart: 1, 
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

	setTimeout(doneLoading, 10);
}







