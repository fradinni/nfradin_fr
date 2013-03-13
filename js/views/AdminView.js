window.AdminView = Backbone.View.extend({
	initialize: function() {
		this.template = _.template(this.getTemplate("admin"));
	},

	render: function() {
		$(this.el).html(this.template());
		$("#toggle-header").unbind('click');
		$("#toggle-header").bind('click', this.toggleHeader);
	},

	toggleHeader: function(e) {
		e.preventDefault();
		if($(".subhead").css('display') == 'block') {
			$(".subhead").slideUp();
			$("#toggle-header i").attr('class', 'icon-plus');
		} else {
			$(".subhead").slideDown();
			$("#toggle-header i").attr('class', 'icon-minus');
		}
	}
});