/* Required
-------------------------------*/
var hash	= require('eden-hash')();

/* Definition
-------------------------------*/
module.exports = {
	/* Constants
	-------------------------------*/
	FAIL_NOT_ME 	: 'You do not have permissions to update',
	FAIL_VALIDATION : 'There are some errors on the form.',
	SUCCESS			: 'Account settings updated!',
	
	/* Properties
	-------------------------------*/
	title: 'Update Account',
	
	/* Construct
	-------------------------------*/
	/**
	 * Main action call
	 *
	 * @param object Request Object
	 * @param object Response Object
	 * @param function callback to pass to next Middleware
	 * @return void
	 */
	constructor: function() {
		this.data.blank = true;
		
		//there should be a client_id, redirect_uri
		//client_id is already checked in the router
		//state is optional
		if(!this.query.redirect_uri
		|| !this.query.redirect_uri.length) {
			this.template = 'dialog-invalid';
			return this.output();
		}
		
		//if they are not logged in
		//we cannot redirect them to be logged in
		//because we need to know the permissions
		if(!this.me) {
			this.redirect({ error: 'user_invalid' });
			return;
		}
		
		//if it's a post
		if(this.request.method === 'POST') {
			return this.check();
		}
		
		this.data.item 		= this.me;
		this.data.cancel 	= this.redirect({ error: 'user_cancel' }, true);
		
		//Just load the page
		return this.output();
	},
	
	/* Methods
	-------------------------------*/	
	/**
	 * When the form is submitted
	 *
	 * @return void
	 */
	check: function() {
		//get the item
		this.then(function(next) {
			this.item.auth_id 	= this.me.auth_id;
			this.item.profile_id = this.me.profile_id;
			
			next();
		})
		
		//validate 
		.then(function(next) {
			var errors = this.controller
				.model('auth')
				.update()
				.errors(this.item);
			
			errors = this.controller
				.model('profile')
				.update()
				.errors(this.item, errors);
			
			//if there are errors
			if(Object.keys(errors).length) {
				return this.fail(this.FAIL_VALIDATION, errors, this.item);
			}
			
			next();
		})
		
		//validate exists
		.then(function(next) {
			this.controller
				.model('auth')
				.exists(this.item.profile_email, next);
		})
		
		//process
		.then(function(error, exists, next) {
			if(error) {
				return this.fail(error);
			}
			
			//if exists, make sure it's me
			if(exists && this.me.auth_slug !== this.item.profile_email) {
				return this.fail(this.FAIL_NOT_ME);	
			}
			
			this.controller.job('auth-update')({
				data: { item: this.item }
			}, next);
		})
		
		//end
		.then(function(error, results, next) {
			if(error) {
				return this.fail(error);
			}
			
			//assign a update session
			this.request.session.me.auth_slug 		= this.item.auth_slug;
			this.request.session.me.auth_updated 	= results.auth.auth_updated;
			this.request.session.me.profile_name 	= this.item.profile_name;
			this.request.session.me.profile_email 	= this.item.profile_email;
			this.request.session.me.profile_updated = results.profile.profile_updated;
			
			//success
			this.redirect({ success: 1 });
		});
	},
	
	/**
	 * Creates a redirect url
	 *
	 * @param string the url
	 * @param object extra parameters
	 * @return string
	 */
	redirect: function(query, returnUrl) {
		query = query || {};
		
		var url = this.request.query.redirect_uri;
		
		if(this.request.query.state) {
			query.state = this.request.query.state;
		}
		
		query = hash.toQuery(query);
		
		if(!query.length) {		
			if(returnUrl) {
				return url;
			}
			
			this.response.redirect(url);
			return;
		}
		
		var separator = '?';
		if(url.indexOf('?') !== -1) {
			separator = '&';
		}
		
		if(returnUrl) {
			return url + separator + query;
		}
		
		this.response.redirect(url + separator + query);
	}
};