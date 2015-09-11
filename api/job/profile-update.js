module.exports = function(job, done) {
	//need to have
	// item 	- profile item
	var data		= job.data;
	var item 		= data.item;
	var controller	= job.controller || this;
	
	//update product
	controller.sync(function(next) {
		controller.model('profile').update().process(item, next); 
	})
	
	//file choice
	.then(function(error) {
		if(error) {
			return done(error);
		}
		
		var next = Array.prototype.slice.apply(arguments).pop();
		
		//if no images, return
		if(!item.images || !item.images.length) {
			return done();
		}
			
		controller.model('profile').unlinkAllFiles(
			item.profile_id, 
			['main_profile', 'profile_image'], 
		function() {
			next.thread('file-loop', 0);
		});
	})
	
	//add the image one at a time
	.thread('file-loop', function(i) {
		var next = Array.prototype.slice.apply(arguments).pop();
		
		if(i < item.images.length) {
			var file = item.images[i];
			
			file.file_type = 'profile_image';
			
			if(i === 0) {
				file.file_type = 'main_profile';
			}
			
			//1. Validate
			file.imageOnly = true;
			
			var errors = controller.model('file').create().errors(file);
			
			if(Object.keys(errors).length) {
				return next.thread('file-loop', i + 1);
			}
			
			// 2. Process
			controller.model('file').create().process(file, function(error, file) {
				if(error) {
					return next.thread('file-loop', i + 1);
				}
				
				controller.model('profile').linkFile({
					file_id		: file.file_id,
					product_id	: item.profile_id
				}, function(error) {
					next.thread('file-loop', i + 1);
				});	
			});
			
			return;
		}
		
		done(null, item);
	});
};