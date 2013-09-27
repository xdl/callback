define(['views/base', 'text!templates/dashboard.html'], function(BaseView, DashboardTemplate) {
	var Dashboard = BaseView.extend({
		tagName: 'div',
		template: _.template(DashboardTemplate),
		initialize: function(options) {
			this.Directory = options.Directory;

			this.listenTo(this.model, 'change:active_task', this.render);
			Backbone.on('changeTask', this.changeTask, this);
		},
		destroy:function() {
			Backbone.off('changeTask', this.changeTask, this);
		},
		events: {
			'click a#logout': 'handleLogout'
		},
		changeTask: function(res) {
			var taskName = this.Directory.tasks.assigned[res.info.task].task_name;
			var taskID = this.Directory.tasks.assigned[res.info.task]._id;

			this.model.save({'active_task': taskName,
						   'task_id': taskID});
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
		},
		handleLogout: function() {
			$.post('/logout', function() {
				console.log('logging out');
				window.location.hash = 'index';
			});
		}

	});

	return Dashboard;
});
