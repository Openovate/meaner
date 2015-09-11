var assert = require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should validate file fields', function () {
		var errors = fixture.controller
			.model('file')
			.detail()
			.errors({});
		
		assert.equal('string', typeof errors.file_id);
		
		errors = fixture.controller
			.model('file')
			.detail()
			.errors({ file_id: 'asd' });
		
		assert.equal('string', typeof errors.file_id);
		
		errors = fixture.controller
			.model('file')
			.detail()
			.errors({ file_id: 1 });
		
		assert.equal('undefined', typeof errors.file_id);
	});
	
	it('should not get file', function () {
		var search = fixture.controller
			.model('file')
			.detail()
			.process({});
		
		assert.equal('undefined', typeof search);
	});
	
	it('should get a file', function (done) {
		var search = fixture.controller
			.model('file')
			.detail()
			.process({ file_id: fixture.file.file_id });
		
		search.getRow(function(error, row) {
			assert.equal(null, error);
			assert.equal('http://example.com/sample.jpg', row.file_link);
			done();
		});
	});
};