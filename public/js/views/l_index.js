define(
	['views/base', 'text!templates/l_index.html', 'views/task_incoming', 'views/task_outgoing', 'models/TaskCollection', 'views/user_panel', 'models/UserCollection'], 
	function(BaseView, L_IndexTemplate, TaskIncoming, TaskOutgoing, TaskCollection, UserPanel, UserCollection) {
	var L_IndexView = BaseView.extend({
		el: $("#content"),
		initialize: function() {
			//this.listenTo(this.model, 'change', this.render);

			//task incoming stuff.
			var incoming_tasks_collection = new TaskCollection();
			incoming_tasks_collection.url = '/users/me/tasks';
			this.task_incoming = new TaskIncoming({model: this.model, collection: incoming_tasks_collection}); //the model contains the User details, the collection contains the tasks.

			//task outgoing stuff.
			//var outgoing_tasks_collection = new TaskCollection();
			//outgoing_tasks_collection.url = '/users/me/tasks';
			
			//user panel stuff.
			var user_collection = new UserCollection();
			var team = this.model.toJSON().team;
			user_collection.url = '/users/me/team/'+team;
			this.user_panel = new UserPanel({model: this.model, collection: user_collection}); //model contains the User details, collection contains the tasks.
			
		},
		template: _.template(L_IndexTemplate),

		events: {
			'click button#logout': 'handleLogout'
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));


			//task panel stuff
			this.task_incoming.setElement(this.$('.task_incoming')).render();

			//user panel stuff
			this.user_panel.setElement(this.$('.user_panel')).render();

		},

		handleLogout: function() {
			console.log('logging out');
			$.post('/logout', function() {
				console.log('sucessfully logged out. redirecting...');
				window.location.hash = 'index';
			});
		}



	});

	return L_IndexView;
});
