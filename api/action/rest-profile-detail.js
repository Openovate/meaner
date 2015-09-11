/* Required
-------------------------------*/
/* Definition
-------------------------------*/
module.exports = {
	/* Constants
	-------------------------------*/
	FAIL: 'Failed to get profile',
	
	/* Properties
	-------------------------------*/
	/* Construct
	-------------------------------*/
	constructor: function() {
		//get data
		this.then(function(next) {
			this.item = { profile_id: this.request.params.id || this.request.source.profile_id };
		
			if(parseInt(this.item.profile_id) !== parseInt(this.source.profile_id)) {
				this.item.public = true;
			}
			
			next();
		})
		
		//validate
		.then(function(next) {
			var errors = this.controller
				.model('profile')
				.detail()
				.errors(this.item);
			
			if(Object.keys(errors).length) {
				return this.fail(this.FAIL, errors);
			}
			
			next();
		})
		
		//process
		.then(function(next) {
			this.controller
				.model('profile')
				.detail()
				.process(this.item)
				.getRow(next);
		})
		
		//end
		.then(function(error, row, meta, next) {
			if(error) {
				return this.fail(error.toString());
			}
			
			if(!row || !row.profile_id) {
				return this.fail(this.FAIL);
			}
			
			//success
			this.success(row);	
		})
	}
};