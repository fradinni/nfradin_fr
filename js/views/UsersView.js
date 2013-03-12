window.UsersView = Backbone.View.extend({

	dsBindings: {
		"#users-list tr": {
			dataSource: function(view){ return view.model; },
			itemEvents: {
				"click .delete": "deleteUser(_id, username)"
			}
		}		
	},

	events: {
		"click #add_user": "addUser"
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

	addUser: function(e) {
		e.preventDefault();

		// Serialize form datas
		var user = new UserModel($("#create-user-form").serializeObject());
		//user.set(formDatas);
		user.save({ error: function(){alert('Unable to add user !');} });
		this.model.fetch();

		// Hide modal
		$("#createUserModal").find(':input').each(function() { $(this).val(''); });
		$("#createUserModal").modal('hide');
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