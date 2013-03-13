var UserModel = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: "http://nfradin.fr:10010/users"
})


var UserCollection = Backbone.Collection.extend({
	model: UserModel,
	url: 'http://nfradin.fr:10010/users'
});