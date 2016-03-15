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



function Vector(x, y) {
	this.x = x;
	this.y = y;
}
Vector.prototype.getMagnitude = function() {
	return Math.sqrt( this.x * this.x + this.y * this.y );
}
Vector.prototype.setMagnitude = function(targetMagnitude) {
	var currMag = this.getMagnitude();
	var scalar = targetMagnitude / currMag;
	this.x *= scalar;
	this.y *= scalar;
	return this;
}
Vector.prototype.normalize = function() {
	this.setMagnitude(1);
	return this;
}
Vector.prototype.equals = function(vector) {
	return this.x === vector.x && this.y === vector.y;
}
Vector.prototype.add = function(vector) {
	return new Vector(this.x + vector.x, this.y + vector.y);
}
Vector.prototype.subtract = function(vector) {
	return new Vector(this.x - vector.x, this.y - vector.y);
}
Vector.prototype.invert = function() {
	this.x *= -1;
	this.y *= -1;
	return this;
}
Vector.prototype.rotate = function(addAngle) {
	var angle = Math.atan2(this.y, this.x);
	angle += addAngle;
	var mag = this.getMagnitude();

	this.x = Math.cos(angle);
	this.y = Math.sin(angle);
	this.setMagnitude(mag);
	return this;
}
Vector.prototype.getAngle = function() {
	return Math.atan2(this.y, this.x);
}
Vector.prototype.clone = function() {
	return new Vector(this.x, this.y);
}
Vector.prototype.randomize = function(range) {
	var rand = (range / 2) - (Math.random() * range);
	this.rotate(rand);
	return this;
}


function BezierVertex(point, vector, origin) {
	this.point = point;
	this.vector = vector;
	this.trajectory = point.subtract(origin);
	this.altTrajectory = this.trajectory.clone().normalize();

}
BezierVertex.prototype.clone = function() {
	var vert = new BezierVertex(
		this.point.clone(),
		this.vector.clone(),
		new Vector(0, 0)
	);
	vert.trajectory = this.trajectory.clone();
	vert.altTrajectory = this.altTrajectory.clone();
	return vert;
}



//~~~ RIPPLE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~ RIPPLE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// attributes: center, growthFactor, vertices, amplitude, bounds, color
function Ripple(attributes){
	this.phase = 0;
	this.growthFactor = attributes.growthFactor;
	this.color = attributes.color || '#00f';
	this.stroke = attributes.stroke - 0.1;
	this.stroke < strokeGlobal ? (this.stroke = strokeGlobal) : null;
	this.amplitude = attributes.amplitude;
	this.path = document.createElementNS('http://www.w3.org/2000/svg','path');
	var svg = document.querySelector('#svg-group');
	svg.appendChild(this.path);

	// if this is the first ripple, then create shape
	// It looks long, but just creates vertices around rectangle
	if (attributes.bounds) {

		var tl = attributes.bounds.tl;
		var tr = attributes.bounds.tr;
		var br = attributes.bounds.br;
		var bl = attributes.bounds.bl;
		var center = attributes.center;
		// Randomize size of curves within ripple
		var w = tr.x - tl.x;
		var h = bl.y - tl.y;
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
		this.vertices = [
			new BezierVertex( // 0 
				// point
				new Vector(tl.x - a, tl.y - a),
				// vector
				new Vector(1, -initY),
				// origin
				center
			),
			new BezierVertex( // 1
				new Vector(tl.x + w1, tl.y - a), //point
				new Vector(initX, 0.8), //vector
				center //origin
			),
			new BezierVertex( // 2
				new Vector(tl.x + w1 + w2, tl.y - a), //point
				new Vector(initX, -1), //vector
				center //origin
			),
			new BezierVertex( // 3
				new Vector(tl.x + w1 + w2 + w3, tl.y - a), //point
				new Vector(initX, 1), //vector
				center //origin
			),
			new BezierVertex( // 4
				new Vector(tl.x + w1 + w2 + w3 + w4, tl.y - a), //point
				new Vector(initX, -0.8), //vector
				center //origin
			),
			new BezierVertex( // 5
				new Vector(tl.x + w + a, tl.y - a), //point
				new Vector(1, initY), //vector
				center //origin
			),
			new BezierVertex( // 6
				new Vector(tr.x + a, tr.y + h1), //point
				new Vector(-1, initY), //vector
				center //origin
			),
			new BezierVertex( // 7
				new Vector(tr.x + a, tr.y + h1 + h2), //point
				new Vector(1, initY), //vector
				center //origin
			),
			new BezierVertex( // 8
				new Vector(tr.x + a, tr.y + h + a), //point
				new Vector(-1, initY), //vector
				center //origin
			),
			new BezierVertex( // 9
				new Vector(br.x - w4, br.y + a), //point
				new Vector(-initX, -0.8), //vector
				center //origin
			),
			new BezierVertex( // 10
				new Vector(br.x - w4 - w1, br.y + a), //point
				new Vector(-initX, 1), //vector
				center //origin
			),
			new BezierVertex( // 11 
				new Vector(br.x - w4 - w1 - w3, br.y + a), //point
				new Vector(-initX, -1), //vector
				center //origin
			),
			new BezierVertex( // 12
				new Vector(br.x - w4 - w1 - w3 - w2, br.y + a), //point
				new Vector(-initX, 0.8), //vector
				center //origin
			),
			new BezierVertex( // 13
				new Vector(br.x - w - a, br.y + a), //point
				new Vector(-1, -initY), //vector
				center //origin
			),
			new BezierVertex( // 14
				new Vector(bl.x - a, bl.y - h1), //point
				new Vector(1, -initY), //vector
				center //origin
			),
			new BezierVertex( // 15
				new Vector(bl.x - a, bl.y - h1 - h2), //point
				new Vector(-1, -initY), //vector
				center //origin
			)
		];
		_.each(this.vertices, function(vertex) {
			vertex.vector.setMagnitude(this.amplitude);
			vertex.vector.randomize(0.5);
			vertex.altTrajectory.randomize(1.7);
		}, this);
	}
	else {
		this.vertices = attributes.vertices;
		_.each(this.vertices, function(vertex) {
			vertex.vector.setMagnitude(this.amplitude);
			vertex.trajectory.setMagnitude(this.growthFactor);
		}, this);

		// this.expand(attributes.center, attributes.growthFactor);
	}
}
Ripple.prototype.cloneVertices = function() {
	return this.vertices.map(function(vert){
		return vert.clone();
	});
}
Ripple.prototype.expandVertices = function(growthFactor, vertices){
	var vert, growthVector, mag, altTraj;
	for (var i = 0; i < vertices.length; i++){
		vert = vertices[i];
		mag = this.growthFactor * (Math.sin(this.phase));
		altTraj = vert.altTrajectory.clone().setMagnitude(mag);
		growthVector = vert.trajectory.add(altTraj).setMagnitude(growthFactor);

		vert.point.x += growthVector.x;
		vert.point.y += growthVector.y;
	}
	return vertices;
}
Ripple.prototype.propagate = function(){
	this.expandVertices(this.growthFactor, this.vertices);
}
Ripple.prototype.oscillate = function(){
	var oscFactor = this.growthFactor * (Math.sin(this.phase) * 0.5 + 0.8);
	this.oscVertices = this.expandVertices(oscFactor, this.cloneVertices());
	this.phase += 0.157;
}
Ripple.prototype.rescale = function(centers, rects) {
	var rp = rects.prev;
	var rc = rects.curr;
	var vert;
	// Making sure that points are outside a rectangle is messy
	for (var i = 0; i < this.vertices.length; i++) {
		vert = this.vertices[i];
		var newTraj = vert.point.subtract(centers.prev).add(centers.delta);
		vert.trajectory = newTraj.setMagnitude(vert.trajectory.getMagnitude());

		if (vert.point.x < rc.tl.x || vert.point.x < rp.tl.x) {
			vert.point.x += rc.tl.x - rp.tl.x; 
		} 
		else if (vert.point.x > rc.tr.x || vert.point.x > rp.tr.x) {
			vert.point.x += rc.tr.x - rp.tr.x;
		}
		else {
			var lengthRatio = (vert.point.x - rp.tl.x) / (rp.tr.x - rp.tl.x);
			var newLength = (rc.tr.x - rc.tl.x) * lengthRatio;
			vert.point.x = rc.tl.x + newLength;
		}

		if (vert.point.y < rc.tl.y || vert.point.y < rp.tl.y) {
			vert.point.y += rc.tl.y - rp.tl.y; 
		} 
		else if (vert.point.y >= rc.bl.y || vert.point.y >= rp.bl.y) {
			vert.point.y += rc.bl.y - rp.bl.y;
		}
		else {
			var heightRatio = (vert.point.y - rp.tl.y) / (rp.bl.y - rp.tl.y);
			var newHeight = (rc.bl.y - rc.tl.y) * heightRatio;
			vert.point.y = rc.tl.y + newHeight;
		}	
	}
}
Ripple.prototype.amplify = function(amplitude){
	return Math.random() * amplitude / 2 + amplitude;
}
Ripple.prototype.evaporate = function(){
	this.path.remove();
}
Ripple.prototype.draw = function(){
	// Generate SVG Bezier curve syntax string
	var verts = this.oscVertices;

	var xyString = function(obj) {
		return ' ' + obj.x + ' ' + obj.y + ' ';
	}

	// Moveto initial point
	var M_xy = xyString(verts[0].point);

	// Curveto from 1st point to 2nd point
	var C_cxcy_cxcy_xy;
	var _cxcy1 = xyString(verts[0].vector.add(verts[0].point) );
	var _cxcy2 = xyString(verts[1].vector.invert().add(verts[1].point) );
	var _xy = xyString(verts[1].point);
	C_cxcy_cxcy_xy = _cxcy1 + _cxcy2 + _xy; 

	// Curveto (shorthand) to subsequent points
	var S_cxcy_xy_array = [];
	for (var i = 2; i < verts.length + 1; i++) {
		var j = (i === verts.length ? 0 : i);
		var _xy = xyString(verts[j].point);
		var _cxcy = xyString(verts[j].vector.invert().add(verts[j].point) );

		S_cxcy_xy_array.push('S' + _cxcy + _xy);
	}
	var S_cxcy_xy = S_cxcy_xy_array.join(' ');

	var data = 'M ' + M_xy + ' C ' + C_cxcy_cxcy_xy + ' ' + S_cxcy_xy;

	this.path.setAttribute('stroke', this.color);
	this.path.setAttribute('stroke-width', this.stroke);
	this.path.setAttribute('fill', 'none');
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

	if (typeof attributes.scrollStart === 'number') {
		this.scrollStart = attributes.scrollStart;
	} else {
		this.scrollStart = this.el.offsetTop - originY - 600 > 0 ? this.el.offsetTop - originY - 600 : 0;
	}
	this.scrollEnd = attributes.scrollEnd || this.scrollStart + this.el.offsetHeight + (720 * 2);
	this.scrollFactor = attributes.scrollFactor || 50;
	
	this.amplitude = attributes.amplitude || 20;
	this.initGrowthFactor = attributes.growthFactor || 14;

	this.rectangle = this.getRectangle();
	this.center = this.getCenter();

	this.ripples = [];
}
RippleGroup.prototype.growthFactor = function() {
	return this.initGrowthFactor * (1 + (this.ripples.length / 22));
}
RippleGroup.prototype.getRectangle = function() {
	// get [x,y] coordinates of DOM element rectangle
	var bounds = {
		// top-left, top-right, bottom-right, bottom-left
		tl: new Vector(this.el.offsetLeft, this.el.offsetTop),
		tr: new Vector(this.el.offsetLeft + this.el.offsetWidth, this.el.offsetTop),
		br: new Vector(this.el.offsetLeft + this.el.offsetWidth, this.el.offsetTop + this.el.offsetHeight),
		bl: new Vector(this.el.offsetLeft, this.el.offsetTop + this.el.offsetHeight)
	}
	return bounds;
}
RippleGroup.prototype.needsRescale = function() {
	var rescale = false;
	var newRect = this.getRectangle();
	for (var prop in newRect) {
		if (!this.rectangle[prop].equals(newRect[prop])) {
			rescale = true;
		}
	}
	return rescale;
}
RippleGroup.prototype.rescale = function() {
	var centers = {
		prev: this.center,
		curr: this.getCenter(),
		delta: this.getCenter().subtract(this.center)
	};
	this.center = centers.curr;
	var rects = {
		prev: this.rectangle, 
		curr: this.getRectangle()
	};
	this.rectangle = rects.curr;
	for (var i = 0; i < this.ripples.length; i++) {
		this.ripples[i].rescale(centers, rects);
	}
}
RippleGroup.prototype.getCenter = function() {
	return new Vector(this.el.offsetLeft + (this.el.offsetWidth / 2), this.el.offsetTop + (this.el.offsetHeight / 2));
}
RippleGroup.prototype.isActive = function() {
	return getScrollState() > this.scrollStart && getScrollState() < this.scrollEnd;
}
RippleGroup.prototype.update = function(){
	var ripNum = this.calcRippleNumber();
	if (ripNum > this.ripples.length) {
		this.makeRipple();
	}
	if (ripNum < this.ripples.length) {
		for (var i = 0; i < this.ripples.length - ripNum; i++) {
			this.removeRipple();
		}
	}
}
RippleGroup.prototype.calcRippleNumber = function() {
	var highWaterMark = getScrollState() - this.scrollStart > 0 ? getScrollState() - this.scrollStart : 0;
	return Math.floor(highWaterMark / this.scrollFactor);
}
RippleGroup.prototype.makeRipple = function(){
	//new Ripple({ growthFactor, vertices, amplitude, bounds, color })
	var attrs = {};
	attrs.color = this.color;
	attrs.amplitude = this.amplitude * (1 + (this.ripples.length / 5));

	if (!this.ripples[0]) {
	// first ripple
		attrs.stroke = strokeGlobalMax;
		attrs.growthFactor = this.growthFactor();
		attrs.bounds = this.getRectangle();
		attrs.center = this.getCenter();
		var ripple = new Ripple(attrs);
	}
	else {
	// additional ripples
		var prevRipple = this.ripples[this.ripples.length - 1];
		attrs.stroke = prevRipple.stroke;
		attrs.growthFactor = this.growthFactor();
		attrs.vertices = prevRipple.cloneVertices();

		var ripple = new Ripple(attrs);
		ripple.propagate();
	}
	this.ripples.push(ripple);
}
RippleGroup.prototype.removeRipple = function() {
	_.last(this.ripples).evaporate();
	this.ripples.pop();
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
DOMRipple.prototype.getCenter = function(domElement) {
	var rect = domElement.getBoundingClientRect();
	var center = new Vector(
		rect.left + (rect.width / 2),
		rect.top + (rect.height / 2)
	);
	return center;
}
DOMRipple.prototype.oscillate = function() {
	var oscillateFactor = this.growthFactor * Math.sin(this.phase) * (this.index + 1);
	this.phase += this.frequency;
	if (this.phase > 3.14) {
		this.phase = 0;
	}
	this.translate = this.expand(oscillateFactor);	
}
DOMRipple.prototype.expand = function(growthFactor) {
	var origin = this.getCenter(this.dummyEl);
	var parentCenter = this.getCenter(this.parentEl);
	var translateVector = origin.subtract(parentCenter);
	translateVector.setMagnitude(growthFactor);
	return translateVector;
}
DOMRipple.prototype.draw = function() {
	var x = this.translate.x;
	var y = this.translate.y;
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
	var center = new Vector(
		this.parentEl.offsetLeft + (this.parentEl.offsetWidth / 2),
		this.parentEl.offsetTop + (this.parentEl.offsetHeight / 2)
	);
	return center;
}
DOMRippleGroup.prototype.update = function() {},
DOMRippleGroup.prototype.needsRescale = function() {
	return false;
}





$(window).on('load', function(){
//~~~ SET UP "CANVAS" ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var svg = document.querySelector('#svg-background');
	svg.setAttribute('x', '0px');
	svg.setAttribute('y', '0px');
	svg.setAttribute('width', window.innerWidth + 'px');
	svg.setAttribute('height', '4600px');

	$(window).on('resize', function(){
		svg.setAttribute('width', window.innerWidth + 'px');
	})

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
				if (rippleGroup.needsRescale()) {
					rippleGroup.rescale();
				}

				rippleGroup.ripples.forEach(function(ripple){
					ripple.oscillate();
					ripple.draw();
				});
			})
		}

		setTimeout(draw, 100);
	}
	draw();

});


