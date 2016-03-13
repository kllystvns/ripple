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

//~~~ MATH functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var square = function(x) { return x * x }

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
	for (axis in data.terminal) {
		if (data.initial) {
			this.coordinates[axis] = data.terminal[axis] - data.initial[axis];
		}
		else {
			this.coordinates[axis] = data.terminal[axis];
		}
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
Vector.prototype.invert = function() {
	for (axis in this.coordinates) {
		this.coordinates[axis] *= -1;
	}
	return this;
}


//~~~ RIPPLE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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

		var tl = attributes.bounds.tl;
		var tr = attributes.bounds.tr;
		var br = attributes.bounds.br;
		var bl = attributes.bounds.bl;
		// Randomize size of curves within ripple
		var w = attributes.bounds.width;
		var h = attributes.bounds.height;
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

		// Ripple shape is made of 16 specific vertices
		// Point, Vector, Magnitude
		this.vertices = [
			{ // 0 
				p: new Point([tl.x - a, tl.y - a]),
				v: new Vector({terminal: {x: 1, y: -1 * initY} }) 
			},
			{ // 1
				p: new Point([tl.x + w1, tl.y - a]), 
				v: new Vector({terminal: {x: initX, y: 1} })
			},
			{ // 2
				p: new Point([tl.x + w1 + w2, tl.y - a]), 
				v: new Vector({terminal: {x: initX, y: -1} })
			},
			{ // 3
				p: new Point([tl.x + w1 + w2 + w3, tl.y - a]), 
				v: new Vector({terminal: {x: initX, y: 1} })
			},
			{ // 4
				p: new Point([tl.x + w1 + w2 + w3 + w4, tl.y - a]), 
				v: new Vector({terminal: {x: initX, y: -1} })
			},
			{ // 5
				p: new Point([tl.x + w + a, tl.y - a]), 
				v: new Vector({terminal: {x: 1, y: initY} })
			},
			{ // 6
				p: new Point([tr.x + a, tr.y + h1]), 
				v: new Vector({terminal: {x: -1, y: initY} })
			},
			{ // 7
				p: new Point([tr.x + a, tr.y + h1 + h2]), 
				v: new Vector({terminal: {x: 1, y: initY} })
			},
			{ // 8
				p: new Point([tr.x + a, tr.y + h + a]), 
				v: new Vector({terminal: {x: -1, y: initY} })
			},
			{ // 9
				p: new Point([br.x - w4, br.y + a]), 
				v: new Vector({terminal: {x: -1 * initX, y: -1} })
			},
			{ // 10
				p: new Point([br.x - w4 - w1, br.y + a]), 
				v: new Vector({terminal: {x: -1 * initX, y: 1} })
			},
			{ // 11 
				p: new Point([br.x - w4 - w1 - w3, br.y + a]), 
				v: new Vector({terminal: {x: -1 * initX, y: -1} })
			},
			{ // 12
				p: new Point([br.x - w4 - w1 - w3 - w2, br.y + a]), 
				v: new Vector({terminal: {x: -1 * initX, y: 1} })
			},
			{ // 13
				p: new Point([br.x - w - a, br.y + a]), 
				v: new Vector({terminal: {x: -1, y: -1 * initY} })
			},
			{ // 14
				p: new Point([bl.x - a, bl.y - h1]), 
				v: new Vector({terminal: {x: 1, y: -1 * initY} })
			},
			{ // 15
				p: new Point([bl.x - a, bl.y - h1 - h2]), 
				v: new Vector({terminal: {x: -1, y: -1 * initY} })
			}
		];
		_.each(this.vertices, function(vertex) {
			vertex.m = this.amplitude
			vertex.v.setMagnitude(vertex.m);
			vertex.traj = null;
		}, this);

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
		this.vertices = attributes.vertices;
		_.each(this.vertices, function(vertex) {
			vertex.m = this.amplitude
			vertex.v.setMagnitude(vertex.m);
			vertex.traj = null;
		}, this);
		this.expand(attributes.center, attributes.growthFactor);
	}
}
Ripple.prototype.replicateVertices = function() {
	// creates duplicate object literal
	var copyVertices = this.vertices.map(function(vert) {
		var copy = {
			p: new Point([vert.p.x, vert.p.y]),
			v: new Vector({terminal: vert.v.coordinates}),
			m: vert.m,
			traj: vert.traj
		}
		return copy
	});
	return copyVertices;
}
Ripple.prototype.expand = function(center, growthFactor){
	var vertices = this.replicateVertices();
	for (var i = 0; i < vertices.length; i++){
		var growthVector = new Vector({initial: center, terminal: vertices[i].p});
		growthVector.setMagnitude(growthFactor);
		vertices[i].p = growthVector.addToPoint(vertices[i].p); 
	}
	return vertices;
}
Ripple.prototype.oscillate = function(center){
	var oscillateFactor = this.growthFactor * (Math.sin(this.phase) * 0.5 + 0.8);
	this.phase += 0.157;
	this.oscVertices = this.expand(center, oscillateFactor);
}
Ripple.prototype.nudge = function(vector) {
	for (var i = 0; i < this.vertices.length; i++) {
		this.vertices[i].p = vector.addToPoint(this.vertices[i].p);
	}
}
Ripple.prototype.amplify = function(amplitude){
	return Math.random() * amplitude / 2 + amplitude;
}
Ripple.prototype.evaporate = function(){
	this.path.remove();
}
Ripple.prototype.draw = function(){
	// Generate SVG Bezier curve syntax
	var verts = this.oscVertices;

	var xyString = function(obj) {
		return ' ' + obj.x + ' ' + obj.y + ' ';
	}

	// Moveto initial point
	var M_xy = xyString(verts[0].p);

	// Curveto from 1st point to 2nd point
	var C_cxcy_cxcy_xy;
	var _cxcy1 = xyString(verts[0].v.addToPoint(verts[0].p) );
	var _cxcy2 = xyString(verts[1].v.invert().addToPoint(verts[1].p) );
	var _xy = xyString(verts[1].p);
	C_cxcy_cxcy_xy = _cxcy1 + _cxcy2 + _xy; 

	// Curveto (shorthand) to subsequent points
	var S_cxcy_xy_array = [];
	for (var i = 2; i < verts.length + 1; i++) {
		var j = (i === verts.length ? 0 : i);
		var _xy = xyString(verts[j].p);
		var _cxcy = xyString(verts[j].v.invert().addToPoint(verts[j].p) );

		S_cxcy_xy_array.push('S' + _cxcy + _xy);
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
	
	this.amplitude = attributes.amplitude || 20;
	this.initGrowthFactor = attributes.growthFactor || 14;
	this.prevCenter = this.getCenter();

	this.ripples = [];
}
RippleGroup.prototype.growthFactor = function() {
	return this.initGrowthFactor * (1 + (this.ripples.length / 22));
}
RippleGroup.prototype.getRectangle = function() {
	// get [x,y] coordinates of DOM element rectangle
	var bounds = {
		// top-left, top-right, bottom-right, bottom-left
		tl: new Point([this.el.offsetLeft, this.el.offsetTop]),
		tr: new Point([this.el.offsetLeft + this.el.offsetWidth, this.el.offsetTop]),
		br: new Point([this.el.offsetLeft + this.el.offsetWidth, this.el.offsetTop + this.el.offsetHeight]),
		bl: new Point([this.el.offsetLeft, this.el.offsetTop + this.el.offsetHeight]),
		width: this.el.offsetWidth,
		height: this.el.offsetHeight
	}
	return bounds;
}
RippleGroup.prototype.getCenter = function() {
	return new Point([this.el.offsetLeft + (this.el.offsetWidth / 2), this.el.offsetTop + (this.el.offsetHeight / 2)]);
}
RippleGroup.prototype.isActive = function() {
	return getScrollState() > this.scrollStart && getScrollState() < this.scrollEnd;
}

//needs to happen on scroll
RippleGroup.prototype.update = function(){
	if (this.isActive()) {
		if (this.getCenter() !== this.prevCenter) {
		// NOT READY YET
			this.nudgeRipples();
			this.prevCenter = this.getCenter();
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
	var newCen = this.getCenter();
	var translateVector = new Vector({initial: this.prevCenter, terminal: newCen});
	this.prevCenter = newCen;
	for (var i = 0; i < this.ripples.length; i++) {
		this.ripples[i].nudge(translateVector);
	}
}
//function Ripple(center, growthFactor, vertices, amplitude, bounds, color)
RippleGroup.prototype.makeRipple = function(){
	var attrs = {};
	var center = this.getCenter();
	attrs.color = this.color;
	var currentGrowth = this.growthFactor() / this.initGrowthFactor;
	attrs.amplitude = this.amplitude * (1 + (this.ripples.length / 5));
	if (this.ripples[0]) {
		var prevRipple = this.ripples[this.ripples.length - 1];
		attrs.stroke = prevRipple.stroke;
		attrs.growthFactor = this.growthFactor();
		attrs.vertices = prevRipple.expand(center, attrs.growthFactor);
		var ripple = new Ripple(attrs);
		if (this.ripples[1]) {
			_.last(this.ripples).index = 1;
		}
	}
	else {
		attrs.stroke = strokeGlobalMax;
		attrs.growthFactor = this.growthFactor();
		attrs.bounds = this.getRectangle();
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
	translateVector.setMagnitude(growthFactor);

	return translateVector;
}
DOMRipple.prototype.draw = function() {
	var x = this.translate.coordinates.x;
	var y = this.translate.coordinates.y;
	var transformString = 'translate(' + x + 'px,' + y + 'px)';

	this.el.style.webkitTransform = transformString;
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
DOMRippleGroup.prototype.getCenter = function() {
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
				var center = rippleGroup.getCenter();
				rippleGroup.ripples.forEach(function(ripple){
					ripple.oscillate(center);
					ripple.draw();
				})
			})
		}

	}
	window.drawID = setInterval(draw, 100);

});


