var assert = require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should create and link profile', function (done) {
		fixture.controller.model('profile').create().process({
			profile_name: 'TEST FOR APP'
		}, function(error, model) {
			fixture.profile = model.get();
			
			fixture.controller.model('app').linkProfile({
				app_id		: fixture.app.app_id,
				profile_id	: fixture.profile.profile_id
			}, function(error) {
				assert.equal(null, error);
				done();
			});	
		});
	});
	
	it('should get profile by token', function (done) {
		fixture.controller.model('app').getProfileByToken(
			fixture.app.app_token, 
		function(error, profile) {
			assert.equal(null, error);
			assert.equal('TEST FOR APP', profile.profile_name);
			done();
		});
	});
	
	it('should approve permissions', function (done) {
		fixture.controller.model('app').permissions(
			fixture.app.app_id, 
			fixture.profile.profile_id, 
		function(error, yes) {
			assert.equal(null, error);
			assert.equal(true, yes);
			
			fixture.controller.model('app').permissions(
				fixture.app.app_id, 
				222, 
			function(error, yes) {
				assert.equal(null, error);
				assert.equal(false, yes);
				done();
			});
		});
	});
	
	it('should unlink and remove profile', function (done) {
		fixture.controller.model('app').unlinkProfile({
			app_id		: fixture.app.app_id,
			profile_id	: fixture.profile.profile_id
		}, function(error) {
			fixture.controller.model('profile').remove().process({
				profile_id: fixture.profile.profile_id
			}, function(error) {
				assert.equal(null, error);
				done();
			});
		});	
	});
};