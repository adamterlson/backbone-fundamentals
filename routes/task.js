var __ = require('underscore');

var database = {};

// Bootstrapping some data so the page isn't empty
if (!database.tasks) {
	database.tasks = [
		{
			id: 1,
			description: 'The first example task.',
			complete: true
		},
		{
			id: 2,
			description: 'Second example task.',
			complete: false
		}
	];
}

function next_id() {
	if (database.tasks && database.tasks.length > 0) {
		var max = __.max(database.tasks, function (task) { return task.id });
		console.log(max);
		return max.id + 1;
	}
	return 0;
}
 
exports.findById = function(req, res) {
	var id = parseInt(req.params.id);
	console.log('Retrieving task: ' + id);
	
	res.send(__.findWhere(database.tasks, { id: id }));
};
 
exports.findAll = function(req, res) {
	console.log('Returning all tasks');

	res.send(database.tasks);
};
 
exports.addTask = function(req, res) {
	var task = req.body;

	console.log('Adding task:');
	console.log(JSON.stringify(task));

	task.id = next_id(); // In memory "database" doesn't auto-generate IDs.
	console.log('setting id to: ' + task.id);
	database.tasks.push(task);
	res.send(task);
};
 
exports.updateTask = function(req, res) {
	var id = parseInt(req.params.id);
	var task = req.body;

	console.log('Updating task: ' + id);
	console.log(JSON.stringify(task));

	var taskToUpdate = __.findWhere(database.tasks, { id: id });
	if (taskToUpdate) {
		res.send(__.extend(taskToUpdate, task));
	}
};
 
exports.deleteTask = function(req, res) {
	var id = parseInt(req.params.id);
	console.log('Deleting task: ' + id);
	
	database.tasks = __.reject(database.tasks, function (task) { return task.id === id });

	res.send({});
};