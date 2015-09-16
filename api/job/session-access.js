module.exports = function(job, done) {
	//need to have
	// item 	- session item
	var data		= job.data;
	var item 		= data.item;
	var results		= {};
	
	this.sync()
	
	//process the profile
	.then(function(next) {
		this.model('session')
			.access()
			.process(item, next);
	})
	
	//end
	.then(function(error, row, next) {
		if(error) {
			return done(error.toString());
		}
		
		results.session = row;
		
		done(null, results);
	});
};