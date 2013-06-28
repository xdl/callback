define(['text!templates/index.html'], function(IndexTemplate) {
	var IndexView = Backbone.View.extend({
		el: $("#content"),
		initialize: function() {

		},
		events: {
			'submit form#login':'handleLogin',
			'click button#populate_sample_users':'test_populateUsers',
			'click button#show_users': 'test_showUsers',
			'click button#remove_users': 'test_removeUsers'
		},
		render: function() {
			this.$el.html(IndexTemplate);
		},

		//testing stuff here.
		handleLogin: function(e) {
			e.preventDefault();
			var username = $('input[name=user]').val();
			var password = $('input[name=password]').val();
			$.post('/login', {
				username: username,
				password: password
			},
			function(payload) {
				console.log(payload);
			});
		},

		test_populateUsers: function() {
			console.log('populating...');
			$.post('/test_populateUsers', function(payload) {
				console.log(payload);
			});
		},

		test_showUsers: function() {
			console.log('showing users...');
			$.post('/test_showUsers', function(payload) {
				console.log(payload);
			});
		},
		test_removeUsers: function() {
			console.log('removing users...');
			$.post('/test_removeUsers', function(payload) {
				console.log(payload);
			});
		}

	});

	return IndexView;
});
