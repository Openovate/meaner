var assert 	= require('assert');
var request = require('supertest');

module.exports = function(fixture) {
	fixture = fixture || {};
	
	it('should get my sensitive details', function(done) {
		var test = request(fixture.controller.server)
			.get('/rest/profile/detail/'
				+ fixture.me.profile_id
				+ '?client_id='
				+ fixture.config.test.app_token)
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
			assert.equal('number', typeof response.body.results.profile_id);
			assert.equal(true, typeof response.body.results.profile_email !== 'undefined');
			assert.equal(true, typeof response.body.results.profile_phone !== 'undefined');
			
			done();
		});
	});
	
	it('should get your insensitive details', function(done) {
		var test = request(fixture.controller.server)
			.get('/rest/profile/detail/'
				+ fixture.you.profile.profile_id
				+ '?client_id='
				+ fixture.config.test.app_token)
			.set('Accept', 'text/json')
			.expect('Content-Type', /json/)
			.expect(200);
		
		test.end(function(error, response){
			if (error) {
				return done(error);
			}
			
			if(response.body && response.body.error) {
				return done(new Error(response.body.message || 'Unknown Error'));
			}
			
			assert.equal('object', typeof response.body);
			assert.equal('object', typeof response.body.results);
			assert.equal('number', typeof response.body.results.profile_id);
			assert.equal('undefined', typeof response.body.results.profile_email);
			assert.equal('undefined', typeof response.body.results.profile_phone);
			
			done();
		});
	});
	
	it('should get your sensitive details', function(done) {
		var test = request(fixture.controller.server)
			.get('/rest/user/profile/detail'
				+ '?access_token='
				+ fixture.you.session.access_token)
			.set('Accept', 'text/json')
			.expect('Content-Type', /json/)
			.expect(200);
		
		test.end(function(error, response){
			if (error) {
				return done(error);
			}
			
			if(response.body && response.body.error) {
				return done(new Error(response.body.message || 'Unknown Error'));
			}
			
			assert.equal('object', typeof response.body);
			assert.equal('object', typeof response.body.results);
			assert.equal('number', typeof response.body.results.profile_id);
			assert.equal(true, typeof response.body.results.profile_email !== 'undefined');
			assert.equal(true, typeof response.body.results.profile_phone !== 'undefined');
			
			done();
		});
	});
};