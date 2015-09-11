/*
 * Database preparation and validation
 */
module.exports = {
	/**
	 * Test if 0 or 1
	 *
	 * @param string|number
	 * @return this
	 */
	isBool: function(string) {
		if(typeof string === 'undefined') {
			return false;
		}
		
		string = ''+string;
		
		return string == '0' || string == '1';
	},
	
	/**
	 * Test if empty
	 *
	 * @param string|number
	 * @return this
	 */
	isEmpty: function(string) {
		if(typeof string === 'undefined'
		|| string === null) {
			return true;
		}
		
		string = string.toString();
		
		return !string.length;
	},
	
	/**
	 * Test if float
	 *
	 * @param string|number
	 * @return this
	 */
	isFloat: function(number) {
		if(typeof number === 'undefined') {
			return false;
		}
		
		number = number.toString();
		
		return /^[-+]?(\d*)?\.\d+$/.test(number);
	},
	
	/**
	 * Test if integer
	 *
	 * @param string|number
	 * @return this
	 */
	isInteger: function(number) {
		if(typeof number === 'undefined') {
			return false;
		}
		
		number = number.toString();
		
		return /^[-+]?\d+$/.test(number);
	},
	
	/**
	 * Test if number
	 *
	 * @param string|number
	 * @return this
	 */
	isNumber: function(number) {
		if(typeof number === 'undefined') {
			return false;
		}
		
		number = number.toString();
		
		return /^[-+]?(\d*[.])?\d+$/.test(number);
	},
	
	
	/**
	 * Test if is set
	 *
	 * @param string|number
	 * @return this
	 */
	isSet: function(string) {
		return typeof string !== 'undefined';
	},
	
	/**
	 * Test if 0-9
	 *
	 * @param string|number
	 * @return this
	 */
	isSmall: function(number) {
		if(typeof number === 'undefined') {
			return false;
		}
		
		number = parseFloat(number);
		
		return number >= 0 && number <=9;
	},
	
	/**
	 * make everything into a string
	 * remove empty strings
	 *
	 * @param object
	 * @return object
	 */
	prepare: function(item) {
		var prepared = {};
		
		if(item instanceof Array) {
			prepared = [];
			
			item.forEach(function(value) {
				if(value === null
				|| typeof value === 'undefined') {
					prepared.push(null);
					return;
				}
				
				if(typeof value === 'object') {
					prepared.push(this.prepare(value));
					return;
				}
				
				prepared.push(value.toString());
			});
			
			return prepared;
		}
		
		for(var key in item) {
			if(item[key] === null
			|| typeof item[key] === 'undefined') {
				prepared[key] = null;
				continue;
			}
			
			if(typeof item[key] === 'object') {
				prepared[key] = this.prepare(item[key]);
				continue;
			}
			
			prepared[key] = item[key].toString();
		}
		
		return prepared;
	}
};