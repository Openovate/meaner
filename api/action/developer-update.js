/* Required
-------------------------------*/
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
	constructor: function() {
		//if it's a post
		if(this.request.method === 'POST') {
			return this.check();
		}
		
		this.data.item = this.me;
		
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
		this.sync()

		//get the item
		.then(function(next) {
			this.item.auth_id 		= this.me.auth_id;
			this.item.profile_id 	= this.me.profile_id;
			
			next();
		})
		
		//validate
		.then(function(next) {
			var errors = this.model('auth')
				.update()
				.errors(this.item);
			
			errors = this.model('profile')
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
			this.model('auth').exists(this.item.profile_email, next);
		})
		
		//process
		.then(function(error, exists, next) {
			if(error) {
				return this.fail(error, {}, this.item);
			}
			
			//if exists, make sure it's me
			if(exists && this.me.auth_slug !== this.item.profile_email) {
				return this.fail(this.FAIL_NOT_ME);	
			}
			
			this.job('auth-update')({
				data: { item: this.item }
			}, next);
		})
		
		//end
		.then(function(error, results, next) {
			if(error) {
				return this.fail(error, {}, this.item);
			}
			
			//assign a update session
			this.request.session.me.auth_slug 		= this.item.auth_slug;
			this.request.session.me.auth_updated 	= results.auth.auth_updated;
			this.request.session.me.profile_name 	= this.item.profile_name;
			this.request.session.me.profile_email 	= this.item.profile_email;
			this.request.session.me.profile_updated = results.profile.profile_updated;
			
			//success
			this.success(this.SUCCESS, '/app/list');
		});
	}
};
