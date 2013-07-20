define(['views/base', 'text!templates/user.html'], function(BaseView, UserTemplate) {
	var User = BaseView.extend({
		tagName: 'li',

		template: _.template(UserTemplate),

		events: {
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}


	});

	return User;
});
