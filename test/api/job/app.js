var assert = require('assert');

module.exports = function(controller, config) {
	describe('App', function() {
		var fixture = {
			me			: null,
			controller	: controller,
			config		: config
		};
		
		before(function(done) {
			//find out who owns this app
			controller.model('app').getProfileByToken(
				config.test.app_token, 
			function(error, profile) {
				if (error) {
					return done(error);
				}
				
				fixture.me = profile;
				
				done();
			});
		});
		
		describe('Create', function () {
			require('./app/create')(fixture);
		});
		
		describe('Refresh', function () {
			require('./app/refresh')(fixture);
		});
		
		describe('Remove', function () {
			require('./app/remove')(fixture);
		});
		
		describe('Update', function () {
			require('./app/update')(fixture);
		});
	});
};