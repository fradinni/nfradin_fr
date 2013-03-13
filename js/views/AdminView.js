window.AdminView = Backbone.View.extend({
	initialize: function() {
		this.template = _.template(this.getTemplate("admin"));
	},

	render: function() {
		$(this.el).html(this.template());
	}
});