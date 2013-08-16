#Backbone Fundamentals

Created for Best Buy by Adam Terlson ([@adamterlson](http://twitter.com/adamterlson))

This is a testbed application that shows a build-up progression for a Todo application (similar to [ToDo MVC](http://backbonejs.org/examples/todos/) but in my own style).  The application consumes real REST services served up from a Node+Express server.  The code is also heavily commented to provide instruction as to what changed and wherever necessary describing what I did and why.

###There is no single "best" way to write backbone apps.###

What I have is based on leading large teams where folks often don't know Backbone and trying to not create a tangled mess.  Finding a paradigm that works for you/your team/your company is more important than following what you see here.  It's about creating a convention so everyone can jump in and understand the code.  This is my convention, and have found it to work well.

For additional help on Backbone best practices and code style, check out [my presentation on the topic](http://rvl.io/adamterlson).

##Usage

Assuming you have Node and NPM installed already, navigate to the folder where you pulled the code down to and start the Node/Express server:

- `npm install`  This will install all of the node dependencies.
- `npm start` *or* `node server.js` Run the server!

Then navigate to: `localhost:8000`

##Annotated Sample Files

Check out `/public/js/annotated` to see annotated source files for the different sections, what they are for, conventions to follow, things to avoid etc.  Right now only the view is complete.  More to come.  These files won't work if you run them, the point is to show as many different scenarios as possible.

##Contributing

If you'd like to make changes, let me know or submit a pull request.

##Troubleshooting

If the server fails to start, make sure nothing else is running on port 8000.
