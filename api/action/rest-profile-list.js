/* Required
-------------------------------*/
/* Definition
-------------------------------*/
module.exports = {
	/* Constants
	-------------------------------*/
	FAIL: 'Failed to get products',
	
	/* Properties
	-------------------------------*/
	/* Construct
	-------------------------------*/
	constructor: function() {
		//get data
		this.then(function(next) {
			this.item.public = true;
			
			next();
		})
		
		//validate
		.then(function(next) {
			var errors = this.controller
				.model('profile')
				.list()
				.errors(this.item);
		
			if(Object.keys(errors).length) {
				return this.fail(this.FAIL, errors);
			}
			
			next();
		})
		
		//get total
		.then(function(next) {
			this._search = this.controller
				.model('profile')
				.list()
				.process(this.item)
				.getTotal(next);
		})
		
		//get rows
		.then(function(error, total, next) {
			if(error) {
				return this.fail(error.toString());
			}
			
			this._total = total;
			
			this._search.getRows(next)
		})
		
		//end
		.then(function(error, rows, meta, next) {
			if(error) {
				return this.fail(error.toString());
			}
			
			this._rows = rows;
			
			this.success({ 
				total	: this._total, 
				rows	: this._rows });
		});
	}
};