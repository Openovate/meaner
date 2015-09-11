/* Required
-------------------------------*/
/* Definition
-------------------------------*/
module.exports = {
	/* Constants
	-------------------------------*/
	SUCCESS	: 'You are now Logged Out!',
	
	/* Properties
	-------------------------------*/
	/* Construct
	-------------------------------*/
	constructor: function() {	
		if(!this.me) {
			return this.success(this.SUCCESS, '/developer/login');
		}
		
		this.item = { auth_id: this.me.auth_id };
		
		var errors = this.controller
			.model('session')
			.logout()
			.errors(this.item);
		
		if(errors.auth_id) {
			return this.fail(errors.auth_id, '/app/list');
		}
		
		this.controller
			.model('session')
			.logout()
			.process(this.item);
		
		delete this.request.session.me;
		
		this.success(this.SUCCESS, '/developer/login');
	}
};
