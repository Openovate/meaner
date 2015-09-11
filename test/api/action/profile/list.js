var assert 	= require('assert');
var request = require('supertest');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should get a public list', function(done) {
		var test = request(fixture.controller.server)
			.get('/rest/profile/list/?client_id=' + fixture.config.test.app_token)
			.set('Accept', 'text/json')
			.expect('Content-Type', /json/)
			.expect(200);
		
		test.end(function(error, response) {
			if (error) {
				return done(error);
			}
			
			if(response.body && response.body.error) {
				return done(new Error(response.body.message || 'Unknown Error'));
			}
			
			assert.equal('object', typeof response.body);
			assert.equal('object', typeof response.body.results);
			assert.equal(true, response.body.results.rows instanceof Array);
			
			if(response.body.results.rows[1]) {
				assert.equal('undefined', typeof response.body.results.rows[1].profile_email);	
			}
			
			done();
		});
	});
};