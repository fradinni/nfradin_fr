window.ArticlesView = Backbone.View.extend({

	dsBindings: {
		"#articles-list tr": {
			dataSource: function(view){ return view.model; },
			itemEvents: {
				"click .delete": "deleteArticle(_id)"				
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

	deleteArticle: function(event, view, params) {
		event.preventDefault();
		var article = this.model.get(params['_id']);
		if(article && confirm("Delete article: '" + article.get('title') + "'")) {
			article.destroy();
		}
	}

});


window.CreateArticleView = Backbone.View.extend({

	events: {
		"click #btn-save-article": "saveArticle",
		"click #status-published": "publishArticle",
		"click #status-draft": "draftArticle"
	},

	initialize: function() {
		this.template = _.template(this.getTemplate("articles/create"));
	},

	render: function() {
		this.author = findUserById(this.model.get('author'));

		$("#site-nav").hide();
		$("#admin-nav").show();
		if(this.model) {
			$(this.el).html(this.template( this.model.toJSON() ));
			$("#_id", this.el).val(this.model.get('_id'));
			$("#ui-id", this.el).val(this.model.get('_id'));
		} else {
			$(this.el).html(this.template());
		}
		
		return this;
	},

	publishArticle: function(event) {
		if(!this.model.get('_id')) {
			alert('Please save article first !');
			return;
		}
		var self = this;
		this.model.save({published: true}, {
			success: function() {
				self.render();
			}
		});
	},

	draftArticle: function(event) {
		if(!this.model.get('_id')) {
			alert('Please save article first !');
			return;
		}
		var self = this;
		this.model.save({published: false}, {
			success: function() {
				self.render();
			}
		});
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
					self.model.fetch({
						success: function() {
							alert('Article saved !');
							self.render();
						}
					});
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
					self.model.fetch({
						success: function() {
							alert('Article saved !');
							self.render();
						}
					});
				}, 
				error: function(){
					alert('Unable to save article !');
				} 
			});
		}
	}
});