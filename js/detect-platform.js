var PLATFORM = 'unknown';

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	PLATFORM = "mobile";
	console.log('using mobile');
}
else if (navigator.appVersion.indexOf("Win")!=-1) {
  	PLATFORM = "windows";
  	console.log('using windows');
}