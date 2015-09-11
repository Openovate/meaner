var assert = require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should validate auth fields', function () {
		var errors = fixture.controller.model('auth').remove().errors({});
		assert.equal('string', typeof errors.auth_id);
		
		errors = fixture.controller.model('auth').remove().errors({ auth_id: 'asd' });
		assert.equal('string', typeof errors.auth_id);
		
		errors = fixture.controller.model('auth').remove().errors({ auth_id: 1 });
		assert.equal('undefined', typeof errors.auth_id);
	});
	
	it('should remove auth', function (done) {
		fixture.controller.model('auth').remove().process({ 
			auth_id: fixture.auth.auth_id 
		}, function(error, row) {
			assert.equal(null, error);
			done();
		});
	});
};