var assert = require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should validate profile fields', function () {
		var errors = fixture.controller
			.model('profile')
			.update()
			.errors({});
		
		assert.equal('string', typeof errors.profile_id);
		assert.equal('undefined', typeof errors.profile_name);
		
		errors = fixture.controller.model('profile').update().errors({
			profile_id		:  fixture.profile.profile_id,
			profile_name	: '123' });
		
		assert.equal('undefined', typeof errors.profile_id);
		assert.equal('undefined', typeof errors.profile_name);
	});
	
	it('should update profile', function (done) {
		fixture.controller.model('profile').update().process({
			profile_id		: fixture.profile.profile_id,
			profile_name	: '0987654321' }, 
		function(error, model) {
			assert.equal(null, error);
			assert.equal('0987654321', model.profile_name);
			done();
		});
	});
};