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
		response.header('content-type', 'text/html');
		
		response.render('dialog-invalid', {
			blank	: true,
			title	: language.get(this.INVALID),
			id		: 'invalid' });
	},
	
	success: function(role, request, response, next) {
		//set the header
		response.header('content-type', 'text/html');
		
		var parent 	= require('./action');
		var child 	= controller.action(request.action);
		
		//we are doing this way to clone the object
		var action 	= function() {
			this.data = {};
			
			//inject properties
			this.request 	= request;
			this.response 	= response;
			this.controller	= controller;
			this.model		= controller.model.bind(controller);
			this.job		= controller.job.bind(controller);
			this.queue		= controller.queue;
			
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
			this.sync = function() {
				var args = Array.prototype.slice.apply(arguments);
				args.unshift(this);
				return controller.sync.apply(controller, args);
			};
			
			//inject template data
			this.data.id	= this.template = request.action;
			this.data.me 	= request.session.me;
			
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
		
		request.role = route.role;
		
		//the limitations of dialog is that it doesn't pass a secret
		
		//can be access_token 
		var token = request.query.access_token 
		  || request.body.access_token 
		  || request.query.client_id 
		  || request.body.client_id 
		  || null;
		
		//must have access token
		//if not get must have access secret
		//a flattened if looks very confusing
		//lets test this case more rudimentary
		
		//if there is no token in general
		if(!token) {
			//all dialogs must include an access token
			this.fail(request, response);
			return;
		}
		
		//if anything else
		//retreive the permissions based on the app token and app secret
		var search = controller
			.database.search('app')
			.filterByAppToken(token)
			.addFilter('app_permissions LIKE ?', '%' + request.role + '%');
		
		search.getRow(function(error, row) {
			if(error || !row) {
				//all dialogs must include an access token
				this.fail(request, response);
				return;
			}
			
			request.source = row;
			
			next();
		}.bind(this));
	}
};