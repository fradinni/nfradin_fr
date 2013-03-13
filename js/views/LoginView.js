window.LoginView = Backbone.View.extend({
	events: {
		"click #login_submit": "auth"
	},

	initialize: function() {
		this.template = _.template(this.getTemplate("login"));
		this.askedUrl = this.model ? "#"+this.model.askedUrl : "#";
		console.log("Asked url: " + this.askedUrl);
	},

	render: function() {
		$("#site-nav").hide();
		$(this.el).html(this.template());
		$("#login-form", this.el).attr("action", this.askedUrl);
		console.log("Form url: " + $("#login-form", this.el).attr("action"));
	},

	auth: function(event) {
		//event.preventDefault();
		var self = this;
		var username = $("input[name='username']").val();
		var password = $("input[name='password']").val();

		$.ajax({
			url: 'http://localhost:10010/auth',
			data: {username: username, password: password},
			method: 'POST',
			dataType: 'json',
			async: false,
			success: function(user) {
				console.log("User found: " + user.username);
				if(user) {
					console.log("user.lastLogin: " + user.lastLogin);
					setCookie("user-id", user._id);
					setCookie("user-last-login", user.lastLogin);
				}
			},
			error: function(err) {
				event.preventDefault();
				console.log("User was not found !");
				alert("Username or password is incorrect !");
				$("input[name='password']").val("");
			}
		});

	}
});