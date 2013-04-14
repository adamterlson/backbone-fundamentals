define(['text!./templates/main.html'], function (template) {

	var view = Backbone.View.extend({
		// Properties

		template: _.template(template),

		// Backbone

		initialize: function () {
			_.bindAll(this);
		},

		// Bootstrap

		bootstrap: function () {
			this.render();
		},

		// Rendering

		render: function () {
			this.$el.html(this.template());
		},

		// UI Events

		// Backbone Events

		// Methods
	});

	return view;

});