var ArticleModel = Backbone.Model.extend({
	idAttribute: '_id',
	defaults: {
		"title": "New article...",
		"body" : "Type your article text here...",
		"author" : null,
		"dateCreated": null,
		"lastUpdated": null,
		"published": false
	},
	urlRoot: "http://nfradin.fr:10010/articles",
})


var ArticleCollection = Backbone.Collection.extend({
	model: ArticleModel,
	url: 'http://nfradin.fr:10010/articles'
});