window.userIsAdmin = function() {
	//var isAdmin = getCookie("isAdmin");
	var userId = getCookie("userId");
	console.log("Check if user is admin: " + userId);

	if(!userId) {
		return false;
	} else {

		var user = new UserModel({_id: userId});
		user.fetch({
			success: function() {
				console.log("User was found: " + user.get('username'));
			},
			error: function() {
				console.log("User was not found: " + user.get('_id'));
			}
		});

		/*
		var admin = false;
		$.ajax({
			url: 'http://localhost:10010/user/'+userId,
			dataType: 'json',
			async: false,
			success: function(data) {
				var result = _.find(data.roles, function(obj){ return obj == "ROLE_ADMIN"} );
				if(!result) {
					admin = false;
				} else {
					admin = true;
				}
			}
		});
		*/
		return true;
	}
}

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
		var self = this;
		var username = $("input[name='username']").val();
		var password = $("input[name='password']").val();

		$.ajax({
			url: 'http://localhost:10010/auth',
			data: {username: username, password: password},
			method: 'post',
			async: false,
			success: function(user) {
				console.log("User found: " + user.username);
				var result = _.find(user.roles, function(obj){ return obj == "ROLE_ADMIN"} );
				if(result) {
					setCookie("userId", user._id);
				}
			},
			error: function(err) {
				event.preventDefault();
				console.log("Err: " + err);
				alert("Username or password is incorrect !");
				$("input[name='password']").val("");
			}
		});

	}
});