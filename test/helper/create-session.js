module.exports = function(controller, settings, config, callback) {
	callback = callback || function() {};
	
	//create auth
	controller.sync(function(next) {
		if(settings.auth) {
			next(null, {
				get: function() {
					return settings.auth;
				}
			});
			
			return;
		}
		
		require('./create-auth')(controller, settings, config, next);	
	})
	
	//get app
	.then(function(error) {
		if(error) {
			return callback(error);
		}
		
		var next = Array.prototype.slice.apply(arguments).pop();
		
		controller
			.model('app')
			.list()
			.process({})
			.filterByAppToken(config.test.app_token)
			.filterByAppSecret(config.test.app_secret)
			.getRow(next);
	})
	
	//request
	.then(function(error, row) {
		if(error) {
			return callback(error);
		}
		
		var next = Array.prototype.slice.apply(arguments).pop();
		
		settings.app = row;
		
		controller.model('session').request().process({
			app_id	: settings.app.app_id,
			auth_id	: settings.auth.auth_id,
			session_permissions: config.test.scope.join(',')
		}, next);
	})
	
	//access
	.then(function(error, model) {
		if(error) {
			return callback(error);
		}
		
		var next = Array.prototype.slice.apply(arguments).pop();
		
		settings.session = model.get();
			
		controller.model('session').access().process({
			client_id		: config.test.app_token,
			client_secret	: config.test.app_secret,
			code			: settings.session.session_token,
		}, next);
	})
	
	.then(function(error, row) {
		if(error) {
			return callback(error);
		}
		
		var next = Array.prototype.slice.apply(arguments).pop();
		
		settings.session = row;
		
		callback(null, settings);
	});
};