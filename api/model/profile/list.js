/* Required
-------------------------------*/
/* Definition
-------------------------------*/
module.exports = {
	/* Constants
	-------------------------------*/
	INVALID_PARAMETERS	: 'Invalid Parameters',
	
	/* Properties
	-------------------------------*/
	/* Methods
	-------------------------------*/
	/**
	 * Returns errors if any
	 *
	 * @param object submitted item object
	 * @return object error object
	 */
	errors: function(item, errors) {
		return errors || {};
	},
	
	/**
	 * Processes the form
	 *
	 * @param object profile object
	 * @param function callback whenever it's done
	 * @return void
	 */
	process: function(item, callback) {
		item 		= item 		|| {};
		callback 	= callback 	|| function() {};
		
		//prevent uncatchable error
		if(Object.keys(this.errors(item)).length) {
			callback(this.INVALID_PARAMETERS);
			return null;
		}
		
		//prepare
		item = this.validate().prepare(item || {});
	
		var filter 	= item.filter 	|| {},
			range 	= item.range 	|| 50,
			start 	= item.start 	|| 0,
			order 	= item.order 	|| {},
			count	= item.count 	|| 0,
			keyword	= item.keyword 	|| null;
			
		var search = this.database
			.search('profile')
			.setStart(parseInt(start) || 0)
			.setRange(parseInt(range) || 0);
			
		if(item.public) {
			search.setColumns(
				'profile_id', 
				'profile_name',
				'profile_type',
				'profile_created')
		}
		
		if(typeof filter.profile_active === 'undefined') {
			filter.profile_active = 1;
		}
		
		//add filters
		for(var column in filter) {
			if(filter.hasOwnProperty(column)) {
				if(/^[a-zA-Z0-9-_]+$/.test(column)) {
					search.addFilter(column + ' = ?', filter[column]);
				}
			}
		}
		
		//keyword?
		if(keyword) {
			search.addFilter('(' + [
				'profile_name LIKE ?',
				'profile_email LIKE ?',
				'profile_company LIKE ?',
				'profile_phone LIKE ?'
			].join(' OR ') + ')', 
				'%'+keyword+'%', 
				'%'+keyword+'%', 
				'%'+keyword+'%', 
				'%'+keyword+'%');
		}
		
		//add sorting
		for(column in order) {
			if(order.hasOwnProperty(column)) {
				search.addSort(column, order[column]);
			}
		}
		
		callback(null, search);
		this.database.trigger('profile-list', search);
		
		return search;
	}
};
