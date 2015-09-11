var assert = require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should validate address fields', function () {
		var errors = fixture.controller
			.model('address')
			.detail()
			.errors({});
		
		assert.equal('string', typeof errors.address_id);
		
		errors = fixture.controller
			.model('address')
			.detail()
			.errors({ address_id: 'asd' });
		
		assert.equal('string', typeof errors.address_id);
		
		errors = fixture.controller
			.model('address')
			.detail()
			.errors({ address_id: 1 });
		
		assert.equal('undefined', typeof errors.address_id);
	});
	
	it('should not get address', function () {
		var search = fixture.controller
			.model('address')
			.detail()
			.process({});
		
		assert.equal('undefined', typeof search);
	});
	
	it('should get public address', function (done) {
		var search = fixture.controller
			.model('address')
			.detail()
			.process({ address_id: fixture.public_address });
		
		search.getRow(function(error, row) {
			assert.equal(null, error);
			assert.equal('TEST PUBLIC 123 Sesame Street', row.address_street);
			done();
		});
	});
	
	it('should get private address', function (done) {
		var search = fixture.controller
			.model('address')
			.detail()
			.process({ address_id: fixture.private_address });
		
		search.getRow(function(error, row) {
			assert.equal(null, error);
			assert.equal('TEST PRIVATE 123 Sesame Street', row.address_street);
			done();
		});
	});
};