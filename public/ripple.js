var originY = 1000;
var centerY = window.innerHeight / 2
// scroll to origin in main.js
var strokeGlobal = 0.9;
var strokeGlobalMax = 1.7;

var getScrollState = function(){
	var scrollState = window.scrollY + centerY;
	var quadrant = (scrollState < originY) ? -1 : 1;
	return (scrollState - originY) * quadrant;
}


//~~~ RIPPLE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// attributes: center, growthFactor, vertices, amplitude, bounds, color
function Ripple(attributes){
	this.phase = 0;
	this.opacity = 1;
	this.growthFactor = attributes.growthFactor;
	this.color = attributes.color || '#00f';
	this.stroke = attributes.stroke - 0.1;
	this.stroke < strokeGlobal ? (this.stroke = strokeGlobal) : null;
	this.amplitude = attributes.amplitude;
	this.path = document.createElementNS('http://www.w3.org/2000/svg','path');
	var svg = document.querySelector('#svg-group');
	svg.appendChild(this.path);

	// if this is the first ripple, then create shape
	if (attributes.bounds) {
		this.index = 0;
		this.opacity = 0;

		var bounds = attributes.bounds;
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

		var a = this.amplitude;
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
			{ p: [tr[0] + a, tr[1] + h1], v: [-1, initY], m: initMag / 1.5},
		//7
			{ p: [tr[0] + a, tr[1] + h1 + h2], v: [1, initY], m: initMag / 1.5},
		//8
			{ p: [tr[0] + a, tr[1] + h + a], v: [-1, initY], m: initMag },
		//9
			{ p: [br[0] - w4, br[1] + a], v: [-1 * initX, -1], m: initMag},
		//10
			{ p: [br[0] - w4 - w1, br[1] + a], v: [-1 * initX, 1], m: initMag},
		//11
			{ p: [br[0] - w4 - w1 - w3, br[1] + a], v: [-1 * initX, -1], m: initMag},
		//12
			{ p: [br[0] - w4 - w1 - w3 - w2, br[1] + a], v: [-1 * initX, 1], m: initMag},
		//13
			{ p: [br[0] - w - a, br[1] + a], v: [-1, -1 * initY], m: initMag },
		//14
			{ p: [bl[0] - a, bl[1] - h1], v: [1, -1 * initY], m: initMag / 1.5},
		//15
			{ p: [bl[0] - a, bl[1] - h1 - h2], v: [-1, -1 * initY], m: initMag / 1.5}
		];

		// // initial ROTATE vextor & AMP magnitude
		// _.each(this.vertices, function(vertex){
		// 	// vertex.m += this.amp(this.amplitude);

		// 	// Vector methods from P5
		// 	var vector = createVector(vertex.v[0], vertex.v[1]);
		// 	vector.rotate(0.1 - (Math.random() * 0.2));
		// 	vertex.v = [vector.x, vector.y];		
		// }, this);
	}
	else {
		this.index = -1;
		this.vertices = this.expand(attributes.center, attributes.vertices, attributes.growthFactor);
	}
}
Ripple.prototype.expand = function(center, prevVertices, growthFactor){
		// creates duplicate object literal
		var vertices = prevVertices.map(function(vert){
			var copy = {p: [], v: [], m: null};
			copy.p[0] = vert.p[0];
			copy.p[1] = vert.p[1];
			copy.v[0] = vert.v[0];
			copy.v[1] = vert.v[1];
			copy.m = vert.m;
			return copy;
		});
		var c = center;
		for (var i = 0; i < vertices.length; i++){
			var dVector = [vertices[i].p[0] - c[0], (vertices[i].p[1] - c[1])];
			var angle = Math.atan2(dVector[1], dVector[0]);
			gVector = [Math.cos(angle), Math.sin(angle)];
			gVector[0] *= growthFactor;
			gVector[1] *= (growthFactor);

			vertices[i].p[0] += gVector[0];
			vertices[i].p[1] += gVector[1];
		}
		return vertices;
}
Ripple.prototype.oscillate = function(center){
	var oscillateFactor = this.growthFactor * (Math.sin(this.phase) * 0.5 + 0.8);
	this.phase += 0.157;
	this.oscVertices = this.expand(center, this.vertices, oscillateFactor);
}
Ripple.prototype.amp = function(amplitude){
	return Math.random() * amplitude / 2 + amplitude;
}
Ripple.prototype.evaporate = function(){
	this.path.remove();
}
Ripple.prototype.draw = function(){
	var verts = this.oscVertices;

	// (vector, point, magnitude, difference)
	var addVector = function(vx,vy,px,py,m) {
		var dx = vx * m;
		var x = px + dx;
		var dy = vy * m;
		var y = py + dy;
		// returns string
		return x + ' ' + y;
	}

	// Generate SVG Bezier curve syntax

	// Moveto initial point
	var M_xy = verts[0].p.join(' ');

	// Curveto from 1st point to 2nd point
	var C_cxcy_cxcy_xy;
	var _cxcy1 = addVector(verts[0].v[0], verts[0].v[1], verts[0].p[0], verts[0].p[1], verts[0].m);
	var _cxcy2 = addVector(-1 * verts[1].v[0], -1 * verts[1].v[1], verts[1].p[0], verts[1].p[1], verts[1].m); 
	var _xy = verts[1].p.join(' ');
	var C_cxcy_cxcy_xy = _cxcy1 + ' ' + _cxcy2 + ' ' + _xy; 

	// Curveto (shorthand) to subsequent points
	var S_cxcy_xy_array = [];
	for (var i = 2; i < verts.length + 1; i++) {
		var j = (i === verts.length ? 0 : i);
		var _xy = verts[j].p.join(' ');
		var _cxcy = addVector(-1 * verts[j].v[0], -1 * verts[j].v[1], verts[j].p[0], verts[j].p[1], verts[j].m);
		
		S_cxcy_xy_array.push('S ' + _cxcy + ' ' + _xy);
	}
	var S_cxcy_xy = S_cxcy_xy_array.join(' ');

	var data = 'M ' + M_xy + ' C ' + C_cxcy_cxcy_xy + ' ' + S_cxcy_xy;

	this.path.setAttribute('stroke', this.color);
	this.path.setAttribute('stroke-width', this.stroke);
	this.path.setAttribute('fill', 'none');
	// this.path.style.opacity = this.opacity;
	this.path.setAttribute('d', data);
	return this.path;
}


// ~~~ RIPPLE GROUP ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// scrollStart is the Y scroll-state at which the Ripple Group begins to animate
// scrollEnd is similar
// scrollFactor is a ratio comparing user scroll speed to the speed at which Ripple Group should grow
// highWaterMark tracks whether user has scrolled enough for new animation

// ~~~ RIPPLE GROUP ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function RippleGroup(attributes){
	this.el = document.querySelector(attributes.domElement);
	this.color = attributes.color;
	this.scrollStart = attributes.scrollStart || this.el.offsetTop - originY - 720;
	this.scrollEnd = attributes.scrollEnd || this.scrollStart + this.el.offsetHeight + (720 * 2);
	
	this.scrollFactor = attributes.scrollFactor || 50;
	this.highWaterMark = getScrollState(); //default initial
	this.prevGrowthFactor = attributes.growthFactor || 14;
	this.growthFactor = function(){
		return this.prevGrowthFactor * (1 + (this.ripples.length / 22))
	}
	this.amplitude = attributes.amplitude || 20;

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
		return [this.el.offsetLeft + (this.el.offsetWidth / 2), this.el.offsetTop + (this.el.offsetHeight / 2)];
	};
	this.prevCenter = null;

	this.ripples = [];
}

RippleGroup.prototype.isActive = function(){
	return getScrollState() > this.scrollStart && getScrollState() < this.scrollEnd;
}


//needs to happen on scroll
RippleGroup.prototype.update = function(){
	if (this.isActive()) {
		if (this.center() !== this.prevCenter) {
		// NOT READY YET
			this.nudgeRipples();
			this.prevCenter = this.center();
		}

		if (getScrollState() > this.highWaterMark + this.scrollFactor) {
			this.highWaterMark = Math.floor(getScrollState() / this.scrollFactor) * this.scrollFactor;
			this.makeRipple();
		}
		if (getScrollState() < this.highWaterMark) {
			this.highWaterMark = Math.floor(getScrollState() / this.scrollFactor) * this.scrollFactor;
			this.removeRipple();
		}
	}
}
// NOT READY YET
RippleGroup.prototype.nudgeRipples = function(){
	var cen = this.center();
	for (var i = 0; i < this.ripples.length; i++) {
		// this.ripples[i].newCenter(cen);
	}
}
//function Ripple(center, growthFactor, vertices, amplitude, bounds, color)
RippleGroup.prototype.makeRipple = function(){
	var attrs = {};
	attrs.center = this.center();
	attrs.color = this.color;
	attrs.amplitude = this.amplitude;
	if (this.ripples[0]) {
		var prevRipple = this.ripples[this.ripples.length - 1];
		attrs.stroke = prevRipple.stroke;
		attrs.vertices = prevRipple.vertices;
		attrs.growthFactor = this.growthFactor();
		var ripple = new Ripple(attrs);
		if (this.ripples[1]) {
			_.last(this.ripples).index = 1;
		}
	}
	else {
		attrs.stroke = strokeGlobalMax;
		attrs.bounds = [this.tl(), this.tr(), this.br(), this.bl()];
		attrs.growthFactor = this.growthFactor();
		var ripple = new Ripple(attrs);
	}
	this.ripples.push(ripple);
}
RippleGroup.prototype.removeRipple = function(){
	if (this.ripples[0]) {
		_.last(this.ripples).evaporate();
		this.ripples.pop();
		if (this.ripples[0]) {
			_.last(this.ripples).index = -1;
		}
	}
}

//~~~ DOM ELEMENT RIPPLE ANIMATION ~~~~~~~~~~~~~~~~~~~
// applied to DOM element instead of SVG path

function DOMRipple(attributes) {
	this.growthFactor = attributes.growthFactor;
	this.index = attributes.index;
	this.phase = 0;
	this.translate = 0;
	this.frequency = attributes.frequency || 0.157;

	// REPLICATE 'DUMMY' DOM ELEMENT TO PERFORM TRANSFORMATIONS
	this.el = document.createElement('div');
	this.dummyEl = attributes.domElement;
	this.dummyEl.parentElement.appendChild(this.el);
	this.el.outerHTML = this.dummyEl.outerHTML;
	// outerHTML replaces original dom node with new dom node
	var newEl = _.last(this.dummyEl.parentElement.children);
	this.el = newEl;
	// 'Parent' element for animation may not be the immediate parent
	this.parentEl = attributes.parentEl;

	this.el.style.width = '100%'
	this.el.style.position = 'absolute';
	this.el.style.top = this.dummyEl.offsetTop + 'px';
	this.el.style.left = this.dummyEl.offsetLeft + 'px';
	this.el.style.opacity = 0.9 - (this.index / 5);
	for (prop in attributes.styles) {
		console.log(64)
		this.el.style[prop] = attributes.styles[prop];
	}

}
DOMRipple.prototype.center = function(domElement) {
	var rect = domElement.getBoundingClientRect();
	var center = new Point([
		// x
		rect.left + (rect.width / 2),
		// y
		rect.top + (rect.height / 2)
	]);
	return center;
}
DOMRipple.prototype.oscillate = function(center) {
	var oscillateFactor = this.growthFactor * Math.sin(this.phase) * (this.index + 1);
	this.phase += this.frequency;
	if (this.phase > 3.14) {
		this.phase = 0;
	}
	this.translate = this.expand(oscillateFactor);	
}
DOMRipple.prototype.expand = function(growthFactor) {
	var origin = this.center(this.dummyEl);
	var parentCenter = this.center(this.parentEl);
	var translateVector = new Vector({initial: parentCenter, terminal: origin});
	// console.log(translateVector)
	translateVector.setMagnitude(growthFactor);

	return translateVector;
}
DOMRipple.prototype.draw = function() {
	var x = this.translate.coordinates.x;
	var y = this.translate.coordinates.y;
	var transformString = 'translate(' + x + 'px,' + y + 'px)';

	this.el.style.transform = transformString;
}


function DOMRippleGroup(attributes) {
	this.parentEl = document.querySelector(attributes.domParentElement);
	this.el = document.querySelector(attributes.domElement);
	this.growthFactor = attributes.growthFactor;

	this.ripples = [];
	for (var i = 0; i < attributes.numberOfRipples; i++) {
		var attrs = {
			growthFactor: this.growthFactor,
			domElement: this.el,
			parentEl: this.parentEl,
			styles: attributes.styles,
			frequency: attributes.frequency,
			index: i
		}
		var domRipple = new DOMRipple(attrs);
		this.ripples.push(domRipple);
	}
}
DOMRippleGroup.prototype.center = function() {
	var center = new Point([
		// x
		this.parentEl.offsetLeft + (this.parentEl.offsetWidth / 2),
		// y
		this.parentEl.offsetTop + (this.parentEl.offsetHeight / 2)
	]);
	return center;
}
DOMRippleGroup.prototype.update = function() {
	this.ripples.forEach(function(domRipple) {
		//domRipple.oscillate();
		//domRipple.draw();
	});
}
DOMRippleGroup.prototype.render = function() {
	this.ripples.forEach(function(domRipple) {
		//domRipple.oscillate();
		//domRipple.draw();
	});
}



function Point(dataArray) {
	this.x = dataArray[0];
	this.y = dataArray[1]
}
function BezierPoint(data) {
	this.p = data.point;
	this.v = data.vector;
}

function Vector(data) {
	this.coordinates = {};
	// data: initial point, terminal point
	for (axis in data.initial) {
		this.coordinates[axis] = data.terminal[axis] - data.initial[axis];
	}
}
Vector.prototype.getMagnitude = function() {
	var c = this.coordinates;
	return Math.sqrt( Math.pow(c.x, 2) + Math.pow(c.y, 2) );
}
Vector.prototype.setMagnitude = function(targetMagnitude) {
	var currMag = this.getMagnitude();
	var scalar = targetMagnitude / currMag;
	for (axis in this.coordinates) {
		this.coordinates[axis] *= scalar;
	}
}
Vector.prototype.addToPoint = function(point) {
	return new Point([
		point.x + this.coordinates.x,
		point.y + this.coordinates.y
	]);
}



$(window).on('load', function(){
//~~~ SET UP "CANVAS" ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var svg = document.querySelector('#svg-background');
	svg.setAttribute('x', '0px');
	svg.setAttribute('y', '0px');
	svg.setAttribute('width', window.innerWidth + 'px');
	svg.setAttribute('height', '4600px');

//~~~ ON SCROLL ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	$(window).on('scroll', function(event){
		bodyOfWater.forEach(function(rippleGroup){
			rippleGroup.update();
		});
	})

//~~~ ON FRAME ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	window.draw = function(){
		if (window.bodyOfWater) {
			bodyOfWater.forEach(function(rippleGroup){
				var center = rippleGroup.center();
				rippleGroup.ripples.forEach(function(ripple){
					ripple.oscillate(center);
					ripple.draw();
				})
			})
		}

	}
	window.drawID = setInterval(draw, 100);

});


