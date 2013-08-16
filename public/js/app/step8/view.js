/*
Changes:
	No longer listening to all collection events
	Added targeted event functions for add
	Remove is now handled by the subview.
	Because we're not re-rendering, I don't need to re-focus on the create box.  I can just clear it.  Added to onCreateTaskKeydown.
	Change also needs to re-render the task for when the checkbox is checked.
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

			this.listenTo(this.collection, 'add', this.onCollectionAdd);
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

		// This function is for live appending.  Don't use on initial render because it'll make rendering slow.
		renderAppendNewTask: function (model) {
			var $li = this.renderTask(model),
				$taskList = this.$('.task-list > ul');

			if (!$taskList.length) {
				return this.render();
			}

			$li.hide();
			$taskList.append($li);
			$li.fadeIn('fast');
		},

		// UI Events

		onCreateTaskKeydown: function (e) {
			if (e.which === 13) {
				var $target = $(e.target);
				this.createTask($target.val());
				$target.val('');

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

		onCollectionAdd: function (model) {
			this.renderAppendNewTask(model);
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