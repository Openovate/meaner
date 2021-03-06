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
	/**
	 * Error flow
	 *
	 * @param object data object
	 * @param string error message
	 * @param object error object
	 * @return this
	 */
	fail: function(message, errors, item) {
		errors 	= errors 	|| {};
		item 	= item 		|| {};
		
		this.data.type 		= 'danger';
		this.data.message 	= language.get(message.toString());
		
		if(typeof item === 'string') {
			this.response.redirect(item);
			return;
		}
		
		if(typeof errors === 'string') {
			this.response.redirect(errors);
			return;
		}
		
		for(var key in errors) {
			errors[key] = language.get(errors[key]);
		}
		
		this.data.item 		= item;
		this.data.errors 	= errors;
		
		this.output();
		
		this.controller.trigger('developer-fail', this);
		
		return this;
	},
	
	/**
	 * Combines data with template and outputs
	 *
	 * @param object
	 * @return this
	 */
	output: function() {
		delete this.request.session.message;
		delete this.request.session.type;	
		
		this.data.title = language.get(this.title);
		this.response.render(this.template, this.data);
		
		this.controller.trigger('developer-output', this);
		
		return this;
	},
	
	/**
	 * Success flow
	 *
	 * @param object data object
	 * @param string error message
	 * @param object error object
	 * @return this
	 */
	success: function(message, redirect) {
		this.data.type 		= 'success';
		this.data.message 	= language.get(message.toString());
		
		if(typeof redirect === 'string') {
			this.session.type 		= this.data.type;
			this.session.message 	= this.data.message;
			this.response.redirect(redirect);
			return;
		}
		
		this.output();
		
		this.controller.trigger('developer-success', this);
		
		return this;
	},
};