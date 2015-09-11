var assert = require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should validate app fields', function () {
		var errors = fixture.controller.model('app').remove().errors({});
		assert.equal('string', typeof errors.app_id);
		
		errors = fixture.controller.model('app').remove().errors({ app_id: 'asd' });
		assert.equal('string', typeof errors.app_id);
		
		errors = fixture.controller.model('app').remove().errors({ app_id: 1 });
		assert.equal('undefined', typeof errors.app_id);
	});
	
	it('should remove app', function (done) {
		fixture.controller.model('app').remove().process({ 
			app_id: fixture.app.app_id 
		}, function(error, row) {
			assert.equal(null, error);
			done();
		});
	});
};