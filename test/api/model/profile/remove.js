var assert = require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should validate profile fields', function () {
		var errors = fixture.controller
			.model('profile')
			.remove()
			.errors({});
		
		assert.equal('string', typeof errors.profile_id);
		
		errors = fixture.controller
			.model('profile')
			.remove()
			.errors({ profile_id: 'asd' });
		
		assert.equal('string', typeof errors.profile_id);
		
		errors = fixture.controller
			.model('profile')
			.remove()
			.errors({ profile_id: 1 });
		
		assert.equal('undefined', typeof errors.profile_id);
	});
	
	it('should remove profile', function (done) {
		fixture.controller.model('profile').remove().process({ 
			profile_id: fixture.profile.profile_id 
		}, function(error, row) {
			assert.equal(null, error);
			done();
		});
	});
};