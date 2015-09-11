var assert = require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should get profiles', function (done) {
		var search = fixture.controller.model('profile').list().process({});
		
		search.getRows(function(error, rows) {
			rows.forEach(function(row) {
				assert.equal(1, row.profile_active);
			});
			
			done();
		});
	});
};