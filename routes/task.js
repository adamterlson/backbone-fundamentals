var __ = require('underscore');

var database = {};
database.tasks = [];
 
exports.findById = function(req, res) {
	var id = req.params.id;
	console.log('Retrieving task: ' + id);
	
	res.send(__.findWhere(database.tasks, { _id: id }));
};
 
exports.findAll = function(req, res) {
	console.log('Returning all tasks');

	res.send(database.tasks);
};
 
exports.addTask = function(req, res) {
	var task = req.body;

	console.log('Adding task:');
	console.log(JSON.stringify(task));

	database.tasks.push(task);
};
 
exports.updateTask = function(req, res) {
	var id = req.params.id;
	var task = req.body;

	console.log('Updating task: ' + id);
	console.log(JSON.stringify(task));

	var taskToUpdate = __.findWhere(database.tasks, { _id: id });
	if (taskToUpdate) {
		res.send(__.extend(taskToUpdate, task));
	}
};
 
exports.deleteTask = function(req, res) {
	var id = req.params.id;
	console.log('Deleting task: ' + id);
	
	database.tasks = __.reject(database.tasks, function (task) { return task._id === id });
};