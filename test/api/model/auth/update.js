var assert = require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should validate auth fields', function () {
		var errors = fixture.controller.model('auth').update().errors({});
		
		assert.equal('string', typeof errors.auth_id);
		assert.equal('undefined', typeof errors.auth_slug);
		assert.equal('undefined', typeof errors.auth_permissions);
		assert.equal('undefined', typeof errors.auth_password);
		assert.equal('undefined', typeof errors.confirm);
		
		errors = fixture.controller.model('auth').update().errors({
			auth_id				: fixture.auth.auth_id,
			auth_slug			: 'TEST AUTH',
			auth_permissions	: 'test_permissions_1,test_permissions_2',
			auth_password		: '123456',
			confirm				: '123456' });
		
		assert.equal('undefined', typeof errors.auth_id);
		assert.equal('undefined', typeof errors.auth_slug);
		assert.equal('undefined', typeof errors.auth_permissions);
		assert.equal('undefined', typeof errors.auth_password);
		assert.equal('undefined', typeof errors.confirm);
		
		errors = fixture.controller.model('auth').update().errors({
			auth_id				: fixture.auth.auth_id,
			auth_name			: 12345,
			auth_permissions	: '0',
			auth_password		: '0',
			confirm				: '1' });
		
		assert.equal('undefined', typeof errors.auth_id);
		assert.equal('undefined', typeof errors.auth_slug);
		assert.equal('undefined', typeof errors.auth_permissions);
		assert.equal('undefined', typeof errors.auth_password);
		assert.equal('string', typeof errors.confirm);
	});
	
	it('should update auth', function (done) {
		fixture.controller.model('auth').update().process({
			auth_id				: fixture.auth.auth_id,
			auth_facebook_token	: '1234567890' }, 
		function(error, model) {
			assert.equal(null, error);
			assert.equal('1234567890', model.auth_facebook_token);
			done();
		});
	});
};