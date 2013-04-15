var Workspace = Backbone.Router.extend({

	// Backbone

	routes: {
		'help': 'help',						// #help
		'search/:query': 'search',			// #search/kiwis
		'search/:query/p:page': 'search',	// #search/kiwis/p7
		'example/*splat': 'splat',			// #example/anything/else/of/length 
		'foo/(:option)': 'optional'			// #foo -or- #foo/something
	},

	// Routes

	help: function() {
	
	},

	search: function(query, page) {
	
	},

	splat: function (splat) {

	},

	optional: function (option) {

	}
});