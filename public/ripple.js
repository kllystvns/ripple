var originY = 500;
// scroll to origin in main.js
var strokeGlobal = 0.9;

var scrollState = function(){
	var quadrant = (window.scrollY < originY) ? -1 : 1;
	return (window.scrollY - originY) * quadrant;
}


//~~~ RIPPLE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function Ripple(center, growthFactor, vertices, amplitude, bounds, color){
	this.color = color || '#00f';
	this.amplitude = amplitude;
	this.path = document.createElementNS('http://www.w3.org/2000/svg','path');
	var svg = document.querySelector('#svg-background');
	svg.appendChild(this.path);

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
		this.vertices = this.expand(center, vertices, growthFactor);
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
Ripple.prototype.amp = function(amplitude){
	return Math.random() * amplitude / 2 + amplitude;
}
Ripple.prototype.draw = function(){
	var verts = this.vertices;
	// // P5
	// 	noFill();
	// 	stroke(this.color);
	// 	strokeWeight(strokeGlobal);
	// for (var i = 0; i < vertices.length; i++) {
	// 	var j = i + 1;
	// 	if (i === vertices.length - 1) {
	// 		j = 0;
	// 	}
	// 	var px1 = vertices[i].p[0];
	// 	var py1 = vertices[i].p[1];
	// 	var px2 = vertices[j].p[0];
	// 	var py2 = vertices[j].p[1];

	// 	var vec1 = createVector(vertices[i].v[0], vertices[i].v[1]);
	// 	vec1.setMag(vertices[i].m);

	// 	var vec2 = createVector(vertices[j].v[0], vertices[j].v[1]);
	// 	vec2.setMag(vertices[j].m);
	// 	vec2.rotate(PI);

	// 	bezier(px1, py1, vec1.x + px1, vec1.y + py1, vec2.x + px2, vec2.y + py2, px2, py2);
	// }

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
	this.path.setAttribute('stroke-width', strokeGlobal);
	this.path.setAttribute('fill', 'none');
	this.path.setAttribute('d', data);
	return this.path;
}
Ripple.prototype.evaporate = function(){
	this.path.remove();
}
Ripple.prototype.oscillate = function(){

}


// ~~~ RIPPLE GROUP ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// scrollStart is the Y scroll-state at which the Ripple Group begins to animate
// scrollEnd is similar
// scrollFactor is a ratio comparing user scroll speed to the speed at which Ripple Group should grow
// highWaterMark tracks whether user has scrolled enough for new animation

// ~~~ RIPPLE GROUP ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function RippleGroup(domElement, scrollFactor, scrollEnd, growthFactor, amplitude, color){
	this.el = document.querySelector(domElement);
	this.color = color;
	this.scrollStart = this.el.offsetTop - originY - 720;
	this.scrollEnd = scrollEnd || this.scrollStart + this.el.offsetHeight + (720 * 2);
	
	this.scrollFactor = scrollFactor || 50;
	this.highWaterMark = scrollState(); //default initial
	this.prevGrowthFactor = growthFactor || 14;
	this.growthFactor = function(){
		return this.prevGrowthFactor * (1 + (this.ripples.length / 22))
	}
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
		return [this.el.offsetLeft + (this.el.offsetWidth / 2), this.el.offsetTop + (this.el.offsetHeight / 2)];
	};
	this.prevCenter = null;

	this.ripples = [];
}

RippleGroup.prototype.isActive = function(){
	return scrollState() > this.scrollStart && scrollState() < this.scrollEnd;
}


//needs to happen on scroll
RippleGroup.prototype.update = function(){
	if (this.isActive()) {
		// NOT READY YET
		if (this.center() !== this.prevCenter) {
			this.nudgeRipples();
			this.prevCenter = this.center();
		}

		if (scrollState() > this.highWaterMark + this.scrollFactor) {
			this.highWaterMark = Math.floor(scrollState() / this.scrollFactor) * this.scrollFactor;
			this.makeRipple();
		}
		if (scrollState() < this.highWaterMark) {
			this.highWaterMark = Math.floor(scrollState() / this.scrollFactor) * this.scrollFactor;
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
	var cen = this.center();
	if (this.ripples[0]) {
		var vertices = this.ripples[this.ripples.length - 1].vertices;
		var ripple = new Ripple(cen, this.growthFactor(), vertices, this.amplitude, null, this.color);
	}
	else {
		var bounds = [this.tl(), this.tr(), this.br(), this.bl()];
		var ripple = new Ripple(cen, null, null, this.amplitude, bounds, this.color);
	}
	this.ripples.push(ripple);
}
RippleGroup.prototype.removeRipple = function(){
	this.ripples[this.ripples.length -1].evaporate();
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
				rippleGroup.ripples.forEach(function(ripple){
					ripple.draw();
				})
			})
		}
	}
	window.drawID = setInterval(draw, 100);

});


