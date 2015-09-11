var assert = require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should validate fields', function () {
		var errors = fixture.controller.model('session').access().errors({});
		
		assert.equal('Cannot be empty!', errors.client_id);
		assert.equal('Cannot be empty!', errors.client_secret);
		assert.equal('Cannot be empty!', errors.code);
		
		errors = fixture.controller.model('session').access().errors({
			client_id		: '123',
			client_secret	: 123,
			code			: 123
		});
		
		assert.equal('undefined', typeof errors.client_id);
		assert.equal('undefined', typeof errors.client_secret);
		assert.equal('undefined', typeof errors.code);
	});
	
	it('should not access', function (done) {
		fixture.controller.model('session').access().process({}, function(error, row) {
			assert.equal('string', typeof error);
			done();
		});
	});
	
	it('should access', function (done) {
		fixture.controller.model('session').access().process({
			client_id		: fixture.config.test.app_token,
			client_secret	: fixture.config.test.app_secret,
			code			: fixture.session.session_token
		}, function(error, model) {
			assert.equal(null, error);
			
			assert.equal('string', typeof model.access_token);
			assert.equal('string', typeof model.access_secret);
			
			assert.equal(fixture.profile_name, model.profile_name);
			assert.equal(fixture.file_link, model.profile_image);
			
			fixture.session = model;
			
			done();
		});
	});
};