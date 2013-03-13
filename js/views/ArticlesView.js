window.ArticlesView = Backbone.View.extend({

	initialize: function() {
		this.template = _.template(this.getTemplate("articles/list"));
	},

	render: function() {
		$("#site-nav").hide();
		$("#admin-nav").show();
		$(this.el).html(this.template());

		//this.bindDataSources();	// Bind datasources to view

		// Render subView
		//$(this.el).append(new CreateUserView({ model: {parentView: this} }).render().el);
		
		return this;
	}

});


window.CreateArticleView = Backbone.View.extend({

	initialize: function() {
		this.template = _.template(this.getTemplate("articles/create"));
	},

	render: function() {
		$("#site-nav").hide();
		$("#admin-nav").show();
		$(this.el).html(this.template());

		return this;
	},

});