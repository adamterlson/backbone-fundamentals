define(['../models/taskModel'], function (taskModel) {
	var taskCollection = Backbone.Collection.extend({
		// Properties

		// Backbone

		// Be sure to set the model _type_ and not an instance of it
		model: taskModel, 

		// Set the URL here so you can fetch on the collection and hit a list endpoint.  
		// Note it's not baseUrl because collections don't have IDs.
		url: '/api/task' 
	});

	return taskCollection;
});