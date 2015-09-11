var page 		= require('webpage').create(),
  	system 		= require('system'),
	url 		= system.args[1],
	TEXT_PREFIX = /<html><head><\/head><body><pre style="word-wrap: break-word; white-space: pre-wrap;">/,
	TEXT_SUFFIX = /<\/pre><\/body><\/html>/;

if (!url) {
	console.log('Usage: phantom.js <some URL>');
  	phantom.exit();
}

page.onConsoleMessage = function (message) {
    console.log(message);
};

page.onAlert = function(message) {
	if(message !== 'READY') {
		return;
	}
	
	var content = page.content;
	
	if(TEXT_PREFIX.test(content) && TEXT_SUFFIX.test(content)) {
		content = content.replace(TEXT_PREFIX, '').replace(TEXT_SUFFIX, '');
	};
	
	console.log('--BOUNDARY');
	console.log(content);
	console.log('--BOUNDARY');
	phantom.exit();
};

page.open(url, function(status) {
	page.evaluate(function() {
		window.jQuery.salaaap.chops.on('page-loaded', function() {
			alert('READY');
		});	
	});
});