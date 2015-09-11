/* Required
-------------------------------*/
/* Definition
-------------------------------*/
module.exports = {
	/* Constants
	-------------------------------*/
	FAIL_NOT_EXISTS	: 'User or Password is incorrect',
	FAIL_VALIDATION	: 'There are some errors on the form.',
	
	/* Properties
	-------------------------------*/
	title			: 'Log In',
	
	/* Construct
	-------------------------------*/
	constructor: function() {
		this.data.logo = true; 
		
		//if it's a post
		if(this.request.method === 'POST') {
			return this.check();
		}
		
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
		//validate
		this.then(function(next) {
			//get errors
			var errors = this.controller
				.model('session')
				.login()
				.errors(this.item);
		
			//if there are errors
			if(Object.keys(errors).length) {
				return this.fail(this.FAIL_VALIDATION, errors, this.item);
			}
			
			next();
		})
		
		//login
		.then(function(next) {
			this.controller
				.model('session')
				.login()
				.process(this.item, next);
		})
		
		//end
		.then(function(error, row, next) {
			if(error) {
				return this.fail(error);	
			}
			
			if(!row) {
				return this.fail(this.FAIL_NOT_EXISTS);
			}
			
			delete row.auth_password;
			
			//assign a new session
			this.request.session.me = row;
			
			//success
			this.response.redirect('/app/list');
		});
	}
};
