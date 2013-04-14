define(function () {
	var Router = Backbone.Router.extend({
		routes: {
			'': 'loadStep',
			':step': 'loadStep'
		},

		loadStep: function (step) {
			step = step || "step1"
			require(['app/' + step + '/view'], function (stepView) {
				var view = new stepView();
				view.bootstrap();
				$('#main').html(view.$el);
			});
		}
	});

	return Router;
});