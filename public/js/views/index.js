define(['views/base', 'text!templates/index.html'], function(BaseView, IndexTemplate) {
	var IndexView = BaseView.extend({
		el: $("#content"),

		events: {
			'submit form#login':'handleLogin'
		},
		render: function() {
			this.$el.html(IndexTemplate);

			//inserting the subview
			//this.debug = new DebugView();
			//this.debug.setElement(this.$('.debug_panel')).render();
		},

		//testing stuff here.
		handleLogin: function(e) {
			e.preventDefault();
			var username = $('input[name=user]').val();
			var password = $('input[name=password]').val();

			$.ajax('/login', {
				type: "POST",
				data: {username: username, password: password},
				success: function() {
					console.log('successfully logged in');
					window.location.hash = 'l_index';
				},
				error: function() {
					console.log('failed login');
				}
			});
		}

		//get rid of the subview
	//	destroy: function() {
	//		this.debug.undelegateEvents();
	//	}

	});

	return IndexView;
});
