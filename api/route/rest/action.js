/* Required
-------------------------------*/
var language = require('eden-language')();

/* Definition
-------------------------------*/
module.exports = {
	/* Constants
	-------------------------------*/
	/* Properties
	-------------------------------*/
	/* Methods
	-------------------------------*/
	success: function(results) {
		this.data.error = false;
		this.data.results = results;
		this.output();
		
		this.controller.trigger('rest-success', this);
		
		return this;
	},
	
	/**
	 * Error flow
	 *
	 * @param object data object
	 * @param string error message
	 * @param object error object
	 * @return this
	 */
	fail: function(message, errors) {
		errors = errors || {};
		
		for(var key in errors) {
			errors[key] = language.get(errors[key]);
		}
		
		this.data.error = true;
		this.data.message = language.get(message.toString());
		
		if(Object.keys(errors).length) {
			this.data.validation = errors;
		}
		
		this.output();
		
		this.controller.trigger('rest-fail', this);
		
		return this;
	},
	
	/**
	 * Combines data with template and outputs
	 *
	 * @param object
	 * @return this
	 */
	output: function() {
		this.response.json(this.data);
		this.controller.trigger('rest-output', this);
		return this;
	}
};