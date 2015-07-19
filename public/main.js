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

	window.ponderRipples = new RippleGroup('#ponder', 1);
	ponderRipples.makeRipple();

	// function setup() {  // setup() runs once
	// 	createCanvas(window.innerWidth, 4000);
	//   frameRate(30);
	// }

	// function draw() {  // draw() loops forever, until stopped
		
	// 	ponderRipples.ripples.forEach(function(ripple){
	// 		beginShape();
	// 		stroke('#00f');
	// 		strokeWeight(0.1);
	// 		var vertex = ripple.getCurveVerteces();
	// 		vertex.forEach(function(e){
	// 			curveVertex(e[0], e[1]);
	// 		})
	// 		endShape();
	// 	})

	// 	beginShape();
	// 				stroke('#00f');
	// 				strokeWeight(0.1);
	// 	curveVertex(84,  91);
	// 	curveVertex(84,  91);
	// 	curveVertex(68,  19);
	// 	curveVertex(21,  17);
	// 	curveVertex(1000, 1000);
	// 	curveVertex(1000, 1000);
	// 	endShape();
	// }


	setTimeout(doneLoading, 10);
}