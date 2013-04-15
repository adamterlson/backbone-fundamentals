/*
Models should be communicated with via events and consuming the API given by Backbone.
Consider it a rare scenario where you want to extend the prototype of a model with
more functions that you will then use instead of Backbone's though it does happen.
*/

var MyModel = Backbone.Model.extend({
	// Properties

	/*
	=== BACKBONE ===
	A model listening to its own events is a fantastic way to simplify how much views need
	to orchestrate and can really make your models autonomous.

	The majority of a Model file will likely be overriding existing Backbone methods such
	as save, sync, url, baseUrl, idAttribute, etc as well as binding to its events or those
	of child models.
	================
	*/

	// Backbone

	idAttribute: 'Id',

	baseUrl: 'some/path',

	initialize: function () {
		this.listenTo(this, 'sync', this.onSync);
	},

	// Backbone Events

	onSync: function () {

	}
});