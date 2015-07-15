var User = Backbone.Model.extend({
	authenticated: false,
	defaults: {
		username: null,
		email: null,
		name: null
	},
	urlRoot: '/users'
});

var UserView = Backbone.View.extend({
	el: '#user',
	initalize: {

	},
	render: {
		
	}
})


var Vessel = Backbone.Model.extend({
	defaults: {
		category: null,
		type: null,
		items: []
	},
	collection: VesselCollection
});

var VesselCollection = Backbone.Collection.extend({
	model: Vessel,
	url: '/users/:id/vessels'
});

var Item = Backbone.Model.extend();

var ItemView = Backbone.View.extend();

var Ponder = Vessel.extend({
	
})






var doneLoading = function() {
	$('#loading').hide();
}

setTimeout(doneLoading, 2);