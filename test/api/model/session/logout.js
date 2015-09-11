var assert = require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should validate logout fields', function () {
		var errors = fixture.controller.model('session').logout().errors({});
		
		assert.equal('Invalid ID', errors.auth_id);
		
		errors = fixture.controller.model('session').logout().errors({
			auth_id: '123' 
		});
		
		assert.equal('undefined', typeof errors.auth_id);
	});
	
	it('should not logout', function (done) {
		fixture.controller.model('session').logout().process({}, function(error, row) {
			assert.equal('string', typeof error);
			done();
		});
	});
	
	it('should logout', function (done) {
		fixture.controller.model('session').logout().process({
			auth_id			: fixture.auth.auth_id,
		}, function(error, row) {
			assert.equal(null, error);
			done();
		});
	});
};