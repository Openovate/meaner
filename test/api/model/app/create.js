var assert = require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should validate app fields', function () {
		var errors = fixture.controller.model('app').create().errors({});
		
		assert.equal('Cannot be empty!', errors.app_name);
		assert.equal('Cannot be empty!', errors.app_permissions);
		
		errors = fixture.controller.model('app').create().errors({
			app_name		: 'TEST APP',
			app_permissions	: 'test_permissions_1,test_permissions_2' });
		
		assert.equal('undefined', typeof errors.app_name);
		assert.equal('undefined', typeof errors.app_permissions);
		
		errors = fixture.controller.model('app').create().errors({
			app_name		: '',
			app_permissions	: '' });
		
		assert.equal('string', typeof errors.app_name);
		assert.equal('string', typeof errors.app_permissions);
		
		errors = fixture.controller.model('app').create().errors({
			app_name		: 12345,
			app_permissions	: '0'});
		
		assert.equal('undefined', typeof errors.app_name);
		assert.equal('undefined', typeof errors.app_permissions);
	});
	
	it('should not create an app', function (done) {
		fixture.controller.model('app').create().process({}, function(error, model) {
			assert.equal('string', typeof error);
			done();
		});
	});
	
	it('should create an app', function (done) {
		fixture.controller.model('app').create().process({
			app_name	: 'TEST APP',
			app_permissions	: 'test_permissions_1,test_permissions_2' 
		}, function(error, model) {
			assert.equal(null, error);
			assert.equal('number', typeof model.app_id);
			fixture.app = model.get();
			done();
		});
	});
};