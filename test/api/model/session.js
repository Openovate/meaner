var assert = require('assert');

module.exports = function(controller, config) {
	describe('Session', function() {
		var fixture = {
			controller	: controller,
			config		: config
		};
		
		//we need to create a dummy auth 
		//in order to authenticate
		before(function(done) {
			require('../../helper/create-session')(controller, {
				profile_name	: 'TEST AUTH ' + Date.now(),
				auth_slug		: 'TEST AUTH ' + Date.now(),
				auth_password	: '123456',
				file_link		: 'http://example.com/sample.gif'
			}, config, function(error, results) {
				if(error) {
					return done(error);
				}
				
				fixture.app 			= results.app;
				fixture.auth 			= results.auth;
				fixture.file 			= results.file;
				fixture.profile 		= results.profile;
				fixture.session 		= results.session;
				fixture.profile_name 	= results.profile_name;
				fixture.auth_slug 		= results.auth_slug;
				fixture.auth_password 	= results.auth_password;
				fixture.file_link 		= results.file_link;
				
				done();
			});
		});
		
		describe('Login', function () {
			require('./session/login')(fixture);
		});
		
		describe('Request', function () {
			require('./session/request')(fixture);
		});
		
		describe('Access', function () {
			require('./session/access')(fixture);
		});
		
		describe('Module', function () {
			require('./session/module')(fixture);
		});
		
		describe('Logout', function () {
			require('./session/logout')(fixture);
		});
	});
};