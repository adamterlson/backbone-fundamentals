define(function () {
	var taskModel = Backbone.Model.extend({
		// Properties

		// Backbone

		// This is the attribute that Backbone uses as the unique identifier
		// This is also the default id attribute, but I wanted to call it out
		// that you can change it.
		idAttribute: 'id', 

		// The difference between urlRoot and url is that AJAX operations 
		// will append the ID to the end of the urlRoot for GET, PUT and DELETE.
		urlRoot: '/api/task' 
	});

	return taskModel;
});