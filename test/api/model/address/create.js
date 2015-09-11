var assert = require('assert');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should validate address fields', function () {
		var errors = fixture.controller.model('address').create().errors({});
		
		assert.equal('Cannot be empty!', errors.address_street);
		assert.equal('Cannot be empty!', errors.address_city);
		assert.equal('Cannot be empty!', errors.address_country);
		assert.equal('Cannot be empty!', errors.address_postal);
		
		errors = fixture.controller.model('address').create().errors({
			address_street	: '123 Sesame Street',
			address_city	: 'New York',
			address_country	: 'PH',
			address_postal	: '12345' });
		
		assert.equal('undefined', typeof errors.address_street);
		assert.equal('undefined', typeof errors.address_city);
		assert.equal('undefined', typeof errors.address_country);
		assert.equal('undefined', typeof errors.address_postal);
		
		errors = fixture.controller.model('address').create().errors({
			address_street	: '',
			address_city	: '',
			address_country	: '',
			address_postal	: '' });
		
		assert.equal('string', typeof errors.address_street);
		assert.equal('string', typeof errors.address_city);
		assert.equal('string', typeof errors.address_country);
		assert.equal('string', typeof errors.address_postal);
		
		errors = fixture.controller.model('address').create().errors({
			address_street	: '0',
			address_city	: '0',
			address_country	: '0',
			address_postal	: 12345 });
		
		assert.equal('undefined', typeof errors.address_street);
		assert.equal('undefined', typeof errors.address_city);
		assert.equal('undefined', typeof errors.address_country);
		assert.equal('undefined', typeof errors.address_postal);
	});
		
	it('should not create address', function (done) {
		fixture.controller.model('address').create().process({}, function(error, model) {
			assert.equal('string', typeof error);
			done();
		});
	});
	
	it('should create a private address', function (done) {
		fixture.controller.model('address').create().process({
			address_street	: 'TEST PRIVATE 123 Sesame Street',
			address_city	: 'New York',
			address_country	: 'PH',
			something_rand	: 'okay random',
			address_postal	: '12345' 
		}, function(error, model) {
			assert.equal(null, error);
			assert.equal('number', typeof model.address_id);
			fixture.private_address = model.address_id;
			done();
		});
	});
	
	it('should create a public address', function (done) {
		fixture.controller.model('address').create().process({
			address_street	: 'TEST PUBLIC 123 Sesame Street',
			address_city	: 'New York',
			address_country	: 'PH',
			something_rand	: 'okay random',
			address_postal	: '12345',
			address_public	: 1 
		}, function(error, model) {
			assert.equal(null, error);
			assert.equal('number', typeof model.address_id);
			fixture.public_address = model.address_id;
			done();
		});
	});
};