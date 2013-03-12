var AppRouter = Backbone.Router.extend({
	routes: {
		"": "home",
		"admin": "admin",
		"login": "login",
		"logout": "logout",
		"admin/users": "users"
	},

	initialize: function() {
		this.firstPage = true;
	},

	home: function() {
		$("#admin-nav").hide();
		$("#site-nav").show();
		this.changePage(new HomeView());	
	},

	admin: function() {
		if(!window.userIsAdmin()) {
			//document.location.hash = "login";
			this.changePage(new LoginView({ model: {askedUrl: "admin"} }));
		} else {
			$("#site-nav").hide();
			this.changePage(new AdminView());
			$("#site-nav").fadeOut(function() {
				$("#admin-nav").fadeIn();
			});
		}
	},

	users: function() {

		if(!window.userIsAdmin()) {
			this.changePage(new LoginView({ model: {askedUrl: "admin/users"} }));
		} else {
			var users = new UserCollection();
			var self = this;
			users.fetch({
				success: function() {
					self.changePage(new UsersView({model: users}));
				}
			});	
		}
	},

	changePage: function (page) {
		if(!this.firstPage) {
			$('#page-content').fadeOut(100);
		}
		$('#page-content').empty();
        page.render();
        $('#page-content').append($(page.el));
        $('#page-content').fadeIn(100);
    },

    login: function() {
    	this.changePage(new LoginView());
    },

    logout: function() {
    	setCookie("userId", "");
    	document.location.hash = "";
    }
});

$(document).ready(function() {	
	
	Backbone.sync = function(method, model, options) {
		var methodMap = {
			'create': 'POST',
		    'update': 'PUT',
		    'patch':  'PATCH',
		    'delete': 'DELETE',
		    'read':   'GET'
		};
		var type = methodMap[method];

		console.log("Save...");

	    // Default options, unless specified.
	    options || (options = {})
	    /*
	    _.defaults(options || (options = {}), {
	      	emulateHTTP: Backbone.emulateHTTP,
	      	emulateJSON: Backbone.emulateJSON
	    });
		*/

	    // Default JSON-request options.
	    var params = {type: type, dataType: 'json'};

	    // Ensure that we have a URL.
	    if (!options.url) {
	      	params.url = _.result(model, 'url') || urlError();
	    }

	    // Ensure that we have the appropriate request data.
	    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
	      	params.contentType = 'application/json';
	      	params.data = JSON.stringify(options.attrs || model.toJSON(options));
	    }

	    // For older servers, emulate JSON by encoding the request into an HTML-form.
	    if (options.emulateJSON) {
	      	params.contentType = 'application/x-www-form-urlencoded';
	      	params.data = params.data ? {model: params.data} : {};
	    }

	    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
	    // And an `X-HTTP-Method-Override` header.
	    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
	      	params.type = 'POST';
	      	if (options.emulateJSON) params.data._method = type;
	      	var beforeSend = options.beforeSend;
	      	options.beforeSend = function(xhr) {
	        	xhr.setRequestHeader('X-HTTP-Method-Override', type);
	        	if (beforeSend) return beforeSend.apply(this, arguments);
	      	};
	    }
	    

	    // Don't process data on a non-GET request.
	    if (params.type !== 'GET' && !options.emulateJSON) {
	      	params.processData = false;
	    }
		
	    var success = options.success;
	    options.success = function(resp) {
	      	if (success) success(model, resp, options);
	      	//model.trigger('sync', model, resp, options);
	    };

	    var error = options.error;
	    options.error = function(xhr) {
	      	if (error) error(model, xhr, options);
	      	//model.trigger('error', model, xhr, options);
	    };

	    // Make the request, allowing the user to override any Ajax options.
	    var xhr = options.xhr = Backbone.$.ajax(_.extend(params, options));
	    //model.trigger('request', model, xhr, options);

	    return xhr;
	};
	
	var app = new AppRouter();
	Backbone.history.start();
	
});