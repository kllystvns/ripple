// object cloning utility
var clone = function(object){
	var newObject = {}
	for (attr in object) {
		newObject[attr] = object[attr];
	}
	return newObject;
}

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
					model.trigger('syncAttempt', null, response);
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
				model.trigger('updated', null, response);
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
	templateEdit: _.template(userEditTemplate),
	templateGuest: _.template(userGuestTemplate),
	initialize: function(){
		this.listenTo(this.model, 'syncAttempt', function(object, response){
			this.renderNew(null, response.message);
		});
		this.listenTo(this.model, 'loginAttempt', function(object, response){
			this.renderLogin(null, response.message);
		});
		this.listenTo(this.model, 'updated', function(object, response){
			this.model.set(response)
			console.log('hey')
			this.render(null, response);
		});
		this.render();
	},
	render: function(){
		if (user.isAuthenticated === false) {
			console.log(1)
			this.renderLogin();
		}
		else if (user.attributes.userMode === 'guest') {
			this.renderGuest();
		}
		else {
			console.log(2)
			this.$el.html(this.templateShow(this.model.attributes) );
		}

	},
	// `event` will never be used, but is passed by jQuery
	renderLogin: function(event, message){
		console.log('here')
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
			success: function(model, response){
				model.trigger('created')
			}
		});
	},
	liquidate: function(){
		this.save(null, {
			success: function(model, response){
				model.clear()
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
		this.listenTo(this.model, 'created', this.render);
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
	}
})

var VesselView = Backbone.View.extend({
	initialize: function(){
		this.render();
	},
	render: function(){
		this.$el.append(this.template);
		_.each(this.collection.models, function(e){
			var currentDroplet = new DropletView({model: e});
			var li = currentDroplet.render();
			this.$el.append(li);
		}, this);
	}
});

// Specialized Vessel views depending on content
var PonderView = VesselView.extend({
	el: '#ponder',
	template: '<li class="title"><h2>REFLECT</h2></li>'
});
var SeeView = VesselView.extend({
	el: '#see',
	template: '<li class="title"><h2>SEE</h2></li>'
});
var HearView = VesselView.extend({
	el: '#hear',
	template: '<li class="title"><h2>HEAR</h2></li>'
});
var LearnView = VesselView.extend({
	el: '#learn',
	template: '<li class="title"><h2>LEARN</h2></li>'
});
var ReadView = VesselView.extend({
	el: '#read',
	template: '<li class="title"><h2>READ</h2></li>'
});




