window.ArticlesView = Backbone.View.extend({

	dsBindings: {
		"#articles-list tr": {
			dataSource: function(view){ return view.model; },
			itemEvents: {
				"click .delete": "deleteArticle(_id)",
				"click .edit": "editArticle(_id)"
			}
		}		
	},

	initialize: function() {
		this.template = _.template(this.getTemplate("articles/list"));
	},

	render: function() {
		$("#site-nav").hide();
		$("#admin-nav").show();
		$(this.el).html(this.template());

		this.bindDataSources();	// Bind datasources to view

		return this;
	},

	editArticle: function(event, view, params) {
		var article = this.model.get(params['_id']);
	},

	deleteArticle: function(event, view, params) {
		alert('Delete: ' + params['_id']);
	}

});


window.CreateArticleView = Backbone.View.extend({

	events: {
		"click #btn-save-article": "saveArticle"
	},

	initialize: function() {
		this.template = _.template(this.getTemplate("articles/create"));
	},

	render: function() {
		$("#site-nav").hide();
		$("#admin-nav").show();
		if(this.model) {
			$(this.el).html(this.template( this.model.toJSON() ));
		} else {
			$(this.el).html(this.template());
		}
		
		return this;
	},

	saveArticle: function(event) {
		event.preventDefault();
		var self = this;
		// Serialize form datas
		var formData = $("#article-form").serializeObject();

		// New Article
		if(!formData["_id"]) {
			// remove empty _id field from datas
			delete formData["_id"];

			// Create and insert user
			var article = new ArticleModel();
			article.save(formData, {
				success: function (res) {
		            alert('Article saved !');
		        }, 
		        error: function(err) {
		        	alert('Unable to save article !');
		        }
			});
		} 

		// Edit Article
		else {
			var article = this.model;
			article.save(formData, { 
				success: function() { 
					console.log("User updated !");
					self.model.fetch(); 
				}, 
				error: function(){
					alert('Unable to save user !');
				} 
			});
		}
	}
});