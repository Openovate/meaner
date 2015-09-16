/* Required
-------------------------------*/
/* Definition
-------------------------------*/
module.exports = {
	/* Constants
	-------------------------------*/
	/* Properties
	-------------------------------*/
	title: 'Apps',
	
	/* Contruct
	-------------------------------*/
	constructor: function() {
		this.sync()

		//get rows
		.then(function(next) {
			this.model('app')
				.list()
				.process()
				.innerJoinOn(
					'app_profile', 
					'app_profile_app = app_id')
				.filterByAppProfileProfile(this.me.profile_id)
				.getRows(next);
		})
		
		//end
		.then(function(error, rows, next) {
			if(error) {
				return this.fail(error.toString());
			}
			
			this.data.rows = rows || [];
			this.output();
		});
	}
	
	/* Methods
	-------------------------------*/
};
