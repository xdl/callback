define(['views/base', 'text!templates/user_panel.html', 'views/user'], function(BaseView, UsersTemplate, User) {
	var Users = BaseView.extend({
		template: _.template(UsersTemplate),

		events: {
			'click input.user': 'selectUser'
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			this.renderUsers();
		},

		selectUser: function() {
			console.log('user selected');
		},

		renderUsers: function() {
			$('.user_container').empty();
			this.collection.fetch({
				success: function(collection, response, options) {
					collection.each(function(user) {
						var userHtml = new User({model:user}).render().el;
						$('.user_container').append(userHtml);
					});
				}
			});
		}
		
	});

	return Users;
});
