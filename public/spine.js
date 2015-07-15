var User = Backbone.Model.extend({
	initalize: function(){
		this.vessels = new VesselCollection();
	},
	defaults: {
		username: null,
		email: null,
		name: null
	},
	urlRoot: '/users'
});

var UserView = Backbone.View.extend({
	el: '#user',
	initalize: function(){
		this.render();
	},
	render: function(){
		this.$el.html('user not quite ready')
	}
})


var Vessel = Backbone.Model.extend({
	initialize: function(){
		this.items = [];
		// There are 5 slots in the dom/view for items
		// Make an 'empty' item model if there isnt an item
		for (var i = 0; i < 5; i++) {
			console.log(this);
			var data = this.attributes.items[i] ? this.attributes.items[i] : {type: 'uninstantiated'};
			this.items.push(new Item(data));
		}
	},
	defaults: {
		category: null
	},
	collection: VesselCollection
});

var VesselCollection = Backbone.Collection.extend({
	model: Vessel,
	url: '/users/:id/vessels'
});

var VesselView = Backbone.View.extend({
	initialize: function(){
		this.render();
	},
	render: function(){
		_.each(this.model.items, function(e){
			var currentItem = new ItemView({model: e});
			var li = currentItem.render();
			this.$el.append(li);
		}, this);
	}
});

var Item = Backbone.Model.extend();

var ItemView = Backbone.View.extend({
	events: {
		'click .add': function(){

		},
		'click .delete': function(){

		}
	},
	tagName: 'li',
	templateShow: _.template(itemShowTemplate),
	templateEdit: _.template(itemEditTemplate),
	initialize: function(){
		// this.listenTo(this.model, 'change', this.render);
	},
	render: function() {
		var data = this.model.attributes;
		return this.$el.html( this.templateShow(data) );
	},
	renderEdit: function() {
		return this.$el.html( this.templateEdit(data) );
	}
});

// Specialized views depending on content
var PonderView = VesselView.extend({
	el: '#ponder'
});

var SeeView = VesselView.extend({
	el: '#see'
});

var HearView = VesselView.extend({
	el: '#hear'
});

var LearnView = VesselView.extend({
	el: '#learn'
});

var ReadView = VesselView.extend({
	el: '#read'
});






var doneLoading = function() {
	$('#loading').hide();
}

setTimeout(doneLoading, 2);