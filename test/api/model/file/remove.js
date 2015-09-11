var assert = require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should validate file fields', function () {
		var errors = fixture.controller
			.model('file')
			.remove()
			.errors({});
		
		assert.equal('string', typeof errors.file_id);
		
		errors = fixture.controller
			.model('file')
			.remove()
			.errors({ file_id: 'asd' });
		
		assert.equal('string', typeof errors.file_id);
		
		errors = fixture.controller
			.model('file')
			.remove()
			.errors({ file_id: 1 });
		
		assert.equal('undefined', typeof errors.file_id);
	});
	
	it('should remove file', function (done) {
		fixture.controller.model('file').remove().process({ 
			file_id: fixture.file.file_id 
		}, function(error, row) {
			assert.equal(null, error);
			done();
		});
	});
};