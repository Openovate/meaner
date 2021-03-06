module.exports = function(job, done) {
	//need to have
	// item 	- app item
	var data		= job.data;
	var item 		= data.item;
	
	this.sync()
	
	// remove
	.then(function(next) {
		this.model('app')
			.remove()
			.process(item, next);
	})
	
	//end
	.then(function(error, model, next) {
		if(error) {
			return done(error.toString());
		}
		
		done(null, item);
	});
};