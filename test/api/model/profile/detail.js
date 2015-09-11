var assert = require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should validate profile fields', function () {
		var errors = fixture.controller
			.model('profile')
			.detail()
			.errors({});
		
		assert.equal('string', typeof errors.profile_id);
		
		errors = fixture.controller
			.model('profile')
			.detail()
			.errors({ profile_id: 'asd' });
		
		assert.equal('string', typeof errors.profile_id);
		
		errors = fixture.controller
			.model('profile')
			.detail()
			.errors({ profile_id: 1 });
		
		assert.equal('undefined', typeof errors.profile_id);
	});
	
	it('should not get profile', function () {
		var search = fixture.controller
			.model('profile')
			.detail()
			.process({});
		
		assert.equal('undefined', typeof search);
	});
	
	it('should not get a profile because it is very sensitive', function (done) {
		var search = fixture.controller
			.model('profile')
			.detail()
			.process({ profile_id: fixture.profile.profile_id });
		
		search.getRow(function(error, row) {
			assert.equal(null, error);
			assert.equal(null, row);
			done();
		});
	});
};