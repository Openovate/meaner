var assert 	= require('assert');
var request = require('supertest');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should update my profile', function(done) {
		var test = request(fixture.controller.server)
			.post('/rest/profile/update')
			.send({
				profile_name	: 'Automated Test Update',
				access_token	: fixture.config.test.app_token,
				access_secret	: fixture.config.test.app_secret })
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
			
			assert.equal(false, response.body.error);
			
			done();
		});
	});
	
	
	it('should update your profile', function(done) {
		var test = request(fixture.controller.server)
			.post('/rest/user/profile/update')
			.send({
				profile_name	: 'Automated Test Update',
				access_token	: fixture.you.session.access_token,
				access_secret	: fixture.you.session.access_secret })
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
			
			assert.equal(false, response.body.error);
			
			done();
		});
	});
};