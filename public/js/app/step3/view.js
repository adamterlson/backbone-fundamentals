/*
Changes:
	Added event for keydown on create task
	Created method on view for creating a task abstracted from UI event which leverages create -- Note comment on why it's here, not in the model
	Bind to all events on collection
	On almost all events, render.  Leaving off things like parse are a good idea.
*/

define(['text!./templates/main.html', './collections/taskCollection'], function (template, taskCollection) {

	var view = Backbone.View.extend({
		// Properties

		template: _.template(template),

		// Backbone

		initialize: function () {
			_.bindAll(this);

			this.collection = new taskCollection();

			// _Almost_ all
			this.listenTo(this.collection, 'reset add remove change', this.onCollectionAll);
		},

		events: {
			'keydown .create-task': 'onCreateTaskKeydown'
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
			this.$el.html(this.template({ tasks: this.collection.toJSON() }));

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
			return this.collection.create({ description: description }, { wait: true });
		}
	});

	return view;

});