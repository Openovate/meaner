var assert = require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should validate file fields', function () {
		var errors = fixture.controller.model('file').create().errors({});
		
		assert.equal('Cannot be empty!', errors.file_data);
		assert.equal('Cannot be empty!', errors.file_link);
		
		errors = fixture.controller.model('file').create().errors({
			imageOnly	: true, 
			file_data	: 'data:application/jpg;base64,data'
		});
		
		assert.equal('string', typeof errors.file_data);
		
		errors = fixture.controller.model('file').create().errors({
			imageOnly	: true, 
			file_link	: 'http://example.com/sample.pdf'
		});
		
		assert.equal('string', typeof errors.file_link);
		
		
		errors = fixture.controller.model('file').create().errors({
			imageOnly	: true, 
			file_data	: 'data:image/jpg;base64,data'
		});
		
		assert.equal('undefined', typeof errors.file_data);
		
		errors = fixture.controller.model('file').create().errors({
			imageOnly	: true, 
			file_link	: 'http://example.com/sample.jpg'
		});
		
		assert.equal('undefined', typeof errors.file_link);
	});
	
	it('should not create file', function (done) {
		fixture.controller.model('file').create().process({}, function(error, model) {
			assert.equal('string', typeof error);
			done();
		});
	});
	
	it('should create a file', function (done) {
		fixture.controller.model('file').create().process({ 
			file_link: 'http://example.com/sample.jpg' 
		}, function(error, model) {
			assert.equal(null, error);
			assert.equal('number', typeof model.file_id);
			fixture.file = model.get();
			done();
		});
	});
};