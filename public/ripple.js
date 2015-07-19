var originY = 500;
// scroll to origin in main.js

var scrollState = function(){
	var quadrant = (window.scrollY < originY) ? -1 : 1;
	return (window.scrollY - originY) * quadrant;
}




function Ripple(center, points, bounds){
	var amp = function(){
		return Math.random() * 10 + 5;
	}
	if (bounds) {
		var tl = bounds[0];
		var tr = bounds[1];
		var br = bounds[2];
		var bl = bounds[3];

		var w = tr[0] - tl[0];
		var h = bl[1] - tl[1];
		var w1 = w * (0.33 );
		var w2 = w * (0.33 );
		var w3 = w - w1 - w2;
		var h1 = h * (0.5 );
		var h2 = h - h1;

		console.log(w,w1,w2,w3);
		console.log(h,h1,h2);

		this.points = [
		//1
			tl,
		//2
			[tl[0] + (w1 / 2), tl[1] - amp()],
		//3
			[tl[0] + w1, tl[1]],
		//4
			[tl[0] + w1 + (w2 / 2), tl[1] - amp()],
		//5
			[tl[0] + w1 + w2, tl[1]],
		//6 problem
			[tl[0] + w1 + w2 + (w3 / 2), tl[1] - amp()],
		//7
			tr,
		//8
			[tr[0] + amp(), tr[1] + (h1 / 2)],
		//9
			[tr[0], tr[1] + h1],
		//10
			[tr[0] + amp(), tr[1] + h1 + (h2 / 2)],
		//11
			br,
		//12
			[br[0] - (w1 / 2), br[1] + amp()],
		//13
			[br[0] - w1, br[1]],
		//14
			[br[0] - w1 - (w2 / 2), br[1] + amp()],
		//15
			[br[0] - w1 - w2, br[1]],
		//16 problem
			[br[0] - w1 - w2 - (w3 / 2), br[1] + amp()],
		//17
			bl,
		//18
			[bl[0] - amp(), bl[1] - (h1 / 2)],
		//19
			[bl[0], bl[1] - h1],
		//20
			[bl[0] - amp(), bl[1] - (h1 - (h2 / 2))],
		//21
			tl
		];
	}
	else {

	}
}
Ripple.prototype.getCurveVerteces = function(){
	var returnArray = [];
	returnArray.push(this.points[19]);
	this.points.forEach(function(e){
		returnArray.push(e);
	});
	returnArray.push(this.points[1]);

	return returnArray;
}

Ripple.prototype.oscillate = function(){

}

// scrollStart is the Y scroll-state at which the Ripple Group begins to animate
// scrollEnd is similar
// scrollFactor is a ratio comparing user scroll speed to the speed at which Ripple Group should grow
// highWaterMark tracks whether user has scrolled enough for new animation
function RippleGroup(domElement, scrollFactor){
	this.el = document.querySelector(domElement);
	this.scrollStart = this.el.offsetTop - originY - 380;
	this.scrollEnd = this.scrollStart + this.el.offsetHeight + (380 * 2);
	this.scrollFactor = scrollFactor;
	this.highWaterMark = scrollState(); //default initial

	// get div rectangle boundaries
	this.tl = function(){
		return [this.el.offsetLeft, this.el.offsetTop];
	};
	this.tr = function(){
		return [this.el.offsetLeft + this.el.offsetWidth, this.el.offsetTop];
	};
	this.br = function(){
		return [this.el.offsetLeft + this.el.offsetWidth, this.el.offsetTop + this.el.offsetHeight];
	};
	this.bl = function(){
		return [this.el.offsetLeft, this.el.offsetTop + this.el.offsetHeight];
	};
	this.center = function(){
		return [this.el.offsetLeft + (this.el.offsetWidth / 2), this.el.offsetLeft + (this.el.offsetWidth / 2)];
	};
	this.prevCenter = null;

	this.ripples = [];
}

RippleGroup.prototype.isActive = function(){
	return scrollState() > this.scrollStart && scrollState() < this.scrollEnd;
}


//needs to happen on scroll
RippleGroup.prototype.update = function(){
	if (this.isActive) {
		if (this.center() !== this.prevCenter) {
			this.nudgeRipples();
			this.prevCenter = this.center();
		}

		if (scrollState() > this.highWaterMark + this.scrollFactor) {
			this.highWaterMark = scrollState();
			this.makeRipple();
		}
		if (scrollState() < this.highWaterMark - this.scrollFactor) {
			this.highWaterMark = scrollState();
			this.removeRipple();
		}	
	}
}
RippleGroup.nudgeRipples = function(){
	var cen = this.center();
	for (var i = 0; i < this.ripples.length; i++) {
		this.ripples[i].newCenter(cen);
	}
}
RippleGroup.prototype.makeRipple = function(){
	var cen = this.center();
	if (this.ripples[0]) {
		var points = this.ripples[this.ripples.length - 1].points;
		var ripple = new Ripple(cen, points);
	}
	else {
		var bounds = [this.tl(), this.tr(), this.br(), this.bl()];
		var ripple = new Ripple(cen, null, bounds);
	}
	this.ripples.push(ripple);
}
RippleGroup.prototype.removeRipple = function(){
	this.ripples.pop();
}



//needs to happen on frame
RippleGroup.prototype.oscillate = function(){
	if (this.isActive) {
		for (var i = 0; i < this.ripples.length; i++) {
			this.ripples[i].oscillate();
		}
	}
}

function setup() {  // setup() runs once
	createCanvas(window.innerWidth, 4000);
  frameRate(30);
}

function draw() {  // draw() loops forever, until stopped
	
	if (window.ponderRipples) {
		ponderRipples.ripples.forEach(function(ripple){
			beginShape();
			stroke('#00f');
			strokeWeight(0.1);
			var vertex = ripple.getCurveVerteces();
			vertex.forEach(function(e){
				curveVertex(e[0], e[1]);
			})
			endShape();
		})
	}

	beginShape();
				stroke('#00f');
				strokeWeight(0.1);
	curveVertex(84,  91);
	curveVertex(84,  91);
	curveVertex(68,  19);
	curveVertex(21,  17);
	curveVertex(1000, 1000);
	curveVertex(1000, 1000);
	endShape();
}




	// $(window).on('mousewheel', function(event) {
	// 	// console.log(event)
	// 	if (event.originalEvent.wheelDeltaY < 0) {
	// 		for (var i = 0; i < Math.floor(Y.incFactor - 39); i++) {
	// 		var path = new Path();
	// 		path.strokeColor = Y.color;
	// 		path.strokeWidth = 0.5;

	// 		path.add(new Point(0, Y.g + Y._1));
	// 		path.add(new Point(vw() * 0.25, Y.g + Y._2));
	// 		path.add(new Point(vw() * 0.5, Y.g + Y._3));
	// 		path.add(new Point(vw() * 0.75, Y.g + Y._4));
	// 		path.add(new Point(vw(), Y.g + Y._5));
	// 		path.smooth();
	// 		view.update();

	// 		Y.increment();
	// 		}
	// 	}
	// 	else {

	// 	}
	// })









// paper.install(window);
// window.onload = function() {
// 	// Setup directly from canvas id:
// 	paper.setup('myCanvas');

// 	var path = new Path();
// 	path.strokeColor = 'black';
// 	var start = new Point(100, 100);
// 	path.moveTo(start);
// 	path.lineTo(start.add([ 200, -50 ]));
	


// 	var vw = function() {
// 		return view.size.width;
// 	}

// 	var vh = function() {
// 		return view.size.height;
// 	}

// 	function YFactor() {
// 		this.incFactor = 40;
// 		this.g = 0;
// 		this._1 = 0;
// 		this._2 = 0;
// 		this._3 = 0;
// 		this._4 = 0;
// 		this._5 = 0;
// 		this.green = 0;
// 		this.blue = 255;
// 		this.color = 'rgb(50,30,220)';
// 	}

// 	YFactor.prototype.increment = function(){
// 		this.incFactor += 0.01;
// 		this.g += 1 - (this.incFactor / 1.85);
// 		this._1 += 5 + (Math.random() * this.incFactor / 1.05);
// 		this._2 += 5 + (Math.random() * this.incFactor / 1.05);
// 		this._3 += 5 + (Math.random() * this.incFactor / 1.05);
// 		this._4 += 5 + (Math.random() * this.incFactor / 1.05);
// 		this._5 += 5 + (Math.random() * this.incFactor / 1.05);
// 		this.green += 0.2;
// 		this.blue -= 0.2;
// 		this.color = 'rgb(50,' + Math.floor(this.green) + ',' + Math.floor(this.blue) + ')';
// 	}

// 	var Y = new YFactor();
// 	Y.increment();

// 	var X = 0;


// 	$(window).on('mousewheel', function(event) {
// 		// console.log(event)
// 		if (event.originalEvent.wheelDeltaY < 0) {
// 			for (var i = 0; i < Math.floor(Y.incFactor - 39); i++) {
// 			var path = new Path();
// 			path.strokeColor = Y.color;
// 			path.strokeWidth = 0.5;

// 			path.add(new Point(0, Y.g + Y._1));
// 			path.add(new Point(vw() * 0.25, Y.g + Y._2));
// 			path.add(new Point(vw() * 0.5, Y.g + Y._3));
// 			path.add(new Point(vw() * 0.75, Y.g + Y._4));
// 			path.add(new Point(vw(), Y.g + Y._5));
// 			path.smooth();
// 			view.update();

// 			Y.increment();
// 			}
// 		}
// 		else {

// 		}
// 	})


// 	view.draw();
// } // window.onload