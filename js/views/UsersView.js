window.UsersView = Backbone.View.extend({

	dsBindings: {
		"#users-list tr": {
			dataSource: function(view){ return view.model; },
			itemEvents: {
				"click .delete": "deleteUser(_id, username)"
			}
		}		
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

	deleteUser: function(event, view, params) {
		event.preventDefault();
		var res = confirm("Delete user '"+params['username']+"' ?");
		var self = this;
		if(res) {
			var nbModels = this.model.models.length;
			$.ajax({
				cache: false,
				url: 'http://localhost:10010/user/'+params['_id'],
				async: false,
				type: 'DELETE',
				success: function() {},
				error: function(err) {
					console.log("Err :" + err);
				}
			});
			self.model.fetch();
			/*
			var newNbModels = this.model.models.length;
			if(newNbModels < nbModels) {
				alert("User deleted !");
			} else {
				alert("Unable to deleted user !");
			}			
			*/	
		} 
	}
});


window.CreateUserView = Backbone.View.extend({

	events: {
		"click #add_user": "addUser"
	},

	initialize: function() {
		this.template = _.template(this.getTemplate("users/create"));
	},

	render: function() {
		$(this.el).html(this.template());
		return this;
	},

	addUser: function(e) {
		e.preventDefault();

		// Serialize form datas
		var formDatas = $("#create-user-form").serialize();
		var self = this;

		$.ajax({
			url: 'http://localhost:10010/user',
			method: 'post',
			async: false,
			data: formDatas,
			success: function(data) {
				console.log("User added: " + data[0]._id);
				self.model.parentView.model.fetch();
			},
			error: function(err) {
				console.error("Unable to add user: " + err);
				alert("Unable to add user !");
			}
		})

		// Hide modal
		$("#createUserModal").find(':input').each(function() { $(this).val(''); });
		$("#createUserModal").modal('hide');
	}
});