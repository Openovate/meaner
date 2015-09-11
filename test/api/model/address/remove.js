var assert = require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should validate address fields', function () {
		var errors = fixture.controller.model('address').remove().errors({});
		assert.equal('string', typeof errors.address_id);
		
		errors = fixture.controller.model('address').remove().errors({ address_id: 'asd' });
		assert.equal('string', typeof errors.address_id);
		
		errors = fixture.controller.model('address').remove().errors({ address_id: 1 });
		assert.equal('undefined', typeof errors.address_id);
	});
	
	it('should remove public address', function (done) {
		fixture.controller.model('address').remove().process({ 
			address_id: fixture.public_address 
		}, function(error, row) {
			assert.equal(null, error);
			done();
		});
	});
	
	it('should remove private address', function (done) {
		fixture.controller.model('address').remove().process({ 
			address_id: fixture.private_address 
		}, function(error, row) {
			assert.equal(null, error);
			done();
		});
	});
};