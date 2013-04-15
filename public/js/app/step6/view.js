/*
Changes:
	Updated template to include link for deleting
	Bound to the event and called delete method
	Updated template to include link for deleting everything
	Bound to the event and called delete all method
	Optimized deletion to only render once instead of after every delete
*/

define(['text!./templates/main.html', './collections/taskCollection'], function (template, taskCollection) {

	var view = Backbone.View.extend({
		// Properties

		completionFilter: null,
		template: _.template(template),

		// Backbone

		initialize: function () {
			_.bindAll(this);

			this.collection = new taskCollection();

			// _Almost_ all
			this.listenTo(this.collection, 'reset add remove change', this.onCollectionAll);
		},

		events: {
			'keydown .create-task': 'onCreateTaskKeydown',
			'change .complete-task': 'onCompleteTaskChange',
			'click .filters button': 'onFiltersButtonClick',
			'click .delete-task': 'onDeleteTaskClick',
			'click .delete-all-tasks': 'onDeleteAllTasksClick'
		},

		// Bootstrap

		bootstrap: function () {
			// All Backbone AJAX opertaions return the jqXHR object which implements the promise API
			// This is silent because we're binding to add events to re-render later.  Forgetting it
			// will cause the view to render once for every model in the collection.
			this.collection.fetch({ silent: true }).then(this.render);
		},

		// Rendering

		render: function () {
			var collection = this.collection.toJSON();

			if (this.completionFilter != null) {
				collection = _.filter(collection, function (task) {
					return !!task.complete === this.completionFilter;
				}, this);
			}

			this.$el.html(this.template({ tasks: collection }));

			// Note `this.$()` -- searches the view's context -- ALWAYS USE IT
			// Also, because this is a render function, it's okay to use jQuery here.
			this.$('.create-task').focus();
		},

		// UI Events

		onCreateTaskKeydown: function (e) {
			if (e.which === 13) {
				this.createTask($(e.target).val());
			}
		},

		onCompleteTaskChange: function (e) {
			var id = $(e.target).closest('li').data('taskId');

			this.completeTask(id);
		},

		onFiltersButtonClick: function (e) {
			var $target = $(e.target),
				value = $target.data('completedFilter');

			this.applyFilter(value);
		},

		onDeleteTaskClick: function (e) {
			var id = $(e.target).closest('li').data('taskId');

			this.deleteTask(id);
		},

		onDeleteAllTasksClick: function (e) {
			this.deleteAllTasks();
		},

		// Backbone Events

		onCollectionAll: function () {
			// We could be more targeted, but for simplicity (which is the majority case)
			// you can just re-render the entire thing.

			this.render();
		},

		// Methods

		// Why is this method not in the model?  Because this is the place for the view to decide
		// what it means presentation-wise to create a task.  Maybe it needs to render a modal, 
		// for example.  THIS IS NOT a utility method for abstracting model logic.  Put that in the model.
		createTask: function (description) {
			// Why split this out when it's only one line?  
			// - Unit testing doesn't need to mock 'e' in order to test the view's creation of tasks
			// - When the next person adds to what it means to "create" it's already abstracted

			// This line includes {wait:true} because I don't want to do anything until I know it saved
			// successfully.  If this is excluded, when render happens there won't be an ID.
			return this.collection.create({ description: description }, { wait: true, silent: false });
		},

		completeTask: function (id) {
			// This line equates to: this.collection.get(id).set({ complete: true }).save();
			return this.collection.get(id).save({ complete: true });
		},

		deleteTask: function (id) {
			// This is an example as to why this method is here and not in the model.
			if (confirm("Are you sure you want to delete this task?")) {
				this.collection.get(id).destroy();
			}
		},

		deleteAllTasks: function () {
			if (confirm("Are you sure you want to delete every task?")) {
				var individualDeletes = [];

				while(this.collection.length) {
					individualDeletes.push(this.collection.last().destroy({ silent: true }));
				}

				return $.when.apply($, individualDeletes).then(this.render);
			}
		},

		applyFilter: function (value) {
			if (value === '') {
				value = null;
			}

			this.completionFilter = value;
			this.render();
		}
	});

	return view;

});