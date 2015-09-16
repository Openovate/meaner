/* Required
-------------------------------*/
/* Definition
-------------------------------*/
module.exports = {
	/* Constants
	-------------------------------*/
	FAIL_NOT_EXISTS		: 'App does not exist',
	FAIL_PERMISSIONS	: 'You do not have permissions to update.',
	SUCCESS				: 'App successfully refreshed!',
	
	/* Properties
	-------------------------------*/
	title: 'Updating App',
	
	/* Constructor
	-------------------------------*/
	constructor: function() {
		this.sync()

		//get the item
		.then(function(next) {
			this.item.app_id = parseInt(this.params.id);
			
			//add profile_id
			this.item.profile_id = this.me.profile_id;
			
			next();
		})
		
		//get app
		.then(function(next) {
			this.model('app')
				.detail()
				.process(this.item)
				.innerJoinOn(
					'app_profile', 
					'app_profile_app = app_id')
				.getRow(next);
		})
		
		//refresh the tokens
		.then(function(error, row, meta, next) {
			if(error) {
				return this.fail(error.toString(), '/app/list');
			}
			
			//if no row, fail
			if(!row) {
				return this.fail(this.FAIL_NOT_EXISTS, '/app/list');
			}
			
			//if not matched, fail
			if(row.app_profile_profile !== this.me.profile_id) {
				return this.fail(this.FAIL_PERMISSIONS, '/app/list');
			}
			
			this.job('app-refresh')({
				data: { item: this.item }
			}, next);
		})
		
		//end
		.then(function(error, item, next) {
			if(error) {
				return this.fail(error);	
			}
			
			//success
			this.success(this.SUCCESS, '/app/list');
		});
	}
};