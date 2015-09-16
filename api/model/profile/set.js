/* Required
-------------------------------*/
var time = require('eden-time')();

/* Definition
-------------------------------*/
module.exports = {
	/* Constants
	-------------------------------*/
	INVALID_PARAMETERS	: 'Invalid Parameters',
	INVALID_REFERENCE	: 'You need to provide either an email or id.',
	
	/* Properties
	-------------------------------*/
	/* Methods
	-------------------------------*/
	/**
	 * Returns errors if any
	 *
	 * @param object submitted profile object
	 * @return object error object
	 */
	errors: function(item, errors) {
		errors = errors || {};
		
		//prepare
		item = this.validate().prepare(item);
		
		//the uniqueness of a profile is from their id or email
		//if they change their email, they must provide a profile id
		//because there is no way to reference what to update
		//Simply put,
		//if profile id, we simply update it
		//if no profile id and email, search for the email
		//	and if found, update it
		//	otherwise, insert it
		if(!this.validate().isNumber(item.profile_id)
		&& !this.validate().isEmail(item.profile_email)) {
			errors.profile_id 		= this.INVALID_REFERENCE;
			errors.profile_email 	= this.INVALID_REFERENCE;
		}
		
		//if we do have a number, just update it
		if(this.validate().isNumber(item.profile_id)) {
			return this.model('profile').update().errors(item, errors);
		}
		
		//at this point we should have an email at least
		//we don't know if we should test for create or update
		//best to just return what we got
		return errors;
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
			return callback(this.INVALID_PARAMETERS);
		}
		
		//the uniqueness of a profile is from their id or email
		//if they change their email, they must provide a profile id
		//because there is no way to reference what to update
		//Simply put,
		//if profile id, we simply update it
		//if no profile id and email, search for the email
		//	and if found, update it
		//	otherwise, insert it
		
		//if we do have a number, just update it
		if(this.validate().isNumber(item.profile_id)) {
			return this.model('profile')
				.update()
				.process(item, callback);
		}
		
		//at this point we should have an email at least
		//search for it
		var search = this.database
			.search('profile')
			.filterByProfileEmail(item.profile_email);
			
		search.getRow(function(error, row) {
			if(error) {
				return callback(error.toString());
			}
			
			//if we found it
			if(row) {
				//update it
				item.profile_id = row.profile_id;
				
				return this.model('profile')
					.update()
					.process(item, callback);
			}
			
			//insert it
			this.model('profile')
				.create()
				.process(item, callback);
		}.bind(this));
	}
};