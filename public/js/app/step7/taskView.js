define(['text!./templates/task.html'], function (template) {

	var taskView = Backbone.View.extend({
		// Properties

		completionFilter: null,
		template: _.template(template),

		// Backbone

		initialize: function () {
			_.bindAll(this);
		},

		events: {
			'change .complete-task': 'onCompleteTaskChange',
			'click .delete-task': 'onDeleteTaskClick'
		},

		// Bootstrap

		bootstrap: function () {
			this.render();
		},

		// Rendering

		render: function () {
			// This could be solved differently!  It's to show how you can shim your model easily with default values!
			var data = _.extend({ complete: false }, this.model.toJSON());

			this.$el.html(this.template(data));
		},

		// UI Events

		onCompleteTaskChange: function () {
			this.completeTask();
		},

		onDeleteTaskClick: function () {
			this.deleteTask();
		},

		// Methods

		completeTask: function () { // No longer needs to find by ID
			return this.model.save({ complete: true }); 
		},

		deleteTask: function () { // No longer needs to find by ID
			if (confirm("Are you sure you want to delete this task?")) {
				this.model.destroy();
			}
		}
	});

	return taskView;

});