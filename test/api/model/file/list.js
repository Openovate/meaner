var assert = require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should get files', function (done) {
		var search = fixture.controller
			.model('file')
			.list()
			.process({});
		
		search.getRows(function(error, rows) {
			rows.forEach(function(row) {
				assert.equal(1, row.file_active);
			});
			
			done();
		});
	});
};