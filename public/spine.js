var User = Backbone.Model.extend({
	initialize: function(){

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
				if (response.redirect) {
					window.location = response.redirect;
				}
			},
			error: function(model, response){}
		});
	},
	authenticate: function(data){
		$.ajax({
			url: '/session',
			method: 'POST',
			data: data,
			context: this
		}).done(function(response){
			if (response.redirect) {
				window.location = response.redirect;
			}
			else {
				// null is placeholder for jQuery event
				this.trigger('loginAttempt', null, response);
			}
		});
	},
	logout: function(){
		$.ajax({
			method: 'DELETE',
			url: '/session'
		})
		.done(function(response){
			window.location = response.redirect;
		});
	}
});

var UserView = Backbone.View.extend({
	el: '#user',
	templateNew: _.template(userNewTemplate),
	templateLogin: _.template(userLoginTemplate),
	templateShow: _.template(userShowTemplate),
	initialize: function(){
		this.listenTo(this.model, 'sync', function(object, response){
			this.renderNew(null, response.message);
		})
		this.listenTo(this.model, 'loginAttempt', function(object, response){
			this.renderLogin(null, response.message);
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
	// `event` will never be used, but is passed by jQuery
	renderLogin: function(event, message){
		this.$el.html(this.templateLogin({message: '' || message}));
	},
	renderNew: function(event, message){
		this.$el.html(this.templateNew({message: '' || message}));
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
		this.model.logout();
	},
	events: {
		'click .signup': 'renderNew',
		'click .create': 'create',
		'click .login': 'authenticate',
		'click .logout': 'logout'
	}
})



// Vessels contain Droplets
// Each list item is controlled individually without using a form
// Droplets are instantiated by Vessels
var Droplet = Backbone.Model.extend({
	idAttribute: '_id',
	create: function(data){
		this.set(data);
		this.save();
	},
	liquidate: function(){
		this.save(null, {
			silent: true,
			success: function(model, response){
				model.clear({silent: true})
				model.set(response);
				model.trigger('liquidate');
			}
		})
	}
}); 

var DropletView = Backbone.View.extend({
	tagName: 'li',
	templateShow: _.template(dropletShowTemplate),
	templateEdit: _.template(dropletEditTemplate),
	initialize: function(){
		this.listenTo(this.model, 'sync', this.render);
		this.listenTo(this.model, 'liquidate', this.render);
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
		var data = {
			name: this.$('.text').val(),
			url: this.$('.url').val(),
			type: 'link'
		};
		this.model.create(data);
	},
	destroy: function(){
		this.model.liquidate();
	},
	events: {
		'click .add': 'create',
		'click .delete': 'destroy',
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


var Vessel = Backbone.Collection.extend({
	model: Droplet,
	url: '/droplets',
	initialize: function(models, options){
		this.category = options.category;
	}
})

var VesselView = Backbone.View.extend({
	initialize: function(){
		this.render();
	},
	render: function(){
		_.each(this.collection.models, function(e){
			var currentDroplet = new DropletView({model: e});
			var li = currentDroplet.render();
			this.$el.append(li);
		}, this);
	}
});

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




