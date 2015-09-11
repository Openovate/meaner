module.exports = function(controller, settings, config, callback) {
	callback = callback || function() {};
	
	//create auth
	controller.sync(function(next) {
		controller.model('auth').create().process({
			auth_slug			: settings.auth_slug,
			auth_permissions	: config.test.scope.join(','),
			auth_password		: settings.auth_password,
			confirm				: settings.auth_password 
		}, next);	
	})
	
	//create profile
	.then(function(error, model) {
		if(error) {
			return callback(error);
		}
		
		var next = Array.prototype.slice.apply(arguments).pop();
		
		settings.auth = model.get();
		
		if(settings.profile) {
			next(null);
			return;
		}
		
		require('./create-profile')(controller, settings, config, next);
	})
	
	//link profile to auth
	.then(function(error) {
		if(error) {
			return callback(error);
		}
		
		var next = Array.prototype.slice.apply(arguments).pop();
		
		controller.model('auth').linkProfile({
			auth_id		: settings.auth.auth_id,
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