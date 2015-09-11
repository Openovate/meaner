/* Required
-------------------------------*/
var time = require('eden-time')();

/* Definition
-------------------------------*/
module.exports = {
	/* Constants
	-------------------------------*/
	INVALID_PARAMETERS	: 'Invalid Parameters',
	INVALID_ID			: 'Invalid ID',
	INVALID_EMPTY		: 'Cannot be empty!',
	INVALID_SET			: 'Cannot be empty, if set',
	INVALID_FLOAT		: 'Should be a valid floating point',
	INVALID_INTEGER		: 'Should be a valid integer',
	INVALID_NUMBER		: 'Should be a valid number',
	INVALID_BOOL		: 'Should either be 0 or 1',
	INVALID_SMALL		: 'Should be between 0 and 9',
	
	/* Properties
	-------------------------------*/
	controller	: require('../../controller'),
	database	: require('../../controller').database,
	
	/* Methods
	-------------------------------*/
	/**
	 * Returns errors if any
	 *
	 * @param object submitted item object
	 * @return object error object
	 */
	errors: function(item, errors) {
		errors = errors || {};
		
		//prepare
		item = this.controller.validate().prepare(item);
		
		//REQUIRED
		
		// address_id			Required
		if(!this.controller.validate().isInteger(item.address_id)) {
			errors.address_id = this.INVALID_ID;
		}
		
		// address_street			Required
		if(this.controller.validate().isSet(item.address_street) 
		&& this.controller.validate().isEmpty(item.address_street)) {
			errors.address_street = this.INVALID_SET;
		}
		
		// address_city			Required
		if(this.controller.validate().isSet(item.address_city) 
		&& this.controller.validate().isEmpty(item.address_city)) {
			errors.address_city = this.INVALID_SET;
		}
		
		// address_country		Required
		if(this.controller.validate().isSet(item.address_country) 
		&& this.controller.validate().isEmpty(item.address_country)) {
			errors.address_country = this.INVALID_SET;
		}
		
		// address_postal			Required
		if(this.controller.validate().isSet(item.address_postal) 
		&& this.controller.validate().isEmpty(item.address_postal)) {
			errors.address_postal = this.INVALID_SET;
		}
		
		//OPTIONAL
		
		// address_flag
		if(this.controller.validate().isSet(item.address_flag) 
		&& !this.controller.validate().isSmall(item.address_flag)) {
			errors.address_flag = this.INVALID_SMALL;
		}
		
		// address_public
		if(this.controller.validate().isSet(item.address_public) 
		&& !this.controller.validate().isBool(item.address_public)) {
			errors.address_public = this.INVALID_BOOL;
		}
		
		// address_latitude
		if(this.controller.validate().isSet(item.address_latitude) 
		&& !this.controller.validate().isNumber(item.address_latitude)) {
			errors.address_latitude = this.INVALID_NUMBER;
		}
		
		// address_longitude
		if(this.controller.validate().isSet(item.address_longitude) 
		&& !this.controller.validate().isNumber(item.address_longitude)) {
			errors.address_longitude = this.INVALID_NUMBER;
		}
		
		return errors;
	},
	
	/**
	 * 1. Update the address
	 * 2. Update the address label
	 *
	 * @param object item object
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
		
		//prepare
		item = this.controller.validate().prepare(item);
		
		//generate dates
		var updated = time.toDate(new Date(), 'Y-m-d H:i:s');
		
		//SET WHAT WE KNOW
		var model = this.database.model()
			// address_id
			.setAddressId(item.address_id)
			// address_updated
			.setAddressUpdated(updated);
		
		//REQUIRED
		
		// address_street			Required
		if(!this.controller.validate().isEmpty(item.address_street)) {
			model.setAddressStreet(item.address_street);
		}	
		
		// address_city			Required
		if(!this.controller.validate().isEmpty(item.address_city)) {
			model.setAddressCity(item.address_city);
		}	
		
		// address_country		Required
		if(!this.controller.validate().isEmpty(item.address_country)) {
			model.setAddressCountry(item.address_country);
		}
			
		// address_postal			Required
		if(!this.controller.validate().isEmpty(item.address_postal)) {
			model.setAddressPostal(item.address_postal);
		}
		
		//OPTIONAL
		
		// address_flag
		if(this.controller.validate().isSmall(item.address_flag)) {
			model.setAddressFlag(item.address_flag);
		}
		
		// address_type
		if(this.controller.validate().isSet(item.address_type)) {
			model.setAddressType(item.address_type);
		}
		
		// address_public
		if(this.controller.validate().isInteger(item.address_public)) {
			model.setAddressPublic(item.address_public);
		}
		
		// address_neighborhood		
		if(this.controller.validate().isSet(item.address_neighborhood)) {
			model.setAddressNeighborhood(item.address_neighborhood);
		}
		
		// address_state			
		if(this.controller.validate().isSet(item.address_state)) {
			model.setAddressState(item.address_state);
		}
		
		// address_region		
		if(this.controller.validate().isSet(item.address_region)) {
			model.setAddressRegion(item.address_region);
		}
		
		// address_latitude
		if(this.controller.validate().isNumber(item.address_latitude)) {
			model.setAddressLatitude(item.address_latitude);
		}
		
		// address_longitude
		if(this.controller.validate().isNumber(item.address_longitude)) {
			model.setAddressLongitude(item.address_longitude);
		}
		
		// address_landmarks
		if(this.controller.validate().isSet(item.address_landmarks)) {
			model.setAddressLandmarks(item.address_landmarks);
		}
		
		//what's left ?
		model.save('address', function(error, model) {
			if(error) {
				return callback(error.toString());
			}
			
			this.updateLabel(item, model, callback);
		}.bind(this));
	},
	
	updateLabel: function(item, model, callback) {
		var search = this.database
			.search('address')
			.filterByAddressId(item.address_id);
		
		search.getModel(function(error, address) {
			if(error) {
				return callback(error.toString());
			}
			
			address.setAddressLabel([
				address.address_street,
				address.address_city,
				address.address_country,
				address.address_postal
			].join(' ')).save(function(error, address) {
				if(error) {
					callback(error.toString());
					return;
				}
				
				callback(error, model);
			
				this.database.trigger('address-update', model);
			}.bind(this));
		}.bind(this));
	}
};