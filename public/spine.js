var User = Backbone.Model.extend({
	initialize: function(){
		this.message = '';
	},
	urlRoot: '/users',
	defaults: {
		username: null,
		email: null,
		name: null
	},
	create: function(data){
		user.save(data, {
			success: function(model, response){
				console.log(this)
				// this.message = response.message;
			},
			error: function(model, response){}
		});
	},
	authenticate: function(data){
		$.ajax({
			url: '/session',
			method: 'POST',
			data: data
		});
	}
});

var UserView = Backbone.View.extend({
	el: '#user',
	templateNew: _.template(userNewTemplate),
	templateLogin: _.template(userLoginTemplate),
	templateShow: _.template(userShowTemplate),
	initialize: function(){
		this.listenTo(this.model, 'sync', function(object, res){
			this.renderNew(null, res.message);
		})
		this.render();
	},
	render: function(){
		if (user.isAuthenticated === false) {
			this.renderLogin();
		}
		else {
			this.$el.html(this.templateShow(user.attributes) );
		}

	},
	renderLogin: function(){
		this.$el.html(this.templateLogin);
	},
	renderNew: function(event, message){
		this.$el.html(this.templateNew({message: '' || message}));
	},
	redirectNew: function(){
		$.ajax({
			url: '/users/new',
			method: 'GET'
		})
	},
	create: function(){
		var data = {
			username: $('#username').val(),
			email: $('#email').val(),
			password: $('#password').val(),
			passwordConfirm: $('#password-confirm').val()
		};
		this.model.create(data);
	},
	authenticate: function(){
		var data = {
			username: $('#username').val(),
			password: $('#password').val()
		};
		this.model.authenticate(data);
	},
	logout: function() {
		$.ajax({
			method: 'DELETE',
			url: '/session'
		}).done(function(response){
			console.log(response)
			window.location = '/'
		})
	},
	events: {
		'click .signup': 'renderNew',
		'click .create': 'create',
		'click .login': 'authenticate',
		'click .logout': 'logout'
	}
})



var Vessel = Backbone.Model.extend({
	initialize: function(){
		this.droplets = [];
		// There are 5 slots in the dom/view for items
		// Make an 'empty' droplet model if there isnt an item
		for (var i = 0; i < 5; i++) {
			var data = this.attributes.droplets[i] ? this.attributes.droplets[i] : {type: 'uninstantiated'};
			data.index = i;
			this.droplets.push(new Droplet(data));
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
		_.each(this.model.droplets, function(e){
			var currentDroplet = new DropletView({model: e});
			var li = currentDroplet.render();
			this.$el.append(li);
		}, this);
	}
});

// Vessels contain Droplets
// Each list item is controlled individually without using a form
// Items are instantiated by Vessels
var Droplet = Backbone.Model.extend(); 

var DropletView = Backbone.View.extend({
	tagName: 'li',
	templateShow: _.template(dropletShowTemplate),
	templateEdit: _.template(dropletEditTemplate),
	initialize: function(){
		// this.listenTo(this.model, 'change', this.render);
	},
	render: function() {
		var data = this.model.attributes;
		if (this.model.attributes.type === 'uninstantiated') {
			return this.$el.html( this.templateEdit(data) );
		}
		else {
			return this.$el.html( this.templateShow(data) );
		}
	},
	renderEdit: function() {
		return this.$el.html( this.templateEdit(data) );
	},
	create: function(){
		user
	},
	destroy: function(){

	},
	events: {
		'click .add': this.create,
		'click .delete': this.destroy,
		'mouseover': function(){
			this.$('input').css('visibility', 'visible');
		},
		'mouseout': function(){
			if (this.$('input').val() === '') {
				this.$('input').css('visibility', 'hidden');
			}
		}
	}
}); // end ItemView


// Specialized Vessel views depending on content
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




