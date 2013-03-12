var UserModel = Backbone.Model.extend({
	urlRoot: "http://localhost:10010/user"
})


var UserCollection = Backbone.Collection.extend({
	model: UserModel,
	url: 'http://localhost:10010/users'
});