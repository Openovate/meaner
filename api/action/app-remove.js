/* Required
-------------------------------*/
/* Definition
-------------------------------*/
module.exports = {
	/* Constants
	-------------------------------*/
	FAIL_NOT_EXISTS		: 'App does not exist',
	FAIL_PERMISSIONS	: 'You do not have permissions to remove',
	SUCCESS				: 'Tokens successfully removed!',
	
	/* Properties
	-------------------------------*/
	/* Constructor
	-------------------------------*/
	constructor: function() {
		//get the item
		this.then(function(next) {
			this.item = { 
				app_id		: parseInt(this.params.id),
				profile_id	: this.me.profile_id };
			
			next();
		})
		
		//validate
		.then(function(next) {
			//get errors
			var errors = this.controller
				.model('app')
				.remove()
				.errors(this.item);
			
			
			//if errors, fail
			if(errors.app_id) {
				return this.fail(errors.app_id, '/app/list');
			}
			
			next();
		})
		
		//check permissions
		.then(function(next) {
			this.controller
				.model('app')
				.permissions(
					this.item.app_id, 
					this.item.profile_id, 
					next);
		})
		
		//remove
		.then(function(error, yes, next) {
			if(error) {
				return this.fail(error.toString(), '/app/list');
			}
			
			//if not permitted, fail
			if(!yes) {
				return this.fail(this.FAIL_PERMISSIONS, '/app/list');
			}
			
			this.controller.job('app-remove')({
				data: { item: this.item }
			}, next);
		})
		
		//end
		.then(function(error, row, next) {
			if(error) {
				return this.fail(error.toString(), '/app/list');	
			}
			
			//success
			this.success(this.SUCCESS, '/app/list');
		});
	}
};
