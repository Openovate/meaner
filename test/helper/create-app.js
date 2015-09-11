module.exports = function(controller, settings, config, callback) {
	callback = callback || function() {};
	
	//create app
	controller.sync(function(next) {
		//hit the db manually to inject the tokens
		controller.database.model()
			// app_token		Required
			.setAppToken(config.test.app_token)
			
			// app_secret		Required
			.setAppSecret(config.test.app_secret)
			
			// app_name			Required
			.setAppName(settings.app_name)
			
			// app_permissions	Required
			.setAppPermissions(config.test.scope.join(','))

			// app_created
			.setAppCreated('2015-08-21 00:00:00')
			
			// app_updated
			.setAppUpdated('2015-08-21 00:00:00')
			
			.save('app', next);
	})
	
	//create profile
	.then(function(error, model) {
		if(error) {
			return callback(error);
		}
		
		var next = Array.prototype.slice.apply(arguments).pop();
		
		settings.app = model.get();
		
		if(settings.profile) {
			next(null);
			return;
		}
		
		require('./create-profile')(controller, settings, config, next);
	})
	
	//link profile to app
	.then(function(error) {
		if(error) {
			return callback(error);
		}
		
		var next = Array.prototype.slice.apply(arguments).pop();
		
		controller.model('app').linkProfile({
			app_id		: settings.app.app_id,
			profile_id	: settings.profile.profile_id
		}, next);
	})
	
	//create auth
	.then(function(error) {
		if(error) {
			return callback(error);
		}
		
		var next = Array.prototype.slice.apply(arguments).pop();
		
		if(settings.auth) {
			next(null);
			return;
		}
		
		require('./create-auth')(controller, settings, config, next);
	})
	
	.then(function(error) {
		if(error) {
			return callback(error);
		}
		
		callback(null, settings);
	});
};