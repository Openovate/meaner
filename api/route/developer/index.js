var express 	= require('express');
var filter		= require('./filter');
var controller	= require('../../controller');
var routes 		= controller.config('routes').developer;
var router 		= express.Router();

//Routing
Object.keys(routes).forEach(function(path) {
	var route 	= routes[path];
	var method 	= route.method.toLowerCase();
	
	route.path 	= path;
	
	router[method](
		path, 
		filter.validate.bind(filter, route), 
		filter.success.bind(filter, route));
	
	if(method.toLowerCase() === 'put') {
		router.post(
			path, 
			filter.validate.bind(filter, route), 
			filter.success.bind(filter, route));
		
		return;
	}
	
	if(method.toLowerCase() === 'delete') {
		router.get(
			path, 
			filter.validate.bind(filter, route), 
			filter.success.bind(filter, route));
	}
});

module.exports = router;