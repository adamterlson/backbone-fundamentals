define(function () {
	var Router = Backbone.Router.extend({
		routes: {
			':step': 'loadStep'
		},

		loadStep: function (step) {
			require(['app/' + step + '/view'], function (stepView) {
				var view = new stepView();
				view.bootstrap();
				$('#main').html(view.$el);
			});
		}
	});

	return Router;
});