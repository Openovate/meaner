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
		
		item = this.validate().prepare(item || {});
	
		var filter 	= item.filter 	|| {},
			range 	= item.range 	|| 50,
			start 	= item.start 	|| 0,
			order 	= item.order 	|| {},
			count	= item.count 	|| 0,
			keyword	= item.keyword 	|| null;
			
		var search = this.database
			.search('file')
			.setStart(parseInt(start) || 0)
			.setRange(parseInt(range) || 0);
		
		if(typeof filter.file_active === 'undefined') {
			filter.file_active = 1;
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
				'file_link LIKE ?',
				'file_path LIKE ?'
			].join(' OR ') + ')', 
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
		this.database.trigger('file-list', search);
		
		return search;
	}
};