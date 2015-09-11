var assert = require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should validate auth fields', function () {
		var errors = fixture.controller.model('auth').create().errors({});
		
		assert.equal('Cannot be empty!', errors.auth_slug);
		assert.equal('Cannot be empty!', errors.auth_permissions);
		assert.equal('Cannot be empty!', errors.auth_password);
		assert.equal('Cannot be empty!', errors.confirm);
		
		errors = fixture.controller.model('auth').create().errors({
			auth_slug			: 'TEST AUTH',
			auth_permissions	: 'test_permissions_1,test_permissions_2',
			auth_password		: '123456',
			confirm				: '123456' });
		
		assert.equal('undefined', typeof errors.auth_slug);
		assert.equal('undefined', typeof errors.auth_permissions);
		assert.equal('undefined', typeof errors.auth_password);
		assert.equal('undefined', typeof errors.confirm);
		
		errors = fixture.controller.model('auth').create().errors({
			auth_slug			: '',
			auth_permissions	: '',
			auth_password		: '',
			confirm				: '' });
		
		assert.equal('string', typeof errors.auth_slug);
		assert.equal('string', typeof errors.auth_permissions);
		assert.equal('string', typeof errors.auth_password);
		assert.equal('string', typeof errors.confirm);
		
		errors = fixture.controller.model('auth').create().errors({
			auth_slug			: 12345,
			auth_permissions	: '0',
			auth_password		: '0',
			confirm				: '1' });
		
		assert.equal('undefined', typeof errors.auth_slug);
		assert.equal('undefined', typeof errors.auth_permissions);
		assert.equal('undefined', typeof errors.auth_password);
		assert.equal('string', typeof errors.confirm);
	});
	
	it('should not create an auth', function (done) {
		fixture.controller.model('auth').create().process({}, function(error, model) {
			assert.equal('string', typeof error);
			done();
		});
	});
	
	it('should create an auth', function (done) {
		fixture.controller.model('auth').create().process({
			auth_slug			: 'TEST AUTH '+Date.now(),
			auth_permissions	: 'test_permissions_1,test_permissions_2',
			auth_password		: '123456',
			confirm				: '123456' 
		}, function(error, model) {
			assert.equal(null, error);
			assert.equal('number', typeof model.auth_id);
			
			fixture.auth = model.get();
			
			done();
		});
	});
};