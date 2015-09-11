var assert = require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should validate app fields', function () {
		var errors = fixture.controller.model('app').detail().errors({});
		assert.equal('string', typeof errors.app_id);
		
		errors = fixture.controller.model('app').detail().errors({ app_id: 'asd' });
		assert.equal('string', typeof errors.app_id);
		
		errors = fixture.controller.model('app').detail().errors({ app_id: 1 });
		assert.equal('undefined', typeof errors.app_id);
	});
	
	it('should not get app', function () {
		var search = fixture.controller.model('app').detail().process({});
		
		assert.equal('undefined', typeof search);
	});
	
	it('should get app', function (done) {
		var search = fixture.controller.model('app').detail().process({ app_id: fixture.app.app_id });
		
		search.getRow(function(error, row) {
			assert.equal(null, error);
			assert.equal('TEST APP', row.app_name);
			done();
		});
	});
};