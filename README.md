#Backbone Fundamentals

Created for Best Buy by Adam Terlson ([@adamterlson](http://twitter.com/adamterlson))

This is a testbed application that shows a build-up progression for a Todo application (similar to [ToDo MVC](http://backbonejs.org/examples/todos/) but in my own style).  The application consumes real REST services served up from a Node+Express server.  The code is also heavily commented to provide instruction as to what changed and wherever necessary describing what I did and why.

**THIS IS NOT GOSPEL, IT IS MY OPINION.**  But that opinion is based on leading large teams where folks often don't know Backbone and trying to not create a tangled mess.

For additional help on Backbone best practices and code style, check out [my presentation on the topic](http://rvl.io/adamterlson).

##Usage

Navigate to folder where you pulled the code down to and start the Node/Express server:

- `npm install`  This will install all of the node dependencies.
- `node server.js`  Run the server!

Then navigate to: `localhost:8000`

##Annotated Sample Files

Check out `/public/js/annotated` to see annotated source files for the different sections, what they are for, conventions to follow, things to avoid etc.  Right now only the view is complete.  More to come.  These files won't work if you run them, the point is to show as many different scenarios as possible.

##Contributing

If you'd like to make changes, updates, etc let me know/submit a pull request.

##Troubleshooting

If the server fails to start, make sure nothing else is running on port 8000.
