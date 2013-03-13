var UserModel = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: "http://localhost:10010/users"
})


var UserCollection = Backbone.Collection.extend({
	model: UserModel,
	url: 'http://localhost:10010/users'
});