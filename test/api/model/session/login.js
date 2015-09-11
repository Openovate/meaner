var assert = require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should validate login fields', function () {
		var errors = fixture.controller.model('session').login().errors({});
		
		assert.equal('Cannot be empty!', errors.auth_slug);
		
		errors = fixture.controller.model('session').login().errors({
			auth_slug: '123' 
		});
		
		assert.equal('undefined', typeof errors.auth_slug);
	});
	
	it('should not login', function (done) {
		fixture.controller.model('session').login().process({}, function(error, row) {
			assert.equal('string', typeof error);
			done();
		});
	});
	
	it('should login', function (done) {
		fixture.controller.model('session').login().process({
			auth_slug		: fixture.auth.auth_slug,
			auth_password	: fixture.auth_password,
		}, function(error, row) {
			assert.equal(null, error);
			assert.equal(
				fixture.profile.profile_name, 
				row.profile_name);
			
			done();
		});
	});
};