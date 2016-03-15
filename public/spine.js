
var User = Backbone.Model.extend({
	urlRoot: '/users',
	defaults: {
		username: null,
		email: null,
		name: null
	},
	create: function(data){
		data.userMode = 'full';
		this.save(data, {
			success: function(model, response){
				if (response.redirect) {
					window.location = response.redirect;
				}
				else {
					model.trigger('syncAttempt', null, response.message);
				}
			},
			error: function(model, response){}
		});
	},
	createGuest: function(){
		data = {userMode: 'guest'};
		this.save(data, {
			success: function(model, response){
				if (response.redirect) {
					window.location = response.redirect;
				}
			},
			error: function(model, response){}
		});
	},
	update: function(data){
		this.save(data, {
			success: function(model, response){
				if (response.message) {
					model.trigger('updateAttempt', null, response.message);
				} else {
					model.set(response.user);
					model.trigger('updated')
				}
			},
			error: function(model, response){}
		})
	},
	authenticate: function(data){
		$.ajax({
			url: '/session',
			method: 'POST',
			data: data,
			context: this
		})
		.done(function(response){
			if (response.redirect) {
				window.location = response.redirect;
			}
			else {
				this.trigger('loginAttempt', null, response.message);
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
	templateEdit: _.template(userEditTemplate),
	templateGuest: _.template(userGuestTemplate),
	initialize: function(){
		this.listenTo(this.model, 'syncAttempt', function(event, message){
			this.renderNew(null, message);
		});
		this.listenTo(this.model, 'loginAttempt', function(event, message){
			this.renderLogin(null, message);
		});
		this.listenTo(this.model, 'updateAttempt', function(event, message){
			this.renderEdit(null, message);
		});		
		this.listenTo(this.model, 'updated', function(event, message){
			this.render(null, null);
		});

		this.render(null, null);
	},
	render: function(event, message){
		if (user.isAuthenticated === false) {
			this.renderLogin(event, message);
		}
		else if (user.attributes.userMode === 'guest') {
			this.renderGuest(event, message);
		}
		else {
			this.$el.html(this.templateShow(this.model.attributes) );
		}

	},
	// `event` will never be used, but is passed by jQuery
	renderLogin: function(event, message){
		this.$el.html(this.templateLogin({message: '' || message}));
	},
	renderNew: function(event, message){
		this.$el.html(this.templateNew({message: '' || message}));
	},
	renderEdit: function(event, message){
		var data = this.model.attributes;
		data.message = '' || message;
		this.$el.html(this.templateEdit(data));
	},
	renderGuest: function(event, message){
		var data = this.model.attributes;
		data.message = '' || message;
		this.$el.html(this.templateGuest(data));
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
	createGuest: function(){
		this.model.createGuest();
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
	update: function(){
		var data = {
			username: $('#username').val(),
			email: $('#email').val(),
			password: $('#password').val(),
			passwordConfirm: $('#password-confirm').val(),
			userMode: 'full'
		};
		this.model.update(data)
	},
	events: {
		'click .signup': 'renderNew',
		'click .create': 'create',
		'click .guest': 'createGuest',
		'click .login': 'authenticate',
		'click .logout': 'logout',
		'click .edit': 'renderEdit',
		'click .update': 'update'
	}
})

// ~~~ DROPLET ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Vessels contain Droplets
// Each list item is controlled individually without using a form
// Droplets are instantiated by Vessels

// ~~~ DROPLET ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var Droplet = Backbone.Model.extend({
	idAttribute: '_id',
	create: function(data){
		this.set(data);
		this.save(null, {
			success: function(model, response) {}
		});
	}
}); 

var DropletView = Backbone.View.extend({
	tagName: 'li',
	templateShow: _.template(dropletShowTemplate),
	templateEdit: _.template(dropletEditTemplate),
	initialize: function(){
		this.listenTo(this.model, 'change', this.render);
	},
	render: function() {
		if (this.model.isNew()) {
			return this.renderEdit();
		}
		else {
			var data = this.model.attributes;
			return this.$el.html( this.templateShow({data: data}) );
		}
	},
	renderEdit: function() {
		var data = this.model.attributes;
		return this.$el.html( this.templateEdit({data: data}) );
	},
	create: function(){
		var data = {};
		this.$('.name').val() ? data.name = this.$('.name').val() : null;
		this.$('.url').val() ? data.url = this.$('.url').val() : null;
		this.$('.author').val() ? data.author = this.$('.author').val() : null;
		this.$('.text').val() ? data.text = this.$('.text').val() : null;

		this.model.create(data);
	},
	liquidate: function(){
		this.model.destroy();
		this.$el.remove();
	},
	events: {
		'click .add': 'create',
		'click .delete': 'liquidate',
		'mouseover': function(){
			this.$('input').css('visibility', 'visible');
			// this.$('.delete').css('visibility', 'visible');
		},
		'mouseout': function(){
			if (this.$('input').val() === '') {
				this.$('input').css('visibility', 'hidden');
			}
			// this.$('.delete').css('visibility', 'hidden');
		}
	}
}); // end ItemView



// ~~~ VESSEL ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var Vessel = Backbone.Collection.extend({
	model: Droplet,
	url: '/droplets',
	initialize: function(models, options){
		this.category = options.category;
		if (this.category === 'ponder') {
			this.dropletType = 'quote';
		} else {
			this.dropletType = 'link';
		}

		this.on('sync', this.needsNew, this);
	},
	addNew: function() {
		if (this.models.length < 11) {
			this.add(new Droplet({type: this.dropletType, category: this.category}));
		}
	},
	needsNew: function() {
			var needsNew = true;
			for (var i = 0; i < this.models.length; i++) {
				if (this.models[i].isNew()) { 
					needsNew = false;
				}
			}
			if (needsNew) { this.addNew() }
		}
});

var VesselView = Backbone.View.extend({
	dropletType: 'link',
	templateShow: _.template('<li class="title"><h2><%= category.toUpperCase() %></h2></li>'),
	initialize: function(){
		this.render();
		this.listenTo(this.collection, 'add', this.renderDroplet);
	},
	render: function(){
		this.$el.append(this.templateShow({category: this.collection.category}));
	},
	renderDroplet: function(model, collection, options) {
		var view = new DropletView({model: model});
console.log(model.isNew())
		view.render();
		this.$el.append(view.el);
	}
});




