module.exports = function(controller, settings, config, callback) {
	callback = callback || function() {};
	
	//create auth
	controller.sync(function(next) {
		controller.model('profile').create().process({
			profile_name: settings.profile_name
		}, next);
	})
	
	//create file
	.then(function(error, model) {
		if(error) {
			return callback(error);
		}
		
		var next = Array.prototype.slice.apply(arguments).pop();
		
		settings.profile = model.get();
		
		controller.model('file').create().process({
			file_link: settings.file_link,
			file_type: 'main_profile'
		}, next);
	})
	
	//link profile to file
	.then(function(error, model) {
		if(error) {
			return callback(error);
		}
		
		var next = Array.prototype.slice.apply(arguments).pop();
		
		settings.file = model.get();
					
		controller.model('profile').linkFile({
			file_id		: settings.file.file_id,
			profile_id	: settings.profile.profile_id
		}, next);
	})
	
	.then(function(error) {
		if(error) {
			return callback(error);
		}
		
		callback(null, settings);
	});
};