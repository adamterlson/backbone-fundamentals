var Backbone = require('backbone'),
	extend = require('extend'),
	__ = require('underscore'),
	path = require('path');

// Controller
function Controller (database, overrides) {
	var self = this;

	// Controller Wrapper can be made smarter so that req isn't sent, but instead params when appropriate
	// or the req.body on POST or both on PUT
	function controllerWrapper (fn) {
		return function (req, res) {
			try {
				// You can either just return a value or operate direct on res
				// but don't do both
				res.send(fn(req, res));
			}
			catch (ex) {
				res.send(ex.code, ex.body);
			}
		};
	}

	database || (database = new Backbone.Collection());
	
	extend(self, {
		list: function (req, res) {
			return database.toJSON();
		},
		
		get: function (req, res) {
			return database.get(req.params.id).toJSON();
		},
		
		create: function (req, res) {
			var model = new Backbone.Model(req.body);
			model.set(model.idAttribute, __.uniqueId());
			database.add(model);
			return model.toJSON();
		},
		
		update: function (req, res) {
			return database.get(req.params.id).set(req.body).toJSON();
		},
		
		remove: function (req, res) {
			database.remove(database.get(req.params.id));
			return {};
		},

		restify: function (app, endpoint) {            
			app.get(endpoint, controllerWrapper(self.list));
			app.get(path.join(endpoint, '/:id'), controllerWrapper(self.get));
			app.post(endpoint, controllerWrapper(self.create));
			app.put(path.join(endpoint, '/:id'), controllerWrapper(self.update));
			app.delete(path.join(endpoint, '/:id'), controllerWrapper(self.remove));

			return self;
		}
	}, overrides);

	return self;
}

module.exports = Controller;