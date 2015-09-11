var assert = require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should validate app fields', function () {
		var errors = fixture.controller.model('app').update().errors({});
		
		assert.equal('undefined', typeof errors.app_name);
		assert.equal('undefined', typeof errors.app_permissions);
		
		errors = fixture.controller.model('app').update().errors({
			app_name		: 'TEST APP',
			app_permissions	: 'test_permissions_1,test_permissions_2' });
		
		assert.equal('string'	, typeof errors.app_id);
		assert.equal('undefined', typeof errors.app_name);
		assert.equal('undefined', typeof errors.app_permissions);
		
		errors = fixture.controller.model('app').update().errors({
			app_id			: fixture.app.app_id, 
			app_name		: 12345,
			app_permissions	: '0'});
		
		assert.equal('undefined', typeof errors.app_id);
		assert.equal('undefined', typeof errors.app_name);
		assert.equal('undefined', typeof errors.app_permissions);
	});
	
	it('should update app', function (done) {
		fixture.controller.model('app').update().process({
			app_id			: fixture.app.app_id,
			app_website		: 'http://example.com' 
		}, function(error, model) {
			assert.equal(null, error);
			assert.equal('http://example.com', model.app_website);
			done();
		});
	});
};