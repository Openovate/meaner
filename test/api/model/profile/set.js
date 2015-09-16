var assert = require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should validate profile fields', function () {
		var errors = fixture.controller.model('profile').set().errors({});
		
		assert.equal('You need to provide either an email or id.', errors.profile_id);
		assert.equal('You need to provide either an email or id.', errors.profile_email);
		
		errors = fixture.controller.model('profile').set().errors({
			profile_email: 'test@test.com' 
		});
		
		assert.equal('undefined', typeof errors.profile_email);
		
		errors = fixture.controller.model('profile').set().errors({
			profile_id: 123 
		});
		
		assert.equal('undefined', typeof errors.profile_id);
	});
	
	it('should not create profile', function (done) {
		fixture.controller.model('profile').set().process({}, function(error, model) {
			assert.equal('string', typeof error);
			done();
		});
	});
	
	it('should create a profile', function (done) {
		fixture.controller.model('profile').create().process({
			profile_name	: 'Automated Test',
			profile_email	: 'test@test.com' 
		}, function(error, model) {
			assert.equal(null, error);
			assert.equal('number', typeof model.profile_id);
			fixture.set = model.get();
			done();
		});
	});
	
	it('should update a profile', function (done) {
		fixture.controller.model('profile').set().process({
			profile_email	: 'test@test.com' 
		}, function(error, model) {
			assert.equal(null, error);
			assert.equal(fixture.set.profile_id, model.profile_id);
			done();
		});
	});
	
	it('should change the email', function (done) {
		fixture.controller.model('profile').set().process({
			profile_id		: fixture.set.profile_id,
			profile_email	: 'test2@test.com' 
		}, function(error, model) {
			assert.equal(null, error);
			assert.equal(fixture.set.profile_id, model.profile_id);
			assert.equal('test2@test.com', model.profile_email);
			done();
		});
	});
};