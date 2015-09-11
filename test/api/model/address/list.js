var assert = require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should get public addresses', function (done) {
		var search = fixture.controller.model('address').list().process({});
		
		search.getRows(function(error, rows) {
			rows.forEach(function(row) {
				assert.equal(1, row.address_public);
			});
			
			done();
		});
	});
	
	it('should get private addresses', function (done) {
		var search = fixture.controller.model('address').list().process({ 
			filter: { 
				address_active: 1, 
				address_public: 0 
			}
		});
		
		search.getRows(function(error, rows) {
			rows.forEach(function(row) {
				assert.equal(0, row.address_public);
			});
			
			done();
		});
	});
};