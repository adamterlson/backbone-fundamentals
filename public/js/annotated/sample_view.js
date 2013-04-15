var MyView = Backbone.View.extend({
	/* 
	=== PROPERTIES ===
	This section is about writing self-documenting code.  No custom parameters should be set
	on the view without being listed here.  Handy for default values.  Beware of {} and []
	because these are set on the _prototype_ meaning every instance of this object will get
	the _same_ instance of the object or array.  Initialize objects and arrays to null and set
	them in the initialize function to avoid this issue.

	- templates: People think that 'template' has special meaning in Backbone when it does
	  not.  Here I show a nice way to group all of your templates together when your view
	  has more than one.
	==================
	*/

	// Properties

	pageSize: 10,
	pages: null,

	templates: {
		frame: _.template(frameTemplate),
		spotA: _.template(spotATemplate),
		spotB: _.template(spotBTemplate)
	},




	/*
	=== BACKBONE ===
	This section is for backbone-native overrides.  If you're overriding initialize, 
	constructor, save, events or anything natively given to you by Backbone, put it here.

	- initialize(): DO NOT CALL RENDER.  If you're unit testing and you new up a view to
	  test it, the last thing you want is your view rendering and touching the DOM. Invert
	  control over render (or bootstrap) to the parent.

	- events: If your view extends another view which defines events, events must be a
	  function made a bit smarter to extend the prototype's events.  Otherwise, it can
	  just be a normal object.
	================
	*/

	// Backbone

	initialize: function () {
		this.listenTo(this.primaryModel, 'change', this.onPrimaryModelChange);
		this.listenTo(this.secondaryModel, 'change', this.onSecondaryModelChange);
	},

	// Option 1: Events extends a baseView's events
	events: function(){
		return _.extend({}, baseView.prototype.events, {
			'change input.name': 'onNameInputChange',
			'click a.delete-item': 'onDeleteItemClick'
		});
	},

	// Option 2: Normal event object (will overwrite any prototype events)
	events: {
		'change input.name': 'onNameInputChange',
		'click a.delete-item': 'onDeleteItemClick'
	},




	/*
	=== BOOTSTRAP ===
	Bootstrap is for first-time data hydration that might be necessary prior to rendering.
	This hydration shouldn't go in initialize because it'll muddle your tests, and it can't
	go in render because render is leveraged to update the DOM to state changes.  Consider
	it the orchestrator of when and what is okay to render based on what data has been
	loaded.  As well as when the data gets loaded.

	Option 1: Multiple models and multiple render functions can be leveraged direct from
	bootstrap to show spinners into frame spots prior to the data coming back.  
	renderFrame() will load divs that the renderPrimary() and renderSecondary() methods
	will load their content into.

	Option 2: This scenario shows not rendering anything until multiple models are
	fetched from the server.

	Option 3: If you have no models to hydrate, just calling render is just fine!  You
	can just get rid of bootstrap, but I like my parents having a consistent API to call
	when kicking off a child view.  Just always call bootstrap and let the child figure
	out what that means.
	=================
	*/

	// Bootstrap

	// Option 1: Hydration with spinner
	bootstrap: function () {
	    this.renderFrame(); //shows spinner(s)
	    
	    this.primaryModel.fetch().then(this.renderPrimary); 
	    this.secondaryModel.fetch().then(this.renderSecondary);
	    
	    return this;
	},

	// Option 2: Hydration before any render
	bootstrap: function () {
	    $.when(
	        this.primaryModel.fetch(),
	        this.secondaryModel.fetch()
	    ).then(this.render);
	    
	    return this;
	},

	// Option 3: No hydration
	bootstrap: function () {
	    return this.render();
	}




	/*
	=== RENDERING ===
	This section's methods should all start with "render".  If you only have one, leaving
	the name at "render" is fine, but if you have more than one render method you should
	name them "render<Thing>".  Multiple render methods is a great way to target oft-updated
	sections of the page and updating it without redrawing the entire page.

	When passing data to templates, always call .toJSON() on your model.  Further, if you
	need additional data, DO NOT call model.set() in order to get it in your template as
	this will persist values added this way to the server.  Follow the example in 
	renderSpotB where the object is extended with additional data.
	=================
	*/

	// Rendering

	renderFrame: function () {
		this.$el.html(this.templates.frame())
	},

	renderSpotA: function () {
		this.$('#spotA').html(this.templates.spotA(this.primaryModel.toJSON()));
	},

	renderSpotB: function () {
		var data = _.extend(this.secondaryModel.toJSON(), {
			helperMethod: this.helperMethod,
			someInfo: true
		});
		this.$('#spotB').html(this.templates.spotB(data));
	},


	

	/*
	=== UI EVENTS ===
	UI events are _thin_ event handlers for events bound to via backbone's events object.
	These events are the only other place outside of a render method that touching the DOM
	is acceptable.  Additionally, these events should have absolutely no business or
	operational logic whatsoever.

	All functions are named "on<Element><Action>" so as to make it clear these functions
	cannot be reused in different scenarios in place of actual business logc methods.
	=================
	*/

	// UI Events

	onNameInputChange: function (e) {
		var val = $(e.target).val();
		if (val) {
			this.model.set('name', val);
		}
	},

	onDeleteItemClick: function (e) {
		var itemId = $(e.target).closest('li').data('itemId');
		this.deleteItem(itemId);
	}


	

	/*
	=== BACKBONE EVENTS ===
	Backbone events are just like UI Events in their rules: thin, named on<Element><Action>
	and should not contain operational or business logic.
	=======================
	*/

	// Backbone Events

	onPrimaryModelChange: function () {
		this.renderPrimary();
	},

	onSecondaryModelChange: function () {
		if (this.model.get('someValue')) {
			this.renderSecondary();
		}
	}




	/*
	==== METHODS ===
	Methods are where your custom view functionality goes.  It's where operational logic
	lives and are reusable, easily tested methods for performing various actions.  Standard
	programming best practices apply like not making these functions too large and splitting
	them up where appropriate.  Further, don't hesitate to create helper classes for your
	view if things are really getting out of hand.

	Helper methods could also be passed to your template to assist with formatting or
	complex view logic.
	================
	*/

	// Methods

	helperMethod: function () {

	}

});