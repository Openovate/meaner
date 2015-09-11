var assert = require('assert');

module.exports = function(controller, config) {
	describe('Profile', function() {
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
				require('../../helper/create-session')(controller, {
					profile_name	: 'TEST PROFILE ' + Date.now(),
					auth_slug		: 'TEST PROFILE ' + Date.now(),
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
		
		describe('Update', function () {
			require('./profile/update')(fixture);
		});
	});
};