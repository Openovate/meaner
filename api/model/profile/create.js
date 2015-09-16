/* Required
-------------------------------*/
var time = require('eden-time')();

/* Definition
-------------------------------*/
module.exports = {
	/* Constants
	-------------------------------*/
	INVALID_PARAMETERS	: 'Invalid Parameters',
	INVALID_EMPTY		: 'Cannot be empty!',
	INVALID_SET			: 'Cannot be empty, if set',
	INVALID_FLOAT		: 'Should be a valid floating point',
	INVALID_INTEGER		: 'Should be a valid integer',
	INVALID_NUMBER		: 'Should be a valid number',
	INVALID_BOOL		: 'Should either be 0 or 1',
	INVALID_SMALL		: 'Should be between 0 and 9',
	INVALID_EMAIL		: 'Invalid Email Format!',
	INVALID_DATE		: 'Invalid Date Format!',
	
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
		
		//REQUIRED
		
		//profile_name		Required
		if(!this.validate().isSet(item.profile_name)
		|| this.validate().isEmpty(item.profile_name)) {
			errors.profile_name = this.INVALID_EMPTY;
		}
		
		//OPTIONAL
		
		//profile_email	
		if(this.validate().isSet(item.profile_email)
		&& !this.validate().isEmail(item.profile_email)) {
			errors.profile_email = this.INVALID_EMAIL;
		}
		
		//profile_birth
		if(this.validate().isSet(item.profile_birth)
		&& !this.validate().isDate(item.profile_birth)) {
			errors.profile_birth = this.INVALID_DATE;
		}
		
		// profile_flag
		if(this.validate().isSet(item.profile_flag) 
		&& !this.validate().isSmall(item.profile_flag)) {
			errors.profile_flag = this.INVALID_SMALL;
		}
		
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
		
		//prepare
		item = this.validate().prepare(item);
		
		//generate dates
		var created = time.toDate(new Date(), 'Y-m-d H:i:s');
		var updated = time.toDate(new Date(), 'Y-m-d H:i:s');
		
		//SET WHAT WE KNOW
		var model = this.database.model()
			
			// profile_name			Required
			.setProfileName(item.profile_name)

			// profile_created
			.setProfileCreated(created)
			
			// profile_updated
			.setProfileUpdated(updated);
		
		// profile_email
		if(this.validate().isSet(item.profile_email)) {
			model.setProfileEmail(item.profile_email);
		}
		
		// profile_phone
		if(this.validate().isSet(item.profile_phone)) {
			model.setProfilePhone(item.profile_phone);
		}
		
		// profile_company		
		if(this.validate().isSet(item.profile_company)) {
			model.setProfileCompany(item.profile_company);
		}
		
		// profile_job			
		if(this.validate().isSet(item.profile_job)) {
			model.setProfileJob(item.profile_job);
		}
		
		// profile_gender		
		if(this.validate().isSet(item.profile_gender)) {
			model.setProfileGender(item.profile_gender);
		}
		
		// profile_birth		
		if(this.validate().isSet(item.profile_birth)) {
			model.setProfileBirth(item.profile_birth);
		}

		// profile_website		
		if(this.validate().isSet(item.profile_website)) {
			model.setProfileBirth(item.profile_website);
		}

		// profile_facebook		
		if(this.validate().isSet(item.profile_facebook)) {
			model.setProfileBirth(item.profile_facebook);
		}

		// profile_linkedin		
		if(this.validate().isSet(item.profile_linkedin)) {
			model.setProfileLinkedin(item.profile_linkedin);
		}

		// profile_twitter		
		if(this.validate().isSet(item.profile_twitter)) {
			model.setProfileTwitter(item.profile_twitter);
		}

		// profile_google		
		if(this.validate().isSet(item.profile_google)) {
			model.setProfileGoogle(item.profile_google);
		}
		
		// profile_reference
		if(this.validate().isSet(item.profile_reference)) {
			model.setProfileReference(item.profile_reference);
		}
		
		// profile_type
		if(this.validate().isSet(item.profile_type)) {
			model.setProfileType(item.profile_type);
		}
		
		// profile_flag
		if(this.validate().isSmall(item.profile_flag)) {
			model.setProfileFlag(item.profile_flag);
		}
		
		//what's left ?
		model.save('profile', function(error, model) {
			if(error) {
				return callback(error.toString());
			}
            
			callback(error, model);
			
            this.database.trigger('profile-create', model);
		}.bind(this));
	}
};