var AppRouter = Backbone.Router.extend({
	routes: {
		"": "home",
		"admin": "admin",
		"login": "login",
		"logout": "logout",
		"admin/users": "users",
		"admin/articles": "articles",
		"admin/articles/:action": "articles"
		//"admin/articles/new": "newArticles"
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
		var self = this;

		userIsLoggedInWithRoles(['ROLE_ADMIN'], {
			success: function(model) {
				$("#site-nav").hide();
				self.changePage(new AdminView());
				$("#site-nav").fadeOut(function() {
					$("#admin-nav").fadeIn();
				});
			},
			error: function(err) {
				console.log("User is not logged in !");
				self.changePage(new LoginView({ model: {askedUrl: "admin"} }));
			}
		});
	},

	users: function() {

		var self = this;

		userIsLoggedInWithRoles(['ROLE_ADMIN'], {
			success: function(model) {
				var users = new UserCollection();
				users.fetch({
					success: function() {
						self.changePage(new UsersView({model: users}));
					}
				});	
			},
			error: function(err) {
				self.changePage(new LoginView({ model: {askedUrl: "admin/users"} }));
			}
		});
	},

	articles: function(action) {
		var self = this;

		userIsLoggedInWithRoles(['ROLE_ADMIN','ROLE_EDITOR'], {
			success: function(model) {

				switch(action) {
					case 'new':
						self.changePage(new CreateArticleView({model: articles}));
					break;

					default:
						var articles = new ArticleCollection();
						articles.fetch({
							success: function() {
								self.changePage(new ArticlesView({model: articles}));
							}
						});
					break;
				}

					
			},
			error: function(err) {
				self.changePage(new LoginView({ model: {askedUrl: "admin/articles"} }));
			}
		});
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
    	setCookie("user-id", "");
    	setCookie("user-last-login", "");
    	this.home();
    }
});



// Launch App. when DOM is loaded
$(document).ready(function() {	
	
	console || (console = {
		log: function(){},
		error: function(){},
		warn: function(){},
		debug: function(){}
	});
	
	var app = new AppRouter();
	Backbone.history.start();
	
});