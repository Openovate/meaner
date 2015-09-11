var assert = require('assert');

module.exports = function(controller, config) {
	describe('Session', function() {
		var fixture = {
			me			: null,
			you			: null,
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
				
				//create a session
				require('../../helper/create-auth')(controller, {
					profile_name	: 'TEST SESSION ' + Date.now(),
					profile_email	: 'TEST SESSION ' + Date.now(),
					auth_slug		: 'TEST SESSION ' + Date.now(),
					auth_password	: '123456',
					file_link		: 'http://example.com/sample.gif'
				}, config, function(error, results) {
					if(error) {
						return done(error);
					}
					
					fixture.you = results;
					
					done();
				});
			});
		});
		
		describe('Request', function () {
			require('./session/request')(fixture);
		});
		
		describe('Access', function () {
			require('./session/access')(fixture);
		});
	});
};