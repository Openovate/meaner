var assert = require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should validate address fields', function () {
		var errors = fixture.controller.model('address').update().errors({});
		
		assert.equal('undefined', typeof errors.address_street);
		assert.equal('undefined', typeof errors.address_city);
		assert.equal('undefined', typeof errors.address_country);
		assert.equal('undefined', typeof errors.address_postal);
		
		errors = fixture.controller.model('address').update().errors({
			address_street	: '123 Sesame Street',
			address_city	: 'New York',
			address_country	: 'PH',
			address_postal	: '12345' });
		
		assert.equal('string', typeof errors.address_id);
		assert.equal('undefined', typeof errors.address_street);
		assert.equal('undefined', typeof errors.address_city);
		assert.equal('undefined', typeof errors.address_country);
		assert.equal('undefined', typeof errors.address_postal);
		
		errors = fixture.controller.model('address').update().errors({
			address_id		: fixture.public_address,
			address_street	: '0',
			address_city	: '0',
			address_country	: '0',
			address_postal	: 12345 });
		
		assert.equal('undefined', typeof errors.address_id);
		assert.equal('undefined', typeof errors.address_street);
		assert.equal('undefined', typeof errors.address_city);
		assert.equal('undefined', typeof errors.address_country);
		assert.equal('undefined', typeof errors.address_postal);
	});
	
	it('should update address', function (done) {
		fixture.controller.model('address').update().process({
			address_id		: fixture.public_address,
			address_country	: 'US' }, 
		function(error, model) {
			assert.equal(null, error);
			assert.equal('US', model.address_country);
			done();
		});
	});
};