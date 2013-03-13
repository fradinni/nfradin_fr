var ArticleModel = Backbone.Model.extend({
	idAttribute: '_id',
	defaults: {
		"title": "New article...",
		"body" : "Type your article text here...",
		"author" : null,
		"dateCreated": new Date(),
		"lastUpdated": new Date(),
		"puplished": false
	},
	urlRoot: "http://localhost:10010/articles"
})


var ArticleCollection = Backbone.Collection.extend({
	model: ArticleModel,
	url: 'http://localhost:10010/articles'
});