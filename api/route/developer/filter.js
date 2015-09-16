var hash		= require('eden-hash');
var language	= require('eden-language')();
var controller	= require('../../controller');

module.exports = {
	/* Constants
	-------------------------------*/
	FAIL: 'You are not authorized to view this.',
	
	/* Properties
	-------------------------------*/
	/* Methods
	-------------------------------*/
	fail: function(request, response) {
		//set the header
		response.header('content-type', 'text/html');
		
		request.session.message = language.get(this.FAIL);
		request.session.type 	= 'danger';
		
		response.redirect('/developer/login');
	},
	
	success: function(route, request, response) {
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
			.replace(':app', '')
			.replace(/\//ig, ' ')
			.trim()
			.replace(/\s/ig, '-');
		
		if([
			'developer-login', 
			'developer-logout', 
			'developer-create'
		].indexOf(request.action) === -1 && !request.session.me) {
			this.fail(request, response);
			return;
		}
		
		if([
			'developer-login', 
			'developer-create'
		].indexOf(request.action) !== -1 && request.session.me) {
			response.redirect('/app/list');
			return;
		}
		
		next();
	}
};