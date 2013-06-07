var express = require('express'),
	Backbone = require('backbone'),
	Controller = require('./controller'),
	app = express(),
	task = require('./routes/task');
 
var app = express();

app.configure(function () {
    app.use(express.bodyParser());
});


/*
app.get('/api/task', task.findAll);
app.get('/api/task/:id', task.findById);
app.post('/api/task', task.addTask);
app.put('/api/task/:id', task.updateTask);
app.delete('/api/task/:id', task.deleteTask);
*/

var data = new Backbone.Collection([
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
	]);
var controller = new Controller(data).restify(app, '/api/task');
var controller404 = new Controller(data, {
	post: function (req, res) {
		throw { code: 404, body: { error: true }};
	}
}).restify(app, '/api/will404');

app.use('/', express.static('public'));
 
app.listen(8000);
console.log('Listening on port 8000...');