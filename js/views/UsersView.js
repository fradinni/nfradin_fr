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

	saveUser: function(e) {
		e.preventDefault();
		var self = this;

		// Serialize form datas
		var formData = $("#create-user-form").serializeObject();

		// New User
		if(!formData["_id"]) {
			var user = new UserModel(formData);
			user.save({}, { 
				success: function() { 
					self.model.fetch(); 
				}, 
				error: function(){
					alert('Unable to add user !');
				} 
			});
		} 

		// Edit user
		else {
			var user = this.model.get(formData["_id"]);
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

		
		//user.set(formDatas);
		

		// Hide modal
		$("#createUserModal").find(':input').each(function() { $(this).val(''); });
		$("#createUserModal").modal('hide');
	},

	editUser: function(event, view, params) {
		event.preventDefault();

		var user = this.model.get(params['_id']);

		// Fill form fields
		$("#createUserModal").find(':input').each(function() { 
			$(this).val(user.get($(this).attr('id'))); 
		});


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