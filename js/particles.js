//PARTICLE PARAMS
var NUM_PARTICLES = 45;
var curr_particles = NUM_PARTICLES;
var PARTICLE_TO_SCREEN_RATIO = 20;
var VELOCITY = 1.3;
var colors = [ "#F27979", "#FFD6D6", "#B31717", "#E6FFFF", "#DA95ED", "#95EDC9"];
var heartColors = [ "#F27979", "#FFD6D6", "#B31717" ];
var circleColors = [ "#E6FFFF", "#DA95ED", "#95EDC9" ]
var SEED_SIZE = 10;
var FLICKER_RATE = .06;

//ENVIRONMENT PARAMS
var canvas = document.getElementById('projector');
var backgroundColor = '#000';
var count = 0;
var half_min_dimension;
var CANVAS_RATIO;
var CANVAS_HEIGHT = 500;

particle_lock = false;
//particle sliding variables
var mouseDown = false;

var particleParallax = {
	dx : 0,
	scrollY : 0,
	dy : -60, 
	intertiaY : 0
}

var mouse = {
	x : 0,
	y : 0
};

var particles;
var context;

function initEnvironment() {
	if(PLATFORM == "mobile") {
			NUM_PARTICLES = 20;
	}
	window.addEventListener('mousemove', MouseMove, false);
	window.addEventListener('mousedown', MouseDown, false);
	window.addEventListener('mouseup', MouseUp, false);
	window.addEventListener('resize', ResizeCanvas, false);

	window.addEventListener("touchstart", touchStart, false);
	window.addEventListener("touchmove", touchMove, false);
	window.addEventListener("touchend", touchEnd, false);
	$(window).scroll(scroll);
	ResizeCanvas();
	
	setInterval(TimeUpdate, 27);
	
}

function initParticles() {
	particles = [];
	for ( var i = 0; i < NUM_PARTICLES; i++) {
		particles.push({
			x : 0,
			y : 0,
			originX : Math.random() * canvas.width,
			originY : Math.random() * canvas.height,
			vx : ((Math.random() * (VELOCITY * 2)) - VELOCITY) + 1,
			vy : ((Math.random() * (VELOCITY * 2)) - VELOCITY) + 2,
			currentSize : Math.random() * SEED_SIZE,
			color : colors[Math.floor(Math.random() * colors.length)]
		});
	}
}

function TimeUpdate(e) {
	eraseParticles();

	if (PLATFORM !== "mobile") {
		parallaxParticles();
	}

	for ( var i = 0; i < curr_particles; i++) {
		particle = particles[i];

		popPart(particle);
		accelPart(particle);
		movePart(particle);
		drawPart(particle);
	}
	updateCounter();
}

//clear canvas, replace with background color variable.
//** EXPENSIVE, DO NOT LOOP***
function clearCanvas()  {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = backgroundColor; // set canvas background color
	context.fillRect(0, 0, canvas.width, canvas.height); // now fill the canvas
}

// make the particle pop back up to a random size
function popPart(particle) {
	if (particle.currentSize < 3) {
		particle.currentSize = Math.random() * SEED_SIZE;
	} else {
		particle.currentSize *= .96;
	}
}

function accelPart(particle) {
	particle.x *= .82;
	particle.y *= .82;
}

function movePart(particle) {
	if (!particle_lock) {
		border(particle);
		particle.originX += particle.vx * .75;//  * 1.5 * (1 - (particle.currentSize / SEED_SIZE ));
		particle.originY += particle.vy * .75;// * 1.5 * (1 - (particle.currentSize / SEED_SIZE ));
	}
}

function drawPart(particle) {
	if (Math.random() > FLICKER_RATE) {
		context.fillStyle = particle.color;
		context.beginPath();
		context.arc(particle.originX + particle.x, particle.originY
				+ particle.y, particle.currentSize, 0, Math.PI * 2, true);
		context.closePath();
		context.fill();
	}
}

//**EFFICIENT**
function eraseParticles() {
	context.fillStyle = backgroundColor;
	var particle;
	for (var i = 0; i < curr_particles; i++) {
		particle = particles[i];
		context.fillRect(
			particle.originX + particle.x - particle.currentSize * 1.1,
			particle.originY + particle.y - particle.currentSize * 1.1, 
			particle.currentSize * 2.2, 
			particle.currentSize * 2.2);
	}
}

//slide the particles in pixels
function slideParticles(dx, dy) {
	for (var i = 0; i < curr_particles; i++) {
		particles[i].originX -= dx * particles[i].currentSize / SEED_SIZE;
		particles[i].originY -= dy * particles[i].currentSize / SEED_SIZE;
	}
}

function border(particle) {
	if (particle.originX > canvas.width) {
		particle.originX = 0;
		particle.originY = Math.random() * canvas.height;
	} else if (particle.originX + particle.currentSize < 0) {
		particle.originX = canvas.width;
		particle.originY = Math.random() * canvas.height;
	} else {
	}

	if (particle.originY > canvas.height) {
		particle.originY = 0;
		particle.originX = Math.random() * canvas.width;
	} else if (particle.originY  + particle.currentSize < 0) {
		particle.originY = canvas.height;
		particle.originX = Math.random() * canvas.width;
	} else {
	}
}

function updateCounter() {
	count++;
	if (count > 50) {
		release();
		count = 0;
	}
}
<!-- Parallax Particles -->
function parallaxParticles() {
	if (particle_lock) return;
	slideParticles(particleParallax.dx, 0);
	particleParallax.dx *= .88;
	//y
	slideParticles(0, particleParallax.dy);
	particleParallax.dy *= .8;
}

function scroll(e) {
	var curr = $(window).scrollTop();
	particleParallax.dy =  curr- particleParallax.scrollY;
	particleParallax.scrollY = curr;

}

<!-- MOUSE EVENTS -->

function MouseMove(e) {
	if (e) {
		particleParallax.dx = mouse.x - e.pageX;
		mouse.x = e.pageX;
		mouse.y = e.pageY;
	}
}

function MouseDown(e) {
	mouseDown = true;	}

function MouseUp(e) {
	mouseDown = false;
	release();
}

<!-- TOUCH EVENTS -->
function touchStart(e) {
	if (e.target.tagName=="HTML" || e.target.tagName=="BODY") {
	e.preventDefault();
}
	MouseDown(convertTouch(e));
}

function touchMove(e) {
	MouseMove(convertTouch(e));
}

function touchEnd(e) {
	e.preventDefault();
	MouseUp(convertTouch(e));
}

function convertTouch(e) {
	if (e.touches.length > 0) {
		return {
			pageX : e.touches[0].clientX,
			pageY : e.touches[0].clientY,
		};
	}
}

function ResizeCanvas(e) {
	CANVAS_RATIO = canvas.parentNode.offsetWidth / canvas.parentNode.offsetHeight;
	canvas.width = CANVAS_HEIGHT * CANVAS_RATIO;
	canvas.style.width = (window.innerWidth) + 'px';
	canvas.height = CANVAS_HEIGHT;
	canvas.style.height = (window.innerHeight) + 'px';

	half_min_dimension = Math.min(canvas.height / 2, canvas.width / 2);

	clearCanvas();
	curr_particles = Math.min(NUM_PARTICLES,
		NUM_PARTICLES * canvas.parentNode.offsetWidth / (SEED_SIZE * PARTICLE_TO_SCREEN_RATIO)
	);
}

function release() {
	var len = particles.length;
	var particle;
	for ( var i = 0; i < len; i++) {
		particle = particles[i];

	}
	particle_lock = false;
	MouseMove();

}

//!! SHAPES   !!!
function shapeAll(x, y, xfunc, yfunc, size, cs, lock) {
	var len = particles.length;
	var particle;
	for ( var i = 0; i < len; i++) {
		particle = particles[i];
		var px = particle.originX + particle.x;
		var py = particle.originY + particle.y;
		var t = Math.random() * Math.PI * 2;
		particle.originX = x + size * xfunc(t) + Math.random() * 20;
		particle.originY = y + size * yfunc(t) + Math.random() * 20;
		particle.x = px - particle.originX;
		particle.y = py - particle.originY;
		particle.color = cs[Math.floor(Math.random() * cs.length)]
	}
	particle_lock = lock;
	count = 0;
}

//SHAPE FUNCTIONS
// BLEH X_X
function Scatter() {
	shapeAll(0,0, ScatterXFunc, ScatterYFunc, 1, colors);
}

function ScatterXFunc(t) {return Math.random() * canvas.width;}
function ScatterYFunc(t) {return Math.random() * canvas.height;}
//HEARTS <3
function Heart(x, y) {shapeAll(x, y, HeartXFunc, HeartYFunc, half_min_dimension / 19,heartColors, true);}
function HeartXFunc(t) {return 16 * Math.sin(t) * Math.sin(t) * Math.sin(t);}
function HeartYFunc(t) {return -((13 * Math.cos(t)) - (5 * Math.cos(2 * t))	- (2 * Math.cos(3 * t)) - Math.cos(4 * t));}

//CIRCLES :)
function Circle(x, y) {	shapeAll(x, y, CircleXFunc, CircleYFunc, half_min_dimension * .75,	circleColors, true);}
function CircleXFunc(t) {return Math.cos(t);}
function CircleYFunc(t) {return Math.sin(t);}


	//EVERYTHING BEGINS HERE
if (canvas && canvas.getContext) {
	context = canvas.getContext('2d');
	initEnvironment();
	initParticles();
}

MouseMove();