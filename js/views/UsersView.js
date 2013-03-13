window.UsersView = Backbone.View.extend({

	dsBindings: {
		"#users-list tr": {
			dataSource: function(view){ return view.model; },
			itemEvents: {
				"click .delete": "deleteUser(_id, username)",
				"click .edit": "editUser(_id, username)"
			}
		}		
	},

	events: {
		"click #btn-user-dialog": "showUserDialog",
		"click #save_user": "saveUser"
	},

	initialize: function() {
		this.template = _.template(this.getTemplate("users/list"));
	},

	render: function() {
		$("#site-nav").hide();
		$("#admin-nav").show();
		$(this.el).html(this.template());

		this.bindDataSources();	// Bind datasources to view

		// Render subViews
		$(this.el).append(new CreateUserView({ model: {parentView: this} }).render().el);
		
		return this;
	},

	showUserDialog: function(e) {
		e.preventDefault();

		// Show modal
		$("#createUserModal").find(':input').each(function() { 
			$(this).val(''); 
			$(this).removeAttr('disabled');
		});
		$("#modal-title").html("Add user");
		$("#createUserModal").modal('show');
	},

	saveUser: function(e) {
		e.preventDefault();
		var self = this;

		// Serialize form datas
		var formData = $("#create-user-form").serializeObject();

		// New User
		if(!formData["_id"]) {
			// remove empty _id field from datas
			delete formData["_id"];
			formData["password"] = hex_md5(formData["password"]);

			// Create and insert user
			var user = new UserModel();
			user.save(formData, {
				success: function (user) {
		            self.model.fetch();
		        }
			});
		} 

		// Edit user
		else {
			var user = this.model.get(formData["_id"]);

			if(formData["password"]) formData["password"] = hex_md5(formData["password"]);

			user.save(formData, { 
				success: function() { 
					console.log("User updated !");
					self.model.fetch(); 
				}, 
				error: function(){
					alert('Unable to save user !');
				} 
			});
		}

		// Hide modal
		$("#createUserModal").modal('hide');
	},

	editUser: function(event, view, params) {
		event.preventDefault();

		var user = this.model.get(params['_id']);

		// Empty form fields
		$("#createUserModal").find(':input').each(function() { $(this).val(''); });

		// Fill form fields with model values
		$("#createUserModal").find(':input').each(function() { 
			$(this).val(user.get($(this).attr('id')));
		});

		// Set username disabled
		$("#createUserModal #username").attr('disabled', 'disabled');

		// Change title
		$("#modal-title").html("Edit user");

		// Show modal
		$("#createUserModal").modal('show');
	},

	deleteUser: function(event, view, params) {
		event.preventDefault();
		var user = this.model.get(params['_id']);
		var res = confirm("Delete user '"+params['username']+"' ?");
		if(res) {
			user.destroy();	
		} 
	}
});


window.CreateUserView = Backbone.View.extend({

	initialize: function() {
		this.template = _.template(this.getTemplate("users/create"));
	},

	render: function() {
		$(this.el).html(this.template());
		return this;
	}
});