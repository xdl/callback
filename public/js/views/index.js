define(['views/base', 'views/debug', 'text!templates/index.html'], function(BaseView, DebugView, IndexTemplate) {
	var IndexView = BaseView.extend({
		el: $("#content"),

		events: {
			'click a#preview': 'preview',
			'click a#create': 'create',
			'submit form#login':'handleLogin'
		},
		previewAccounts: [
			'homer',
			'marge',
			'bart',
			'lisa'
		],
		render: function() {
			this.$el.html(IndexTemplate);
		},
		create: function(e) {
			e.preventDefault();
			window.location.hash = 'create';
		},
		preview: function(e) {
			e.preventDefault();
			var rand = Math.floor(Math.random()*4);
			var user = this.previewAccounts[rand];
			var username = user;
			var password = user;

			$.ajax('/login', {
				type: "POST",
				data: {username: username, password: password, preview: true},
				success: function() {
					window.location.hash = 'preview';
				},
				error: function() {
				}
			});
		},
		//testing stuff here.
		handleLogin: function(e) {
			e.preventDefault();
			var username = this.$('input[name=user]').val();
			var password = this.$('input[name=password]').val();

			$.ajax('/login', {
				type: "POST",
				data: {username: username, password: password},
				success: function() {
					window.location.hash = 'debug';
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
