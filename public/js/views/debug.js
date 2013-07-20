//the debug console.
define(['views/base', 'text!templates/debug.html'], function(BaseView, DebugTemplate) {
	var DebugView = BaseView.extend({

		el:'body',

		events: {
			'click button#populate_sample_users':'test_populateUsers',
			'click button#show_users': 'test_showUsers',
			'click button#remove_users': 'test_removeUsers',

			'click button#populate_sample_tasks': 'test_populateTasks',
			'click button#show_tasks': 'test_showTasks',
			'click button#remove_tasks': 'test_removeTasks',

			'click button#remove_everything': 'test_removeEverything',

			'click button#add_task': 'test_switchTask'
		},
		
		render: function() {
			this.$el.prepend(DebugTemplate);
		},

		test_removeEverything: function() {
			console.log('removing database...');
			$.ajax('/debug/everything', {
				type: "DELETE",
				success: function() {
					console.log('removed everything');
				}

			});
		},

		test_populateTasks: function(){
			console.log('adding tasks...');
			$.post('/debug/tasks', function() {
				console.log('done populating task');
			});
		},

		test_showTasks: function(){
			console.log('showing tasks...');
			$.get('/debug/tasks', function(payload) {
				console.log('done showing tasks:');
				console.log(payload);
			});
		},

		test_removeTasks: function(){
			console.log('removing tasks...');
			$.ajax('/debug/tasks', {
				type: "DELETE",
				success: function() {
					console.log('done removing task');
				}
			});
		},

		test_populateUsers: function() {
			console.log('populating...');
			$.post('/debug/users', function() {
				console.log('done populating users');
			});
		},

		test_showUsers: function() {
			console.log('showing users...');
			$.get('/debug/users', function(payload) {
				console.log('showing users succesful:');
				console.log(payload);
			});
		},
		test_removeUsers: function() {
			console.log('removing users...');
			$.ajax('/debug/users', {
				type: "DELETE",
				success: function() {
					console.log('removing users successful');
				}
			});
		}
	});

	return DebugView;
});
