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

	var app = new AppRouter();
	Backbone.history.start();
	
});