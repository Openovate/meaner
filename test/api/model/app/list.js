var assert = require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should get active apps', function (done) {
		var search = fixture.controller.model('app').list().process({});
		
		search.getRows(function(error, rows) {
			rows.forEach(function(row) {
				assert.equal(1, row.app_active);
			});
			
			done();
		});
	});
};