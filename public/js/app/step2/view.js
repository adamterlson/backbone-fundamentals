define(['text!./templates/main.html', './collections/taskCollection'], function (template, taskCollection) {

	var view = Backbone.View.extend({
		// Properties

		template: _.template(template),

		// Backbone

		initialize: function () {
			_.bindAll(this);

			this.collection = new taskCollection();
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
		}

		// UI Events

		// Backbone Events

		// Methods
	});

	return view;

});