var assert = require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should validate fields', function () {
		var errors = fixture.controller.model('session').request().errors({});
		
		assert.equal('Invalid ID', errors.app_id);
		assert.equal('Invalid ID', errors.auth_id);
		
		errors = fixture.controller.model('session').request().errors({
			app_id	: '123',
			auth_id	: 123
		});
		
		assert.equal('undefined', typeof errors.app_id);
		assert.equal('undefined', typeof errors.auth_id);
	});
	
	it('should not request', function (done) {
		fixture.controller.model('session').request().process({}, function(error, row) {
			assert.equal('string', typeof error);
			done();
		});
	});
	
	it('should request', function (done) {
		fixture.controller.model('session').request().process({
			app_id	: fixture.app.app_id,
			auth_id	: fixture.auth.auth_id,
			session_permissions: fixture.config.test.scope.join(',')
		}, function(error, model) {
			assert.equal(null, error);
			assert.equal('string', typeof model.session_token);
			
			fixture.session = model.get();
			done();
		});
	});
};