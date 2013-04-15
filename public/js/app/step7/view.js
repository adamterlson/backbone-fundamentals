/*
Changes:
	Split out template to only have a placeholder for the list (now a DIV).  task.html now contains the template for a specific task.
	Imported additional dependency for taskView.
	Created renderTask for creating and rendering subview.
	Created renderTasks for looping through all tasks in a collection
	Updated render filtering to create a collection so as to pass models to the subview
	Only passing necessary data to parent render
	Updated render to loop through collection and call renderTask for each model constructing a UL
	Moved all events and methods that are specific to a task into taskView
	Updated methods in taskView to point at own model rather than finding by ID.
*/

define(['text!./templates/main.html', './collections/taskCollection', './taskView'], function (template, taskCollection, taskView) {

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
			'click .filters button': 'onFiltersButtonClick',
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
			var filteredCollection = this.collection;

			if (this.completionFilter != null) {
				filteredCollection = new taskCollection(this.collection.filter(function (task) {
					return !!task.get('complete') === this.completionFilter;
				}, this));
			}

			this.$el.html(this.template({ hasTasks: !!filteredCollection.length }));

			this.$('.task-list').html(this.renderTasks(filteredCollection));

			// Note `this.$()` -- searches the view's context -- ALWAYS USE IT
			// Also, because this is a render function, it's okay to use jQuery here.
			this.$('.create-task').focus();
		},

		renderTasks: function (collection) {
			// This is a render function, so using jQuery to construct DOM elements is okay!
			var tasks = $('<ul class="unstyled">');
			collection.each(function (model) {
				tasks.append(this.renderTask(model));
			}, this);

			return tasks;
		},

		renderTask: function (model) {
			var task = new taskView({ model: model });
			task.bootstrap();
			return task.$el;
		},

		// UI Events

		onCreateTaskKeydown: function (e) {
			if (e.which === 13) {
				this.createTask($(e.target).val());
			}
		},

		onFiltersButtonClick: function (e) {
			var $target = $(e.target),
				value = $target.data('completedFilter');

			this.applyFilter(value);
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