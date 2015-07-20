var originY = 500;
// scroll to origin in main.js
var strokeGlobal = 0.5;

var scrollState = function(){
	var quadrant = (window.scrollY < originY) ? -1 : 1;
	return (window.scrollY - originY) * quadrant;
}


//~~~ RIPPLE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function Ripple(center, points, amplitude, bounds, color){
	this.color = color || '#00f';
	this.amplitude = amplitude;

	if (bounds) {
		var tl = bounds[0];
		var tr = bounds[1];
		var br = bounds[2];
		var bl = bounds[3];

		// Randomize size of curves within ripple
		var w = tr[0] - tl[0];
		var h = bl[1] - tl[1];
		var w1 = w * (0.2 + ((0.5 - Math.random()) * 0.07));
		var w2 = w * (0.2 + ((0.5 - Math.random()) * 0.07));
		var w3 = w * (0.2 + ((0.5 - Math.random()) * 0.07));
		var w4 = w * (0.2 + ((0.5 - Math.random()) * 0.07));
		var w5 = w - w1 - w2 - w3 - w4;
		var h1 = h * 0.3
		var h2 = h * 0.4
		var h3 = h * 0.3;

		var a = amplitude;
		var initX = 1.3;
		var initY = 1.3;
		var initMag = a * 1;

		// Point, Vector, Magnitude
		this.vertices = [
		//0
			{ p: [tl[0] - a, tl[1] - a], v: [1, -1 * initY], m: initMag},
		//1
			{ p: [tl[0] + w1, tl[1] - a], v: [initX, 1], m: initMag},
		//2
			{ p: [tl[0] + w1 + w2, tl[1] - a], v: [initX, -1], m: initMag},
		//3
			{ p: [tl[0] + w1 + w2 + w3, tl[1] - a], v: [initX, 1], m: initMag},
		//4
			{ p: [tl[0] + w1 + w2 + w3 + w4, tl[1] - a], v: [initX, -1], m: initMag},
		//5
			{ p: [tl[0] + w + a, tl[1] - a], v: [1, initY], m: initMag },
		//6
			// { p: [tr[0] + a, tr[1]], v: [1, 0], m: initMag },
		//7
			{ p: [tr[0] + a, tr[1] + h1], v: [-1, initY], m: initMag / 1.5},
		//8
			{ p: [tr[0] + a, tr[1] + h1 + h2], v: [1, initY], m: initMag / 1.5},
		//9
			{ p: [tr[0] + a, tr[1] + h + a], v: [-1, initY], m: initMag },
		//10
			// { p: [br[0], br[1] + a], v: [0, 1], m: initMag },
		//11
			{ p: [br[0] - w4, br[1] + a], v: [-1 * initX, -1], m: initMag},
		//12
			{ p: [br[0] - w4 - w1, br[1] + a], v: [-1 * initX, 1], m: initMag},
		//13
			{ p: [br[0] - w4 - w1 - w3, br[1] + a], v: [-1 * initX, -1], m: initMag},
		//14
			{ p: [br[0] - w4 - w1 - w3 - w2, br[1] + a], v: [-1 * initX, 1], m: initMag},
		//15
			{ p: [br[0] - w - a, br[1] + a], v: [-1, -1 * initY], m: initMag },
		//16 
			// { p: [bl[0] - a, bl[1]], v: [-1, 0], m: initMag },
		//17
			{ p: [bl[0] - a, bl[1] - h1], v: [1, -1 * initY], m: initMag / 1.5},
		//18
			{ p: [bl[0] - a, bl[1] - h1 - h2], v: [-1, -1 * initY], m: initMag / 1.5}
		//19
			// { p: [bl[0] - a, bl[1] - h], v: [1, 0], m: initMag }
		];
		// initial ROTATE vextor & AMP magnitude
		_.each(this.vertices, function(vertex){
			// vertex.m += this.amp(this.amplitude);
			// Vector methods from P5
			var v = createVector(vertex.v[0], vertex.v[1]);
			v.rotate(0.1 - (Math.random() * 0.2));
			vertex.v = [v.x, v.y];		
		}, this);
	}
	else {

	}
}
Ripple.prototype.amp = function(amplitude){
	return Math.random() * amplitude / 2 + amplitude;
}
Ripple.prototype.draw = function(){
	var vertices = this.vertices;
	// P5
	noFill();
	stroke(this.color);
	strokeWeight(strokeGlobal);
	for (var i = 0; i < vertices.length; i++) {
		var j = i + 1;
		if (i === vertices.length - 1) {
			j = 0;
		}
		var px1 = vertices[i].p[0];
		var py1 = vertices[i].p[1];
		var px2 = vertices[j].p[0];
		var py2 = vertices[j].p[1];

		var vec1 = createVector(vertices[i].v[0], vertices[i].v[1]);
		vec1.setMag(vertices[i].m);

		var vec2 = createVector(vertices[j].v[0], vertices[j].v[1]);
		vec2.setMag(vertices[j].m);
		vec2.rotate(PI);

		bezier(px1, py1, vec1.x + px1, vec1.y + py1, vec2.x + px2, vec2.y + py2, px2, py2);
	}
}

Ripple.prototype.oscillate = function(){

}


// ~~~ RIPPLE GROUP ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// scrollStart is the Y scroll-state at which the Ripple Group begins to animate
// scrollEnd is similar
// scrollFactor is a ratio comparing user scroll speed to the speed at which Ripple Group should grow
// highWaterMark tracks whether user has scrolled enough for new animation

// ~~~ RIPPLE GROUP ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function RippleGroup(domElement, scrollFactor, amplitude, color){
	this.el = document.querySelector(domElement);
	this.color = color;
	this.scrollStart = this.el.offsetTop - originY - 380;
	this.scrollEnd = this.scrollStart + this.el.offsetHeight + (380 * 2);
	this.scrollFactor = scrollFactor;
	this.highWaterMark = scrollState(); //default initial
	this.amplitude = amplitude || 20;

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
		var ripple = new Ripple(cen, null, this.amplitude, bounds, this.color);
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
	createCanvas(window.innerWidth, 4600);
  frameRate(30);
}

function draw() {  // draw() loops forever, until stopped
	clear();

	if (window.bodyOfWater) {
		bodyOfWater.forEach(function(rippleGroup){
			rippleGroup.ripples.forEach(function(ripple){
				ripple.draw();
				noLoop();
			})	
		});
	}

	// noFill()
	// stroke('#00f')
	// beginShape()
	// vertex(100, 500);
	// bezierVertex(100, 400, 300, 400, 400, 500)
	// bezierVertex(500,600,600,600,700,500)
	// endShape();

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