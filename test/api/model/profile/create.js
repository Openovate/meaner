var assert = require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should validate profile fields', function () {
		var errors = fixture.controller.model('profile').create().errors({});
		
		assert.equal('Cannot be empty!', errors.profile_name);
		
		errors = fixture.controller.model('profile').create().errors({
			profile_name: '123' 
		});
		
		assert.equal('undefined', typeof errors.profile_name);
	});
	
	it('should not create profile', function (done) {
		fixture.controller.model('profile').create().process({}, function(error, model) {
			assert.equal('string', typeof error);
			done();
		});
	});
	
	it('should create a profile', function (done) {
		fixture.controller.model('profile').create().process({
			profile_name	: '123' 
		}, function(error, model) {
			assert.equal(null, error);
			assert.equal('number', typeof model.profile_id);
			fixture.profile = model.get();
			done();
		});
	});
};