var syncopate	= require('syncopate');
var hash		= require('eden-hash');
var language	= require('eden-language')();
var controller	= require('../../controller');

module.exports = {
	/* Constants
	-------------------------------*/
	INVALID: 'Invalid Request',
	
	/* Properties
	-------------------------------*/
	/* Methods
	-------------------------------*/
	fail: function(request, response) {
		//set the header
		response.header('content-type', 'application/json');
		response.json({ error: true, message: this.INVALID });
	},
	
	success: function(route, request, response, next) {
		//set the header
		response.header('content-type', 'application/json');
		
		var parent 		= require('./action');
		
		try {
			var child = controller.action(request.action);
		} catch(e) {
			//if it's a user action
			if(request.action.indexOf('rest-user-') === 0) {
				request.action = request.action.replace('user-', '');
				var child = controller.action(request.action);
			} else {
				throw e;
			}
		}
		
		//we are doing this way to clone the object
		var action 	= function() {
			this.data = {};
			
			//inject properties
			this.request 	= request;
			this.response 	= response;
			this.controller	= controller;
			
			//inject shortcuts
			this.session 	= request.session;
			this.params 	= request.params;
			this.query		= request.query;
			this.body		= controller.validate().prepare(request.body || {});
			this.me			= request.session.me;
			this.source		= request.source;
			
			this.item 		= {}; 
			if(typeof this.body === 'object' && Object.keys(this.body).length) {
				this.item = hash().merge({}, this.body);
			} else if(typeof this.query === 'object' && Object.keys(this.query).length) {
				this.item = hash().merge({}, this.query);
			}
			
			//inject sync
			this.then = syncopate().scope(this).then;
			
			if(this.request.session.message) {
				this.data.type 	= this.request.session.type || 'info';
				this.data.message = language.get(this.request.session.message);
			}
			
			if(typeof this.constructor === 'function') {
				this.constructor.call(this);
				return;
			}
			
			throw new Error(request.path + ' needs a constructor');
		};
		
		//ghetto inheritence
		action.prototype = hash().merge(parent, child);
		
		new action();
	},
	
	validate: function(route, request, response, next) {
		request.action	= route.path
			.replace(':id', '')
			.replace(/\//ig, ' ')
			.trim()
			.replace(/\s/ig, '-');
		
		request.role = route.role || '';
		
		//can be access_token access_secret
		var token = request.query.access_token 
		  || request.body.access_token 
		  || request.query.client_id 
		  || request.body.client_id 
		  || null;
	
		var secret = request.query.access_secret 
		  || request.body.access_secret
		  || request.query.client_secret 
		  || request.body.client_secret
		  || null;
		
		//must have access token
		//if not get must have access secret
		//a flattened if looks very confusing
		//lets test this case more rudimentary
		
		//if there is no token in general
		if(!token) {
			//all rest must include an access token
			this.fail(request, response);
			return;
		}
		
		//if it's not a GET
		if(request.method.toUpperCase() !== 'GET' && !secret) {
			this.fail(request, response);
			return;
		} 
		
		//if user
		if(request.role.indexOf('user_') === 0) {
			//retreive the permissions based on the session token and session secret
			var search = controller.database
				.search('session')
				.setColumns('session.*', 'profile.*', 'app.*')
				.innerJoinOn('session_app', 'session_app_session = session_id')
				.innerJoinOn('app', 'session_app_app = app_id')
				.innerJoinOn('session_auth', 'session_auth_session = session_id')
				.innerJoinOn('auth_profile', 'auth_profile_auth = session_auth_auth')
				.innerJoinOn('profile', 'auth_profile_profile = profile_id')
				.filterBySessionToken(token)
				.filterBySessionStatus('ACCESS')
				.addFilter('session_permissions LIKE ?', '%' + request.role + '%');
			
			if(secret) {
				search.filterBySessionSecret(secret);
			}
			
			search.getRow(function(error, row) {
				if(error || !row) {
					this.fail(request, response);
					return;
				}
				
				request.source = row;
				
				next();
			}.bind(this));
			
			return;
		}
		
		//if anything else
		//retreive the permissions based on the app token and app secret
		var search = controller.database
			.search('app')
			.setColumns('profile.*', 'app.*')
			.innerJoinOn('app_profile', 'app_profile_app = app_id')
			.innerJoinOn('profile', 'app_profile_profile = profile_id')
			.filterByAppToken(token);
			
		if(request.role && request.role.length) {
			search.addFilter('app_permissions LIKE ?', '%' + request.role + '%');
		}
		
		if(secret) {
			search.filterByAppSecret(secret);
		}
		
		search.getRow(function(error, row) {
			if(error || !row) {
				this.fail(request, response);
				return;
			}
			
			request.source = row;
			
			request.source.access_token = token; 
			request.source.access_secret = secret;
		
			next();
		}.bind(this));
	}
};