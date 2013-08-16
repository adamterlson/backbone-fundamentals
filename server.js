var express = require('express'),
	Backbone = require('backbone'),
	Controller = require('./controller'),
	app = express(),
	task = require('./routes/task');

var app = express();

app.configure(function () {
    app.use(express.bodyParser());
});

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

app.use('/', express.static('public'));

app.listen(8000);
console.log('Listening on port 8000...');