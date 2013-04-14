var express = require('express'),
	app = express(),
	task = require('./routes/task');
 
var app = express();

app.get('/api/task', task.findAll);
app.get('/api/task/:id', task.findById);
app.post('/api/task', task.addTask);
app.put('/api/task/:id', task.updateTask);
app.delete('/api/task/:id', task.deleteTask);

app.use('/', express.static('public'));
 
app.listen(8000);
console.log('Listening on port 8000...');