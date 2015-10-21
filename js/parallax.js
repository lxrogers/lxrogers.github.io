var PARALLAX_AMOUNT = 200;

//LIST OF ELEMENTS CONTAINING A PARALLAX CHILD
var parallaxElements = ['.about', '.resume','.contact'];
var trifecta_popped = false;
//FOR WORKS PARALLAX SEE WORKS.JS, FOR PARTICLE PARALLAX SEE PARTICLES.JS
if (PLATFORM !== "mobile") {
	$(window).scroll(parallax);	
}

function parallax(e) {
	fadeName();
	fadeHint();
	popTrifecta();

	for (var i = 0; i < parallaxElements.length; i++) {
		applyParallax(parallaxElements[i]);
	}
}

function pop(element) {
	element.css('font-size', '3.5em');
	element.css('opacity', 1);
	element.animate({
        		'font-size': '3em'
    		}, 1000, "easeOutExpo");
}
//specific parallax functions
function popTrifecta() {
	var aboutOffset = getOffsetPercentage($('.about'));
	if (!trifecta_popped && aboutOffset < .15) {


		$('#d-heart').animate({
			'width': '50%',
			'margin-left': '200%',
			'opacity': 1
		}, 1000,"easeOutExpo");

		$('#e-circle').delay(200).animate({
			'width': '50%',
			'margin-left': '200%',
			'opacity' : 1
		}, 1000,"easeOutExpo");

		$('#i-shuffle').delay(400).animate({
			'width': '50%',
			'margin-left': '200%',
			'opacity' : 1
		}, 1000,"easeOutExpo");

		window.setTimeout(function() {
			$('#trifecta img').stop().animate({
				'margin-left' : '10%'
			}, 1000, "easeOutExpo");
		}, 800);

		window.setTimeout(function() {
			$('.trifecta').animate({
				'opacity' : 1,
				'margin-top' : '10px'
			}, 2000, "easeOutExpo");
		}, 1300)
		//pop($('#design'));
		
		//window.setTimeout(function() {pop($('#engineer'))}, 500);

		//window.setTimeout(function() {pop($('#innovate'))}, 1000);

		trifecta_popped = true;
	}
}

function fadeName() {
	var splashOffset = getOffsetPercentage($('.splash'));
	var newOffset = (splashOffset + 1) * 3 - 2;
	
	if (splashOffset > -1) {
		$('#name').css('opacity', newOffset);
		$('#nav').css('opacity', newOffset);
	}
}

function fadeHint() {
	var hint = $('#hint');
	var offset = getOffsetPercentage(hint);
	
	if (offset < 1 && offset > -.2) {
		hint.css('opacity', (offset));
	}
}

function applyParallax(parentTag) {
	var parent = $(parentTag);
	var offset = getOffsetPercentage(parent);
	
	var opacity = 1 - offset;
	
	if (offset < 1.2) {
		var child = $(parentTag + ' .parallax');
		child.css('margin-top', offset * PARALLAX_AMOUNT);
		child.css('opacity', opacity);

	}
}

function getOffsetPercentage(e) {
	var eTop = e.offset().top;
	var offset = eTop - $(window).scrollTop();
	return offset / $(window).height();
}

function getBottomOffsetPercentage(e) {
	var eTop = e.offset().top;
	var offset = eTop - $(window).scrollTop() + e.outerHeight();
	return offset / $(window).height();
}

if (PLATFORM !== "mobile") {
	parallax();
}

$(document).ready(
	function() {
		if (PLATFORM == "windows") {
			//$("html").niceScroll({
    		//	mousescrollstep: 65
		    //});
		}
	}
);
