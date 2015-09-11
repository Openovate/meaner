/* Required
-------------------------------*/
/* Definition
-------------------------------*/
module.exports = {
	/* Constants
	-------------------------------*/
	FAIL_EXISTS 	: 'Email exists.',
	FAIL_VALIDATION : 'There are some errors on the form.',
	SUCCESS			: 'You can now Log In!',
	
	/* Properties
	-------------------------------*/
	title: 'Sign Up',
	
	/* Contruct
	-------------------------------*/
	constructor: function() {
		this.data.logo = true;
		
		//if there's a session
		if(this.me) {
			//no need to login
			return this.success();
		}
		
		//if it's a post
		if(this.request.method === 'POST') {
			return this.check();
		}
		
		this.data.query = this.request.url.split('?')[1];
		
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
			this.item.auth_slug 		= this.item.profile_email;
			this.item.auth_permissions 	= this.controller.config('scope').join(',');
			this.item.profile_type		= 'buyer';
			
			next();
		})
		
		//validate
		.then(function(next) {
			var errors = this.controller
				.model('auth')
				.create()
				.errors(this.item);
			
			errors = this.controller
				.model('profile')
				.create()
				.errors(this.item, errors);
			
			//if there are errors
			if(Object.keys(errors).length) {
				return this.fail(this.FAIL_VALIDATION, errors, this.item);
			}
			
			next()
		})
		
		//process
		.then(function(next) {
			this.controller.job('auth-create')({
				data: { item: this.item }
			}, next);
		})
		
		//end
		.then(function(error, results, next) {
			if(error) {
				return this.fail(error.toString());	
			}
			
			//success
			var query = this.request.url.split('?')[1];
			
			this.request.session.message = this.SUCCESS;
			this.request.session.type 	 = 'success';
			this.response.redirect('/dialog/login?' + query);
		});
	}
};