var assert = require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should exist', function (done) {
		fixture.controller.model('auth').exists(fixture.auth.auth_slug, function(error, total) {
			assert.equal(null, error);
			assert.equal(1, total);
			done();
		});
	});
	
	it('should create and link profile', function (done) {
		fixture.controller.model('profile').create().process({
			profile_name: 'TEST FOR AUTH'
		}, function(error, model) {
			fixture.profile = model.get();
			
			fixture.controller.model('auth').linkProfile({
				auth_id		: fixture.auth.auth_id,
				profile_id	: fixture.profile.profile_id
			}, function(error) {
				assert.equal(null, error);
				done();
			});	
		});
	});
	
	it('should unlink and remove profile', function (done) {
		fixture.controller.model('auth').unlinkProfile({
			auth_id		: fixture.auth.auth_id,
			profile_id	: fixture.profile.profile_id
		}, function(error) {
			assert.equal(null, error);
			fixture.controller.model('profile').remove().process({
				profile_id: fixture.profile.profile_id
			}, function(error) {
				assert.equal(null, error);
				done();
			});
		});	
	});
};