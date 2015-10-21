var aboutButton = $('#about');
var resumeButton = $('#resume');
var workButton = $('#work');
var contactButton = $('#contact');


aboutButton.hover(function(event) {highlight(event.currentTarget);},
									function(event) {unhighlightAll();});

resumeButton.hover(function(event) {highlight(event.currentTarget);},
									function(event) {unhighlightAll();});

workButton.hover(function(event) {highlight(event.currentTarget);},
									function(event) {unhighlightAll();});

contactButton.hover(function(event) {highlight(event.currentTarget);	},
									function(event) {unhighlightAll();});




function highlight(target) {
	$('.nav-item').stop();
	$('.nav-item').css('color', 'grey');
	$('#'+target.id).css('color', 'white');
}

function unhighlightAll() {
	$('.nav-item').stop();
	$('.nav-item').css('color', 'grey');
	setTimeout(highlightAll, 1000);
}

function highlightAll() {
	$('.nav-item').stop();
	if (workButton.css('color') == 'rgb(128, 128, 128)' 
		&& resumeButton.css('color') == 'rgb(128, 128, 128)' 
		&& aboutButton.css('color') == 'rgb(128, 128, 128)'
		&& contactButton.css('color') == 'rgb(128, 128, 128)' ) {
			$('.nav-item').css('color', 'white');
	}
}


