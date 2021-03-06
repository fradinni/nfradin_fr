var AppRouter = Backbone.Router.extend({
	routes: {
		"": "home",
		"admin": "admin",
		"login": "login",
		"logout": "logout",
		"admin/users": "users",
		"admin/articles": "articles",
		"admin/articles/:action": "articles",
		"admin/articles/:action/:id": "articles"
		//"admin/articles/new": "newArticles"
	},

	initialize: function() {
		this.firstPage = true;
	},

	home: function() {
		$("#admin-nav").hide();
		$("#site-nav").show();

		userIsLoggedInWithRoles(['ROLE_ADMIN'], {
			success: function(model) {
				$("#login-link").hide();
				$("#admin-link").show();
				$("#logout-link").show();
			}
		});

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

	articles: function(action, id) {
		var self = this;

		userIsLoggedInWithRoles(['ROLE_ADMIN','ROLE_EDITOR'], {
			success: function(loggedInUser) {

				switch(action) {

					// NEW ARTICLE
					case 'new':
						self.changePage( new CreateArticleView({ model: new ArticleModel({author: loggedInUser.get('_id')}) }) );
					break;


					// EDIT ARTICLE
					case 'edit':
						var articleToEdit = new ArticleModel({_id: id});
						articleToEdit.fetch({
							success: function(model) {
								model.set({author: loggedInUser.get('_id')});
								self.changePage(new CreateArticleView({model: model}));
							},
							error: function(){
								var articles = new ArticleCollection();
								articles.fetch({
									success: function() {
										self.changePage(new ArticlesView({model: articles}));
									}
								});
							}
						})
						
					break;


					// LIST ARTICLES
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

        userIsLoggedIn({
			success: function(user) {
				$("#login-name").html("&nbsp;Welcome, <b>"+user.get('username')+"</b>");
			}
		});
    },

    login: function() {
    	this.changePage(new LoginView());
    },

    logout: function(e) {
    	setCookie("user-id", "");
    	setCookie("user-last-login", "");
    	$("#login-name").html("");
    	$("#logout-link").hide();
    	$("#admin-link").hide();
    	$("#login-link").show();
    	document.location.hash = "";
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
	
	window.APP = new AppRouter();
	Backbone.history.start();

	$("#toggle-header").unbind('click');
	$("#toggle-header").bind('click', window.toggleHeader);
});