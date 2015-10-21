var HEADER_CLASS = "h2";
var SUBTITLE_CLASS = "h6";

var zoomTime = 700;
var delayTime = 10;
var SUBTITLE_DELAY = 100;

var HEADER_FONT_SIZE_END = '2.5em';
var SUBTITLE_FONT_SIZE_END = '1em';

var HEADER_FONT_SIZE_BEGIN = '3em';
var SUBTITLE_FONT_SIZE_BEGIN = '1.15em';

var HEADER_BASE_BOTTOM = 70;
var SUBTITLE_BASE_TOP = 30;

var WORKS_PARALLAX_AMOUNT = 25;
var scroll_counter = 0;

currentWork = null;

$("#about").click(function() {
    $('html, body').animate({
        scrollTop: $(".about").offset().top
    }, 500);
});

$("#resume").click(function() {
    $('html, body').animate({
        scrollTop: $(".resume").offset().top
    }, 500);
});

$("#work").click(function() {
    $('html, body').animate({
        scrollTop: $(".works").offset().top
    }, 500);
});

$("#contact").click(function() {
    $('html, body').animate({
        scrollTop: $(".contact").offset().top
    }, 500);
});

function hoverWork() {
	if ($(this).hasClass("clicked")) return;
	$(this).find(".bottom").fadeTo(100, .5);

	var header = $(this).find(".overlay").find(HEADER_CLASS);
	var subtitle = $(this).find(".overlay").find(SUBTITLE_CLASS);
	header.stop();
	subtitle.stop();
	
	header.delay(delayTime).animate(
		{fontSize: HEADER_FONT_SIZE_END, opacity: 1,},
		zoomTime,
		"easeOutExpo");
	subtitle.delay(delayTime + SUBTITLE_DELAY).animate(
		{fontSize: SUBTITLE_FONT_SIZE_END, opacity: 1},
		zoomTime,
		"easeOutExpo");

	$(this).addClass("highlighted");
}

function unHoverWork() {
	var header = $(this).find(".overlay").find(HEADER_CLASS);
	var subtitle = $(this).find(".overlay").find(SUBTITLE_CLASS);
	header.stop();
	subtitle.stop();

	header.delay(delayTime).animate(
		{fontSize: HEADER_FONT_SIZE_BEGIN, opacity: 0},
		zoomTime,
		"easeOutExpo");
	subtitle.animate(
		{fontSize: SUBTITLE_FONT_SIZE_BEGIN, opacity: 0},
		zoomTime,
		"easeOutExpo");
	
	
	if (!$(this).hasClass("clicked")) {
		$(this).find(".bottom").delay(delayTime*2).fadeTo(200, 1);
	}

	$(this).removeClass("highlighted");
}

function openWork(work) {
	var slideDeck = work.find('.slide-deck');
	work.animate(
		{"padding-bottom": '70%',
		"margin-top":"0px"},
		750,
		"easeOutExpo"
	);

	var offset = .1 * $(window).height();
	$('html, body').animate({
	    scrollTop: work.offset().top - offset
		}, 750,
		"easeOutExpo");	


	unHoverWork.apply(work);

	work.find('.bottom').fadeTo(750,0);
	slideDeck.stop();
	slideDeck.css("margin-left", "0")
	slideDeck.animate({"opacity" : "1"});
}

function closeWork(work) {
	work.animate(
		{"padding-bottom": '50%',
		"margin-top" : "-50px"},
		750,
		"easeOutExpo"
	);

	work.removeClass("clicked")
	hoverWork.apply(work);

	work.find('.slide-deck').animate({"opacity" : 0}, 750, "easeOutExpo")
}

function closeWorksExcept(leaveOpen) {
	$('.work').each(function() {
		if ($(this) != leaveOpen && $(this).hasClass("clicked")) {
			$(this).css({"padding-bottom": '50%',
						"margin-top" : "-50px"})
			$(this).removeClass("clicked")
			$(this).find('.slide-deck').css({"opacity" : 0})
			$(this).find(".bottom").fadeTo(100, 1);
		}
	})
}

function getCurrentSlideIndex(slideDeck) {
	var px = parseInt(slideDeck.css("margin-left"));
	var pct =  -1 * px / slideDeck.parent().width();
	

	if (pct == 0) 
		return 0;
	return Math.ceil(pct)
	if (pct > 0 && pct <= 1)
		return 1;
	if (pct > 1 && pct <= 2)
		return 2;
}

function getNextSlideMarginLeft(currentIndex, offset) {
	var nextIndex = currentIndex + offset;
	nextIndex = Math.min(5, nextIndex);
	nextIndex = Math.max(0, nextIndex);
	return (nextIndex) * -100 + "%";
}

function slideWork(work, indexOffset) {
	var slideDeck = work.find('.slide-deck');
	slideDeck.stop()
	var currentIndex = getCurrentSlideIndex(slideDeck);
	var nextMarginPct = getNextSlideMarginLeft(currentIndex, indexOffset);

	slideDeck.animate(
		{"margin-left" : nextMarginPct},
		750,
		"easeOutExpo")
}

function clickWork() {
	if ($(this).hasClass("clicked")) {
		$(this).addClass("clicked");
		//closeWork($(this));
		slideWork($(this), 1);
	}
	else {
		closeWorksExcept($(this))
		
		$(this).toggleClass("clicked");

		openWork($(this));
	}
}

function closeCurrentWork() {
	closeWork($('.work.clicked'));
}

function backCurrentWork()  {
	console.log('hi :)')
	slideWork($('.work.clicked'), -1);
}

function worksParallax() {
	$(".work").each(function() {
		var topOffset = getOffsetPercentage($(this));
		var bottomOffset = getBottomOffsetPercentage($(this));
		
		if ($(this).hasClass("highlighted")) {
			if (bottomOffset < .6 || topOffset > .6) {
				unHoverWork.apply($(this))
			}
		}
		else { // unhighlighted
			if (topOffset < .6 && bottomOffset > .6) {
				hoverWork.apply($(this));
			}
		}
	})
}

$(window).scroll(worksParallax);	


$('.work').each(function() {
	$(this).click(clickWork);
});

$('.slide-close').each(function() {
	$(this).click(closeCurrentWork)
})

$('.slide-back').each(function() {
	$(this).click(backCurrentWork)
})

if (PLATFORM !== "mobile") {
	
}